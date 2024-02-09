import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || 0);
    const [images, setImages] = useState("");
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter();

    async function createProduct(e) {
        e.preventDefault();
        const data = { title, description, price };
        if (_id) {
            await axios.put('/api/products', { ...data, _id });
        } else {
            await axios.post('/api/products', data);
        }
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImage(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
           const res = await axios.post('/api/upload',data);
           console.log(res.data)
        }
    }

    return (
        // <Layout>
        <form onSubmit={createProduct}>
            <label htmlFor="productName">Product Name</label>
            <input
                type="text"
                placeholder="Product Name"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label>
                Photos
            </label>
            <label
                onChange={uploadImage}
                className="cursor-pointer flex text-sm text-gray-500 rounded-lg font-[500] flex-col justify-center items-center w-24 h-24 bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
                <input type="file" className="hidden" />
            </label>
            <div>
                {!images?.length && (
                    <div>No Images found</div>
                )}
            </div>

            <label htmlFor="description">Description</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <label htmlFor="price">Price</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button type="submit" className="btn-primary">Save</button>
        </form>
        // </Layout>
    );
}

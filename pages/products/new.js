import Layout from "@/Components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter();

    async function createProduct(e) {
        e.preventDefault();
        const data = { title, description, price };
        await axios.post('/api/products', data);
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push('/products')
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <label htmlFor="productName">Product Name</label>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
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
        </Layout>
    );
}

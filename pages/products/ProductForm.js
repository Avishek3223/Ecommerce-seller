import Spinner from "@/Components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory,
    properties:existingProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || 0);
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false)
    const [category, setCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState(existingProperties || '')
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState('');
    const router = useRouter();

    // Declare propertiesToFill outside of any conditional blocks
    const [propertiesToFill, setPropertiesToFill] = useState([]);

    async function createProduct(e) {
        e.preventDefault();
        const data = { title, description, price, images, category, properties:productProperties };
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
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => [...oldImages, ...res.data.links]);
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            // setProductProperties(result)
            console.log(result)
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, []); // Ensure this effect runs only once, by providing an empty dependency array
    
    useEffect(() => {
        if (categories.length > 0 && category) {
            let catInfo = categories.find(({ _id }) => _id === category);
            if (catInfo && Array.isArray(catInfo.properties)) {
                let tempPropertiesToFill = catInfo.properties.slice(); // Make a copy to avoid mutating state directly
                while (catInfo?.parent?._id) {
                    const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
                    if (parentCat && Array.isArray(parentCat.properties)) {
                        tempPropertiesToFill = tempPropertiesToFill.concat(parentCat.properties);
                    }
                    catInfo = parentCat;
                }
                setPropertiesToFill(tempPropertiesToFill);
            }
        }
    }, [categories, category]); // Ensure this effect runs when categories or category change
    
    if (!categories || categories.length === 0) {
        return <Spinner />; // Show a spinner while categories are being fetched
    }    

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    return (
        <form className="flex flex-col gap-1" onSubmit={createProduct}>
            <label htmlFor="productName">Product Name</label>
            <input
                type="text"
                placeholder="Product Name"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label>Category</label>
            <select
                className="border border-gray-400 rounded-md"
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option value="">Uncategorize</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {categories.length > 0 && category && propertiesToFill.length > 0 && (
                <>
                    {propertiesToFill.map(p => (
                        <div className="flex gap-1" key={p.name}>
                            <div>{p.name}</div>
                            <select value={productProperties[p.name]} onChange={(e) => setProductProp(p.name, e.target.value)}>
                                {p.values.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </>
            )}
            <label>Photos</label>
            <div className="flex mb-2.flex-wrap gap-1">
                <ReactSortable
                    className="flex flex-wrap gap-1"
                    list={images} setList={updateImagesOrder}>
                    {images.length > 0 && images.map(link => (
                        <div key={link} className="h-24 rounded-lg">
                            <img src={link} alt="" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-15 p-1 flex items-center rounded-lg">
                        <Spinner />
                    </div>
                )}
                <label
                    onChange={uploadImage}
                    className="cursor-pointer flex text-sm text-gray-500 rounded-lg font-[500] flex-col justify-center items-center w-24 h-24 bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                    <input type="file" className="hidden" />
                </label>
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
    );
}  
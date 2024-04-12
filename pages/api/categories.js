import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*', 
  })
);
export default async function handle(req, res) {
    await cors(req, res);
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'))
    }
    await isAdminRequest(req,res);

    if (method === 'POST') {
        const {name,parentCategory,properties} = req.body;
        const categoryDoc = await Category.create({
          name,
          parent: parentCategory || undefined,
          properties,
        });
        res.json(categoryDoc);
      }
      
    if (method === 'PUT') {
        const { name, properties, _id } = req.body;
        try {
            const updatedCategory = await Category.findByIdAndUpdate(_id, {
                name,
                properties,
            })
            
            if (!updatedCategory) {
                return res.status(404).json({ error: "Category not found" });
            }
            
            res.json(updatedCategory);
        } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    
    if (method === 'DELETE') {
        if (req.query?._id) {
            res.json(await Category.deleteOne({ _id: req.query._id }))
        }
    }
}
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';
import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware';

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
  
  try {
    if (method === 'GET') {
      if (req.query?.id) {
        res.json(await Product.findOne({ _id: req.query.id }));
      } else {
        res.json(await Product.find());
      }
    } else {
      await isAdminRequest(req, res);
      if (method === 'POST') {
        const { title, description, price, images, category, properties } = req.body;
        const productDoc = await Product.create({
          title, description, price, images, category, properties,
        })
        res.json(productDoc);
      } else if (method === 'PUT') {
        const { title, description, price, images, category, properties, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, price, images, category, properties });
        res.json(true);
      } else if (method === 'DELETE') {
        if (req.query?.id) {
          await Product.deleteOne({ _id: req.query?.id });
          res.json(true);
        }
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

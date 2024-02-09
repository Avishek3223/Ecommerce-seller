import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }))
        } else {
            res.json(await Product.find());
        }
    } else if (method === 'POST') {
        const { title, description, price } = req.body;
        try {
            const productDoc = await Product.create({
                title, description, price,
            });
            res.json(productDoc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (method === 'PUT') {
        const { title, description, price, _id } = req.body;
        try {
            const productDoc = await Product.findByIdAndUpdate(_id, { title, description, price }, { new: true });
            res.json(productDoc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (method === 'DELETE') {
        if (req.query?.id) {
            res.json(await Product.deleteOne({ _id: req.query.id }))
        } 
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

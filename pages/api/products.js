import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        res.json(await Product.find());
    }

    if (method === 'POST') {
        const { title, description, price } = req.body;
        try {
            const productDoc = await Product.create({
                title, description, price,
            });
            res.json(productDoc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

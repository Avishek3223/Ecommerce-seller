import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
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
        res.json(await User.findOne({ _id: req.query.id }));
      } else {
        res.json(await User.find());
      }
    } else {
      if (method === 'POST') {
        // Create a new user
        const { email, password, username, phoneNumber, cart } = req.body;
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }
        const userDoc = await User.create({
          email, password, username, phoneNumber, cart
        });
        res.json(userDoc);
      } else if (method === 'PUT') {
        // Update user's cart by adding a product
        const { productId, userData } = req.body;
        if (!userData || !userData.email || !userData.password) {
          return res.status(400).json({ error: 'User data is missing or invalid' });
        }
        
        // Find the user by email and password
        const user = await User.findOne({ email: userData.email, password: userData.password });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Add the product to the user's cart
        user.cart.push(productId);
        await user.save();
        
        res.json(user);
      } else if (method === 'DELETE') {
        if (req.query?.userId && req.query?.productId) {
          // Find the user by ID
          const user = await User.findOne({ _id: req.query.userId });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Log user cart before deletion
          console.log('User cart before deletion:', user.cart);

          // Remove the product from the user's cart
          const updatedCart = user.cart.filter((productId) => productId.toString() !== req.query.productId.toString());
          user.cart = updatedCart;

          // Log updated cart before saving
          console.log('Updated cart before saving:', updatedCart);

          // Save the user document with the updated cart
          await user.save();

          // Log user after deletion
          console.log('User after deletion:', user);

          res.json(user);
        } else {
          return res.status(400).json({ error: 'User ID and Product ID are required' });
        }
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

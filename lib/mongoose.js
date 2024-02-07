import mongoose from 'mongoose';

export async function mongooseConnect() {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

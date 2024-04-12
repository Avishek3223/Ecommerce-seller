import mongoose, { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String},
  phoneNumber: { type: String },
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});

export const User = models.User || model('User', UserSchema);

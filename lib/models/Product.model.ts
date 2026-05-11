// START: PRODUCT_MODEL
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  store: mongoose.Types.ObjectId;    // ref: Store
  seller: mongoose.Types.ObjectId;   // ref: User
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];                  // Array Cloudinary URLs
  stock: number;
  unit: string;                      // 'pcs', 'kg', 'liter', dll
  isAvailable: boolean;
  tags: string[];
}

const ProductSchema = new Schema<IProduct>({
  store:       { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  seller:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true },
  images:      [{ type: String }],   // min 1 gambar
  stock:       { type: Number, default: 0 },
  unit:        { type: String, default: 'pcs' },
  isAvailable: { type: Boolean, default: true },
  tags:        [{ type: String }],
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
// END: PRODUCT_MODEL

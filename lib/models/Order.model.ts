// START: ORDER_MODEL
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;        // snapshot nama produk saat pesan
  price: number;       // snapshot harga saat pesan
  quantity: number;
  image: string;       // snapshot gambar saat pesan
}

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;

  // Delivery atau Pickup
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  estimatedDistance?: number;        // dalam meter (dari Google Maps)
  estimatedDuration?: string;        // estimasi waktu, misal "15 menit"

  // Status pesanan
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_delivery' | 'completed' | 'cancelled';

  // Pembayaran
  paymentMethod: 'cash' | 'transfer';
  paymentStatus: 'waiting' | 'confirmed' | 'paid';
  paymentProof?: string;             // URL Cloudinary bukti transfer

  notes?: string;
  cancelReason?: string;
}

const OrderSchema = new Schema<IOrder>({
  buyer:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  store:       { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  seller:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:    { type: String, required: true },
  }],
  totalAmount: { type: Number, required: true },
  orderType:   { type: String, enum: ['delivery', 'pickup'], required: true },
  deliveryAddress: { type: String },
  deliveryLocation: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
  },
  estimatedDistance: { type: Number },
  estimatedDuration: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'on_delivery', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['cash', 'transfer'], required: true },
  paymentStatus: { type: String, enum: ['waiting', 'confirmed', 'paid'], default: 'waiting' },
  paymentProof:  { type: String },
  notes:         { type: String },
  cancelReason:  { type: String },
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
// END: ORDER_MODEL

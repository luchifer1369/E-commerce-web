// START: STORE_MODEL
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStore extends Document {
  owner: mongoose.Types.ObjectId;    // ref: User
  name: string;
  description: string;
  category: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];   // [longitude, latitude]
  };
  placeId?: string;                  // Google Places ID
  images: string[];                  // Cloudinary URLs
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const StoreSchema = new Schema<IStore>({
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String },
  category:    { type: String, required: true },
  address:     { type: String, required: true },
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },  // [lng, lat]
  },
  placeId:     { type: String },
  images:      [{ type: String }],
  isVerified:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  totalReviews:{ type: Number, default: 0 },
  bankAccount: {
    bankName:      { type: String },
    accountNumber: { type: String },
    accountName:   { type: String },
  }
}, { timestamps: true });

// Index geospatial untuk query toko terdekat
StoreSchema.index({ location: '2dsphere' });

const Store: Model<IStore> = mongoose.models.Store || mongoose.model('Store', StoreSchema);
export default Store;
// END: STORE_MODEL

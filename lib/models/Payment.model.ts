// START: PAYMENT_MODEL
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  amount: number;
  method: 'cash' | 'transfer';

  // Khusus transfer
  bankName?: string;                 // BCA, Mandiri, BRI, dll
  accountNumber?: string;            // Rekening tujuan penjual
  transferProof?: string;            // URL Cloudinary bukti transfer
  transferredAt?: Date;

  status: 'pending' | 'submitted' | 'confirmed' | 'rejected';
  confirmedBy?: mongoose.Types.ObjectId;  // Admin/seller yang konfirmasi
  confirmedAt?: Date;
  rejectionReason?: string;
}

const PaymentSchema = new Schema<IPayment>({
  order:  { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  buyer:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'transfer'], required: true },
  bankName:      { type: String },
  accountNumber: { type: String },
  transferProof: { type: String },
  transferredAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'submitted', 'confirmed', 'rejected'], 
    default: 'pending' 
  },
  confirmedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: { type: Date },
  rejectionReason: { type: String },
}, { timestamps: true });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export default Payment;
// END: PAYMENT_MODEL

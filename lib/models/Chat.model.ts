// START: CHAT_MODEL
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;   // ref: User
  senderRole: 'buyer' | 'seller';
  content: string;
  type: 'text' | 'image';
  isRead: boolean;
  createdAt: Date;
}

export interface IChat extends Document {
  order: mongoose.Types.ObjectId;    // ref: Order (1 chat per order)
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessage: string;
  lastMessageAt: Date;
  buyerUnreadCount: number;
  sellerUnreadCount: number;
}

const ChatSchema = new Schema<IChat>({
  order:   { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  buyer:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seller:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  store:   { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  messages: [{
    sender:     { type: Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: ['buyer', 'seller'] },
    content:    { type: String, required: true },
    type:       { type: String, enum: ['text', 'image'], default: 'text' },
    isRead:     { type: Boolean, default: false },
    createdAt:  { type: Date, default: Date.now },
  }],
  lastMessage:       { type: String },
  lastMessageAt:     { type: Date },
  buyerUnreadCount:  { type: Number, default: 0 },
  sellerUnreadCount: { type: Number, default: 0 },
}, { timestamps: true });

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
export default Chat;
// END: CHAT_MODEL

import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
    renterName: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    daysToPay: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    remainingDays: { type: Number },
    lastPaymentDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const Product = models.Product || model('Product', productSchema);
export default Product;

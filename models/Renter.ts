import { Schema, model, models } from 'mongoose';

const renterSchema = new Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

const Renter = models.Renter || model('Renter', renterSchema);
export default Renter;

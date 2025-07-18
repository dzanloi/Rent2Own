import { Schema, model, models } from 'mongoose';

const renterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // not required for Google users
}, {
    timestamps: true,
});

const Renter = models.Renter || model('Renter', renterSchema);
export default Renter;

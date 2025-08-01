import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // not required for Google users
}, {
    timestamps: true,
});

const User = models.User || model('User', userSchema);
export default User;

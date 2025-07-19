import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connection"
import User from "@/models/User"
import bcrypt from 'bcryptjs'
import { toast } from "sonner";

export async function POST(request: Request) {
    try {
        const { name, password, confirmPassword } = await request.json();

        if (password !== confirmPassword) {
            toast("Passwords do not match");
            return;
        }

        await connectDB();

        const existing = await User.findOne({ name });
        if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            password: hashedPass,
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        toast("Error in registration:", error);
        return NextResponse.json({message: "Failed to Register"}, {status:500})
    }
}

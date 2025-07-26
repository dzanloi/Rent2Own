import Product from "@/models/Product";
import { connectDB } from "@/lib/connection";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    product.amountPaid += product.dailyRate;
    product.remainingDays = Math.max(product.remainingDays - 1, 0);
    product.lastPaymentDate = new Date();

    await product.save();

    return NextResponse.json(product, { status: 200 });
}

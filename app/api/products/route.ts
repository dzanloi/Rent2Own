import { connectDB } from "@/lib/connection";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const newProduct = await Product.create(body);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error addding product");
        return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const products = await Product.find({}).sort({ createdAt: -1 });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products");
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

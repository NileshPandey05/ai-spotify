import { connect } from "@/dbConfig/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

const signinInputSchemaValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = signinInputSchemaValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input!" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Create a secure response
    const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, 
    });

    return response;

  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

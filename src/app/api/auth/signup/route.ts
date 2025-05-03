import { connect } from "@/dbConfig/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


connect();

const inputSchemaValidation = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // set this securely in .env

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = inputSchemaValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input!" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookie
    const response = NextResponse.json(
      { message: "User Signup successfully" },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Error while Signup:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}

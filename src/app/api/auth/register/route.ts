import { NextResponse } from "next/server";
import { prisma } from "@/src/_lib/prisma";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const SALT_ROUNDS = 10;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, friendly_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.emails.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const encrypted_password = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate authentication token
    const authentication_token = randomBytes(16).toString("hex");

    // Use Moonstone hub (ID: 3)
    const hub_id = parseInt(process.env.MOONSTONE_HUB_ID || "3", 10);

    // Create user, email, profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.users.create({
        data: {
          name: name || "",
          friendly_name: friendly_name || name || "",
          encrypted_password,
          authentication_token,
          admin: 0,
          activated: false,
          last_used_hub_id: hub_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Create confirmed email
      const emailRecord = await tx.emails.create({
        data: {
          email: email.toLowerCase(),
          user_id: user.id,
          primary: true,
          confirmed_at: new Date(),
        },
      });

      // Create profile
      const profile = await tx.profiles.create({
        data: {
          profileable_id: user.id,
          profileable_type: "User",
          name: user.name,
          visibility: "public",
          public: false,
          provisional: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Generate unique slug
      const baseSlug = generateSlug(user.friendly_name || user.name || email);
      let slug = baseSlug;
      let counter = 1;

      while (await tx.profile_slugs.findFirst({ where: { slug, hub_id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create profile slug
      await tx.profile_slugs.create({
        data: {
          profile_id: profile.id,
          slug,
          hub_id,
          redirect: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Create hub membership
      await tx.members.create({
        data: {
          target_type: "Profile",
          target_id: profile.id,
          hub_id,
          primary: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return { user, emailRecord, profile, slug };
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.user.id,
          email: result.emailRecord.email,
          name: result.user.name,
          friendlyName: result.user.friendly_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}

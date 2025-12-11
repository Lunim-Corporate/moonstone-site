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

    // Hash password (bcrypt with 10 rounds - Rails Devise compatible)
    const encrypted_password = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate authentication token (32 random characters)
    const authentication_token = randomBytes(16).toString("hex");

    // Use Moonstone hub (ID: 3)
    const hub_id = BigInt(process.env.MOONSTONE_HUB_ID || "3");

    // Create user, email, profile, membership, and subscription in a transaction
    // This matches Tabb's registration flow exactly
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create user with last_used_hub_id
      const user = await tx.users.create({
        data: {
          name: name || "",
          friendly_name: friendly_name || name || "",
          encrypted_password,
          authentication_token,
          admin: 0, // Default to free member (0 = Free, 1 = Premium, 2 = Moderator, 3+ = Admin)
          activated: false,
          last_used_hub_id: hub_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // 2. Create confirmed email
      const emailRecord = await tx.emails.create({
        data: {
          email: email.toLowerCase(),
          user_id: user.id,
          primary: true,
          confirmed_at: new Date(), // Auto-confirm for demo
        },
      });

      // 3. Create profile
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

      // 4. Generate unique slug for this hub
      const baseSlug = generateSlug(user.friendly_name || user.name || email);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug is unique within Moonstone hub
      while (
        await tx.profile_slugs.findFirst({ where: { slug, hub_id } })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // 5. Create hub-specific profile slug
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

      // 6. Create hub membership (links profile to Moonstone hub)
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

      // 7. Get or create default "iron" price plan for Moonstone hub
      let ironPlan = await tx.price_plans.findFirst({
        where: {
          code: "iron",
          hub_id,
        },
      });

      if (!ironPlan) {
        ironPlan = await tx.price_plans.create({
          data: {
            code: "iron",
            name: "Iron",
            hub_id,
            charge_pence: 0,
            charge_pence_yearly: 0,
            charge_us_cents: 0,
            charge_us_cents_yearly: 0,
            charge_eu_cents: 0,
            charge_eu_cents_yearly: 0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      // 8. Create default subscription (iron/free plan)
      const subscription = await tx.subscriptions.create({
        data: {
          user_id: Number(user.id),
          price_plan_id: ironPlan.id,
          hub_id,
          current: true,
          state: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return { user, emailRecord, profile, slug, subscription, ironPlan };
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: Number(result.user.id),
          email: result.emailRecord.email,
          name: result.user.name,
          friendlyName: result.user.friendly_name,
          admin: result.user.admin,
        },
        profile: {
          id: result.profile.id,
          slug: result.slug,
          name: result.profile.name,
          visibility: result.profile.visibility,
        },
        subscription: {
          id: result.subscription.id,
          tier: result.ironPlan.code,
          plan_name: result.ironPlan.name,
          current: result.subscription.current,
        },
        hub_id: Number(process.env.MOONSTONE_HUB_ID || "3"),
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

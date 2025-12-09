import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/src/_lib/prisma";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const moonstoneHubId = BigInt(
            process.env.MOONSTONE_HUB_ID || "3"
          );

          // Find user with confirmed email
          const emailRecord = await prisma.emails.findFirst({
            where: {
              email: credentials.email.toLowerCase(),
              confirmed_at: { not: null },
            },
            include: {
              users: {
                include: {
                  emails: {
                    where: { primary: true },
                    take: 1,
                  },
                },
              },
            },
          });

          if (!emailRecord || !emailRecord.users) {
            throw new Error("Invalid credentials");
          }

          const user = emailRecord.users;

          // Check if user is locked
          if (user.locked_at) {
            throw new Error("Account is locked. Please contact support.");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.encrypted_password
          );

          if (!isPasswordValid) {
            // Increment failed attempts
            await prisma.users.update({
              where: { id: user.id },
              data: { failed_attempts: (user.failed_attempts || 0) + 1 },
            });
            throw new Error("Invalid credentials");
          }

          // Update sign-in tracking and set last used hub to Moonstone
          await prisma.users.update({
            where: { id: user.id },
            data: {
              sign_in_count: (user.sign_in_count || 0) + 1,
              current_sign_in_at: new Date(),
              last_sign_in_at: user.current_sign_in_at,
              failed_attempts: 0,
              last_used_hub_id: moonstoneHubId,
            },
          });

          // Get user profile for Moonstone hub
          const userProfile = await prisma.profiles.findFirst({
            where: {
              profileable_id: user.id,
              profileable_type: "User",
            },
            include: {
              profile_slugs: {
                where: {
                  redirect: false,
                  hub_id: moonstoneHubId,
                },
                orderBy: { created_at: "desc" },
                take: 1,
              },
              profile_images: {
                where: { selected: true },
                take: 1,
              },
            },
          });

          // Verify user is a member of Moonstone hub
          const membership = await prisma.members.findFirst({
            where: {
              target_type: "Profile",
              target_id: userProfile?.id,
              hub_id: moonstoneHubId,
            },
          });

          if (!membership) {
            throw new Error("User is not a member of Moonstone hub");
          }

          return {
            id: user.id.toString(),
            email: emailRecord.email,
            name: user.name,
            image: userProfile?.profile_images[0]?.image || null,
            friendlyName: user.friendly_name,
            admin: user.admin,
            slug: userProfile?.profile_slugs[0]?.slug || null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.friendlyName = user.friendlyName;
        token.admin = user.admin;
        token.slug = user.slug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.friendlyName = token.friendlyName;
        session.user.admin = token.admin;
        session.user.slug = token.slug;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const TABB_BACKEND_URL = process.env.TABB_BACKEND_URL || "http://localhost:3001";
const MOONSTONE_HUB_ID = parseInt(process.env.MOONSTONE_HUB_ID || "3", 10);
const DEBUG_MOONSTONE_AUTH = ["1", "true", "yes"].includes(
  (process.env.DEBUG_MOONSTONE_AUTH || "").trim().toLowerCase()
);

function debugMoonstoneAuth(message: string, meta?: Record<string, unknown>) {
  if (!DEBUG_MOONSTONE_AUTH) return;
  if (meta) {
    console.log(`[MoonstoneAuth] ${message}`, meta);
    return;
  }
  console.log(`[MoonstoneAuth] ${message}`);
}

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
          debugMoonstoneAuth("Missing credentials", {
            email: credentials?.email?.toLowerCase() || null,
            hubId: MOONSTONE_HUB_ID,
          });
          throw new Error("Missing credentials");
        }

        try {
          debugMoonstoneAuth("Attempting backend login", {
            email: credentials.email.toLowerCase(),
            hubId: MOONSTONE_HUB_ID,
            backendUrl: TABB_BACKEND_URL,
          });

          // Call tabb-identity-backend login API
          const response = await fetch(`${TABB_BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              hub_id: MOONSTONE_HUB_ID,
            }),
          });

          const data = await response.json();
          debugMoonstoneAuth("Backend login response", {
            email: credentials.email.toLowerCase(),
            status: response.status,
            ok: response.ok,
            userId: data?.user?.id ?? null,
            globalAdmin: data?.user?.globalAdmin ?? null,
            userAdmin: data?.user?.admin ?? null,
            hasProfile: !!data?.profile,
            hubId: data?.hub?.id ?? null,
            backendMessage: data?.message ?? null,
          });

          if (!response.ok) {
            throw new Error(data.message || "Sorry, that email and password combination is not recognized. Please try again.");
          }

          // Check if user is a member of Moonstone hub (profile will be null if not)
          if (!data.profile) {
            debugMoonstoneAuth("Moonstone membership check failed", {
              email: credentials.email.toLowerCase(),
              userId: data?.user?.id ?? null,
              globalAdmin: data?.user?.globalAdmin ?? null,
              userAdmin: data?.user?.admin ?? null,
              hasProfile: false,
              hubId: data?.hub?.id ?? MOONSTONE_HUB_ID,
            });
            throw new Error("User is not a member of Moonstone hub");
          }

          debugMoonstoneAuth("Moonstone login success", {
            email: credentials.email.toLowerCase(),
            userId: data.user.id,
            hasProfile: true,
            hubId: data?.hub?.id ?? MOONSTONE_HUB_ID,
          });

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.name,
            image: data.profile.image || null,
            friendlyName: data.user.friendlyName,
            admin: data.user.admin,
            slug: data.profile.slug || null,
            backendToken: data.token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          debugMoonstoneAuth("Moonstone auth exception", {
            email: credentials.email.toLowerCase(),
            message: error instanceof Error ? error.message : "Unknown auth error",
            hubId: MOONSTONE_HUB_ID,
          });
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
        token.backendToken = user.backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.email = token.email as string;
        session.user.friendlyName = token.friendlyName;
        session.user.admin = token.admin;
        session.user.slug = token.slug;
      }
      // Store backend token on session (not on session.user to avoid exposing to client)
      session.backendToken = token.backendToken;
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

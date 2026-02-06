import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    friendlyName?: string | null;
    admin?: number;
    slug?: string | null;
    backendToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      friendlyName?: string | null;
      admin?: number;
      slug?: string | null;
    };
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    friendlyName?: string | null;
    admin?: number;
    slug?: string | null;
    backendToken?: string;
  }
}

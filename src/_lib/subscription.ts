import { prisma } from "./prisma";

export type SubscriptionTier = "iron" | "bronze" | "silver" | null;

export interface UserSubscription {
  tier: SubscriptionTier;
  hasAccess: boolean;
  pricePlanId: number | null;
  subscriptionId: number | null;
}

// Tiers that have access to premium content (deal room)
// Can be overridden via DEAL_ROOM_ALLOWED_TIERS env variable
const DEFAULT_ALLOWED_TIERS = ["bronze", "silver"];

function getAllowedTiers(): string[] {
  const envTiers = process.env.DEAL_ROOM_ALLOWED_TIERS;
  if (envTiers) {
    return envTiers.split(",").map((t) => t.trim().toLowerCase());
  }
  return DEFAULT_ALLOWED_TIERS;
}

/**
 * Get user's active subscription for Moonstone hub
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  try {
    const moonstoneHubId = BigInt(process.env.MOONSTONE_HUB_ID || "3");
    const userIdBigInt = BigInt(userId);

    // Find active subscription for user in Moonstone hub
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: Number(userIdBigInt),
        hub_id: moonstoneHubId,
        current: true, // Only current subscriptions
      },
      include: {
        price_plans: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!subscription || !subscription.price_plans) {
      return {
        tier: null,
        hasAccess: false,
        pricePlanId: null,
        subscriptionId: null,
      };
    }

    const tier = subscription.price_plans.code as SubscriptionTier;
    const allowedTiers = getAllowedTiers();

    return {
      tier,
      hasAccess: tier !== null && allowedTiers.includes(tier),
      pricePlanId: subscription.price_plans.id,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      tier: null,
      hasAccess: false,
      pricePlanId: null,
      subscriptionId: null,
    };
  }
}

/**
 * Check if user has access to premium content (deal room)
 * Returns true if user has bronze or silver tier
 */
export async function hasAccessToDealRoom(
  userId: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription.hasAccess;
}

/**
 * Get all price plans for Moonstone hub
 */
export async function getMoonstonePricePlans() {
  try {
    const moonstoneHubId = BigInt(process.env.MOONSTONE_HUB_ID || "3");

    const pricePlans = await prisma.price_plans.findMany({
      where: {
        hub_id: moonstoneHubId,
      },
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        code: true,
        name: true,
        charge_pence: true,
        charge_us_cents: true,
        charge_eu_cents: true,
        charge_pence_yearly: true,
        charge_us_cents_yearly: true,
        charge_eu_cents_yearly: true,
      },
    });

    return pricePlans;
  } catch (error) {
    console.error("Error fetching price plans:", error);
    return [];
  }
}

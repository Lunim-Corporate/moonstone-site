const TECH_SUITE_URL = process.env.TABB_BACKEND_URL || "http://localhost:3001";
const MOONSTONE_HUB_ID = parseInt(process.env.MOONSTONE_HUB_ID || "3", 10);

export type SubscriptionTier = "iron" | "bronze" | "silver" | "gold" | null;

export interface UserSubscription {
  tier: SubscriptionTier;
  hasAccess: boolean;
  hasRequestedAccess: boolean;
  pricePlanId: number | null;
  subscriptionId: number | null;
}

// Tiers that have access to premium content (deal room)
// Can be overridden via DEAL_ROOM_ALLOWED_TIERS env variable
const DEFAULT_ALLOWED_TIERS = ["gold"];

function getAllowedTiers(): string[] {
  const envTiers = process.env.DEAL_ROOM_ALLOWED_TIERS;
  if (envTiers) {
    return envTiers.split(",").map((t) => t.trim().toLowerCase());
  }
  return DEFAULT_ALLOWED_TIERS;
}

/**
 * Get user's active subscription for Moonstone hub
 * Now uses tech-suite API instead of direct database access
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  try {
    const allowedTiers = getAllowedTiers();
    const allowedTiersParam = allowedTiers.join(",");

    // Call tech-suite API to check subscription
    const response = await fetch(
      `${TECH_SUITE_URL}/api/subscriptions/check-access/${userId}/${MOONSTONE_HUB_ID}?allowedTiers=${allowedTiersParam}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch subscription from API:", response.status);
      return {
        tier: null,
        hasAccess: false,
        hasRequestedAccess: false,
        pricePlanId: null,
        subscriptionId: null,
      };
    }

    const data = await response.json();

    return {
      tier: data.tier as SubscriptionTier,
      hasAccess: data.hasAccess,
      hasRequestedAccess: data.hasRequestedAccess ?? false,
      pricePlanId: data.pricePlanId,
      subscriptionId: data.subscriptionId,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      tier: null,
      hasAccess: false,
      hasRequestedAccess: false,
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
 * Now uses tech-suite API instead of direct database access
 */
export async function getMoonstonePricePlans() {
  try {
    const response = await fetch(
      `${TECH_SUITE_URL}/api/subscriptions/price-plans/${MOONSTONE_HUB_ID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch price plans from API:", response.status);
      return [];
    }

    const pricePlans = await response.json();
    return pricePlans;
  } catch (error) {
    console.error("Error fetching price plans:", error);
    return [];
  }
}

/**
 * Send access attempt notification when a non-gold user tries to access deal room
 */
export async function sendAccessAttemptNotification(
  userId: string
): Promise<void> {
  try {
    await fetch(`${TECH_SUITE_URL}/api/notifications/access-attempt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(userId, 10),
        hub_id: MOONSTONE_HUB_ID,
      }),
    });
  } catch (error) {
    console.error("Error sending access attempt notification:", error);
    // Don't throw - this is a non-critical notification
  }
}

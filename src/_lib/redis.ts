import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis'

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

if (!UPSTASH_REDIS_REST_TOKEN || !UPSTASH_REDIS_REST_URL) {
  throw new Error("Missing Upstash Redis environment variables: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN");
}

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

// Default timeout: 5000 ms = 5 seconds

export const rateLimit = {
  generalEnquiry: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(3, '60 s'),
    // timeout: 3600000, // 1 hour until requests will be allowed again if rate limit exceeded
  }),
  passwordAccess: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(3, '3600 s'),
    // timeout: 3600000,
  }),
  checkPassword: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(8, '60 s'),
    // timeout: 3600000,
  }),
}

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export class RateLimitError extends Error {
  constructor() {
    super("RATE_LIMITED");
    this.name = "RateLimitError";
  }
}

const redis = Redis.fromEnv();
const cache = new Map();

export const rateLimiters = {
  createSubscription: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "60 s"),
    ephemeralCache: cache,
    prefix: "rl:create-sub",
  }),

  updateSubscription: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(10, "60 s"),
    ephemeralCache: cache,
    prefix: "rl:update-sub",
  }),

  deleteSubscription: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "60 s"),
    ephemeralCache: cache,
    prefix: "rl:delete-sub",
  }),
};

export async function enforceRateLimit(limiter: Ratelimit, userId: string) {
  const result = await limiter.limit(`user:${userId}`);

  if (!result.success) {
    throw new Error(`TOO_MANY_REQUESTS`);
  }

  return result;
}

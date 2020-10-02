export const Environment = {
  PRODUCTION: () => "production",
  STAGING: () => "staging",
  TEST: () => "test",
  NODE_ENV: () => (process.env.NODE_ENV || "test") as Env
};

type Env = "production" | "staging" | "test";

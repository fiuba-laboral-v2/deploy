export const Environment = {
  PRODUCTION: () => "production",
  STAGING: () => "staging",
  TEST: () => "test",
  NODE_ENV: () => (process.env.NODE_ENV || "test") as Env,
  isProduction: () => Environment.NODE_ENV() === Environment.PRODUCTION()
};

type Env = "production" | "staging" | "test";

const env = process.env.NODE_ENV as "production" | "staging";

export const BackendConfig = {
  production: {
    containerName: "fiuba-laboral-v2-backend",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/back-end.git",
      location: "./fiuba-laboral-v2/back-end",
      branch: "production"
    }
  },
  staging: {
    containerName: "fiuba-laboral-v2-backend",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/back-end.git",
      location: "./fiuba-laboral-v2/back-end",
      branch: "staging"
    }
  }
}[env];

if (BackendConfig === undefined) {
  throw new Error("NODE_ENV should be either 'production' or 'staging'")
}

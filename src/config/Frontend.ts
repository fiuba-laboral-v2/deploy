const env = process.env.NODE_ENV as "production" | "staging";

export const FrontendConfig = {
  production: {
    publicUrl: "http://laboral.fi.uba.ar/laboral",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/front-end.git",
      location: "./front-end",
      branch: "production"
    }
  },
  staging: {
    publicUrl: "http://antiguos.fi.uba.ar/laboral",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/front-end.git",
      location: "./front-end",
      branch: "staging"
    }
  }
}[env];

if (FrontendConfig === undefined) {
  throw new Error("NODE_ENV should be either 'production' or 'staging'")
}

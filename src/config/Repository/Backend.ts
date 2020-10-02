import { Environment } from "../Environment";

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
  },
  test: {
    containerName: "containerName",
    gitRepository: {
      url: "https://github.com/organization-name/repository-name.git",
      location: "./directory",
      branch: "master"
    }
  }
}[Environment.NODE_ENV()];

if (BackendConfig === undefined) {
  throw new Error("NODE_ENV should be either 'production' or 'staging'");
}

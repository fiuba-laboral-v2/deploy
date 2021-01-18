import { Environment } from "../Environment";
import { InvalidNodeEnvVariableError } from "../../models/Errors";

export const FrontendConfig = {
  production: {
    publicUrl: "http://laboral.fi.uba.ar/laboral",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/front-end.git",
      location: "./fiuba-laboral-v2/front-end",
      branch: "production"
    }
  },
  staging: {
    publicUrl: "http://antiguos.fi.uba.ar/laboral",
    gitRepository: {
      url: "https://github.com/fiuba-laboral-v2/front-end.git",
      location: "./fiuba-laboral-v2/front-end",
      branch: "staging"
    }
  },
  test: {
    publicUrl: "http://test.fi.uba.ar/laboral",
    gitRepository: {
      url: "https://github.com/organization-name/repository-name.git",
      location: "./directory",
      branch: "master"
    }
  }
}[Environment.NODE_ENV()];

if (FrontendConfig === undefined) throw new InvalidNodeEnvVariableError();

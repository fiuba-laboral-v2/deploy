import { Environment } from "./Environment";
import { InvalidNodeEnvVariableError } from "../models/Errors";

export const Config = {
  production: {
    hostname: "laboral.fi.uba.ar",
    sshAddress: "laboral@laboral.fi.uba.ar",
    user: "laboral"
  },
  staging: {
    hostname: "antiguos.fi.uba.ar",
    sshAddress: "laboral@antiguos.fi.uba.ar",
    user: "laboral"
  },
  test: {
    hostname: "test.fi.uba.ar",
    sshAddress: "test@antiguos.fi.uba.ar",
    user: "test"
  }
}[Environment.NODE_ENV()];

if (Config === undefined) throw new InvalidNodeEnvVariableError();

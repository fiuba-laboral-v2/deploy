import { Environment } from "./Environment";
import { InvalidNodeEnvVariableError } from "../models/Errors";

export const DeployConfig = {
  production: {
    hostname: "bolsadetrabajo.fi.uba.ar",
    frontendPath: "/",
    sshAddress: "dylan@dvt-1029",
    user: "dylan"
  },
  staging: {
    hostname: "antiguos.fi.uba.ar",
    frontendPath: "/laboral",
    sshAddress: "laboral@antiguos.fi.uba.ar",
    user: "laboral"
  },
  test: {
    hostname: "test.fi.uba.ar",
    frontendPath: "/test",
    sshAddress: "test@antiguos.fi.uba.ar",
    user: "test"
  }
}[Environment.NODE_ENV()];

if (DeployConfig === undefined) throw new InvalidNodeEnvVariableError();

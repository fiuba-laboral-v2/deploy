const env = process.env.NODE_ENV as "production" | "staging";

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
  }
}[env];

if (Config === undefined) {
  throw new Error("NODE_ENV should be either 'production' or 'staging'")
}

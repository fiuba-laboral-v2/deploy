import { Config } from "../src/config/deploy";
import shell from "shelljs";

const hostname = Config.hostname;
const frontendPath = Config.frontendPath;
const user = Config.user;
const sshAddress = Config.sshAddress;

const sshKeyArgument = "-o \"StrictHostKeyChecking no\"";
shell.exec(`ssh ${sshKeyArgument} ${sshAddress} 'mkdir -p $HOME/fiuba-laboral-v2/scripts/'`);
shell.exec(`scp ${sshKeyArgument} -r ./scripts/* ${sshAddress}:$HOME/fiuba-laboral-v2/scripts/`);
shell.exec(
  `
  ssh ${sshKeyArgument} -tt ${sshAddress} \
  '
    USER=${user}
    HOSTNAME=${hostname}
    FRONTEND_PATH=${frontendPath}
    bash fiuba-laboral-v2/scripts/setup.sh
  '
`
);

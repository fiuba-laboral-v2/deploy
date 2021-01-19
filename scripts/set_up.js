const { Config } = require("../src/config/deploy");
const shell = require("shelljs");

const hostname = Config.hostname;
const frontendPath = Config.frontendPath;
const user = Config.user;
const sshAddress = Config.sshAddress;

shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'mkdir $HOME/fiuba-laboral-v2/scripts/'`);
shell.exec(`scp -o "StrictHostKeyChecking no" -r ./scripts/* ${sshAddress}:$HOME/fiuba-laboral-v2/scripts/`);
shell.exec(`ssh -o "StrictHostKeyChecking no" -tt ${sshAddress} 'USER=${user} HOSTNAME=${hostname} FRONTEND_PATH=${frontendPath} bash fiuba-laboral-v2/scripts/setup.sh'`);

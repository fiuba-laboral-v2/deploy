const { Config } = require("../src/config");
const shell = require("shelljs");

const hostname = Config.hostname;
const frontendPath = Config.frontendPath;
const user = Config.user;
const sshAddress = Config.sshAddress;

shell.exec(`ssh -tt -o "StrictHostKeyChecking no" ${sshAddress} USER=${user} HOSTNAME=${hostname} FRONTEND_PATH=${frontendPath} bash scripts/setup.sh`);

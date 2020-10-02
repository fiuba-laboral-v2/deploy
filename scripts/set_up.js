const { Config } = require("../src/config");
const shell = require("shelljs");

const hostname = Config.hostname;
const user = Config.user;
const sshAddress = Config.ssh_address;

shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} USER=${user} HOSTNAME=${hostname} bash scripts/setup.sh`);

const deployJSON = require("$config/environment.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON.frontend[env];

const hostname = config.hostname;
const sshAddress = config.ssh_address;

shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo ufw allow 'Apache'`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} sudo ufw enable`);

shell.echo(`creating "/var/www/${hostname}/html" folder`);
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo mkdir -p "/var/www/${hostname}/html"`);

shell.echo(`creating user permissions for the "/var/www/${hostname}/html" folder`);
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo chown -R "$USER:$USER" "/var/www/${hostname}/html"`);
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo chmod -R 755 "/var/www/${hostname}"`);

shell.echo("creating apache cofiguration");
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} HOSTNAME=${hostname} bash scripts/set_default_settings.sh`);

shell.echo("Set up docker permissions");
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo groupadd docker`);
shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} sudo usermod -aG docker $USER`);

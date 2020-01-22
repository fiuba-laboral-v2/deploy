const deployJSON = require("$config/deploy.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON[env];
if (config === undefined) {
    shell.echo(`NODE_ENV should be either 'production' or 'staging'`);
    shell.exit(1);
}

function sshCommand(sshAddress) {
    return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

function throwErrorIfFails(code) {
    if (code !== 0 ) throw { code };
}

function removeRepository(gitRepository) {
    const command = `rm -rf ${gitRepository.location}`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function cloneRepository(sshAddress, gitRepository) {
    const command = `git clone -b ${gitRepository.branch} ${gitRepository.url} ${gitRepository.location}`;
    shell.echo(command);
    const code = shell.exec(`${command}`).code;
    throwErrorIfFails(code);
}

function buildHtml(gitRepository, publicURL) {
    const goToRepositoryLocation = `cd ${gitRepository.location}`;
    const installDependencies = "yarn install";
    const build = `PUBLIC_URL=${publicURL} yarn build`;
    const command = `${goToRepositoryLocation} && ${installDependencies} && ${build}`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function removeServedHtml(sshAddress, hostname) {
    const command = `${sshCommand(sshAddress)} rm -rf /var/www/${hostname}/html/*`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function deployHtml(sshAddress, gitRepository, hostname) {
    const command = `scp -o "StrictHostKeyChecking no" -r ${gitRepository.location}/build/* ${sshAddress}:/var/www/${hostname}/html/`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

const gitRepository = config.frontend.git_repository;
const hostname = config.hostname;
const publicURL = config.frontend.public_url;
const sshAddress = config.ssh_address;

try {
    removeRepository(gitRepository);
    cloneRepository(sshAddress, gitRepository);
    buildHtml(gitRepository, publicURL);
    removeServedHtml(sshAddress, hostname);
    deployHtml(sshAddress, gitRepository, hostname);
    removeRepository(gitRepository);
    return shell.exit(0);
} catch (e) {
    return shell.exit(e.code);
}

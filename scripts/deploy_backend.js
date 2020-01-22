const deployJSON = require("$config/deploy.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON.backend[env];
if (config === undefined) {
    shell.echo(`NODE_ENV should be either 'production' or 'staging'`);
    shell.exit(1);
}

function throwErrorIfFails(code) {
    if (code !== 0 ) throw { code };
}

function sshCommand(sshAddress) {
    return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

function dbMigrate(sshAddress, containerName) {
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:migrate`).code;
    throwErrorIfFails(code);
}

function gitCheckoutToBranch(sshAddress, gitRepository) {
    const command = `cd ${gitRepository.location} && git checkout ${gitRepository.branch}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} '${command}'`).code;
    throwErrorIfFails(code);
}

function gitPull(sshAddress, gitRepository) {
    const command = `cd ${gitRepository.location} && git pull origin ${gitRepository.branch}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} '${command}'`).code;
    throwErrorIfFails(code);
}

function cloneRepository(sshAddress, gitRepository) {
    const command = `git clone -b ${gitRepository.branch} ${gitRepository.repository} ${gitRepository.location}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} ${command}`).code;
    throwErrorIfFails(code);
}

function dockerCompose(sshAddress, gitRepository) {
    shell.echo("building container");
    const code = shell.exec(`${sshCommand(sshAddress)} 'cd ${gitRepository.location} && docker-compose up -d --build'`).code;
    throwErrorIfFails(code);
}

function createDatabase(sshAddress, containerName) {
    shell.echo("Creating database");
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:create`).code;
    throwErrorIfFails(code);
}

function repositoryWasNotCloned(sshAddress, gitRepository) {
    return shell.exec(`${sshCommand(sshAddress)} cd ${gitRepository.location}`).code !== 0;
}

const gitRepository = config.git_repository;
const sshAddress = config.ssh_address;
const containerName = config.container_name;

try {
    const isFirstDeploy = repositoryWasNotCloned(sshAddress, gitRepository);
    if (isFirstDeploy) cloneRepository(sshAddress, gitRepository);
    gitCheckoutToBranch(sshAddress, gitRepository);
    gitPull(sshAddress, gitRepository);
    dockerCompose(sshAddress, gitRepository);
    if (isFirstDeploy) createDatabase(sshAddress, containerName);
    dbMigrate(sshAddress, containerName);
    return shell.exit(0);
} catch (e) {
    return shell.exit(e.code);
}

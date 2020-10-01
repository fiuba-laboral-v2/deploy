import { Config, BackendConfig } from "../src/config"
import { GitManager, Shell } from "../src/models"
import shell from "shelljs";

const throwErrorIfFails = (code) => {
    if (code !== 0) throw { code };
}

const sshCommand = (sshAddress) => {
    return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

const dbMigrate = () => {
    const { sshAddress } = Config;
    const { containerName } = BackendConfig;
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:migrate`).code;
    throwErrorIfFails(code);
}

const dockerComposeUp = () => {
    const { gitRepository: { location } } = BackendConfig;
    const { sshAddress } = Config;
    shell.echo("building container");
    const code = shell.exec(`${sshCommand(sshAddress)} 'cd ${location} && docker-compose up -d --build'`).code;
    throwErrorIfFails(code);
}

const createDatabase = () => {
    const { containerName } = BackendConfig;
    const { sshAddress } = Config;
    shell.echo("Creating database");
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:create`).code;
    throwErrorIfFails(code);
}

try {
  const gitManager = new GitManager({
    repositoryConfig: BackendConfig.gitRepository,
    withSSHConnection: true
  });
  const isFirstDeploy = gitManager.repositoryWasNotCloned();
  if (isFirstDeploy) gitManager.cloneRepository()
  gitManager.checkoutToBranch()
  gitManager.pull()
  dockerComposeUp();
  if (isFirstDeploy) createDatabase();
  dbMigrate();
  Shell.exitSuccess();
} catch (error) {
  Shell.exit(error.code);
}

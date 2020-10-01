import { Config, FrontendConfig } from "../src/config"
import { GitManager } from "../src/models"
import shell from "shelljs";

function sshCommand(sshAddress) {
  return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

function throwErrorIfFails(code) {
  if (code !== 0 ) throw { code };
}

function buildHtml() {
  const { gitRepository: { location }, publicUrl } = FrontendConfig;
  const environment = process.env.NODE_ENV as "production" | "staging";
  const goToRepositoryLocation = `cd ${location}`;
  const installDependencies = "yarn install";
  const build = `REACT_APP_STAGE=${environment} PUBLIC_URL=${publicUrl} yarn build`;
  const command = `${goToRepositoryLocation} && ${installDependencies} && ${build}`;
  shell.echo(command);
  const code = shell.exec(command).code;
  throwErrorIfFails(code);
}

function removeServedHtml() {
  const { sshAddress, hostname } = Config;
  const command = `${sshCommand(sshAddress)} rm -rf /var/www/${hostname}/html/*`;
  shell.echo(command);
  const code = shell.exec(command).code;
  throwErrorIfFails(code);
}

function deployHtml() {
  const { sshAddress, hostname } = Config;
  const { gitRepository: { location } } = FrontendConfig;
  const command = `scp -o "StrictHostKeyChecking no" -r ${location}/build/* ${sshAddress}:/var/www/${hostname}/html/`;
  shell.echo(command);
  const code = shell.exec(command).code;
  throwErrorIfFails(code);
}

try {
  const gitManager = new GitManager({
    withSSHConnection: false,
    repositoryConfig: FrontendConfig.gitRepository
  });
  gitManager.removeRepository();
  gitManager.cloneRepository();
  buildHtml();
  removeServedHtml();
  deployHtml();
  gitManager.removeRepository();
  shell.exit(0);
} catch (e) {
  shell.exit(e.code || 1);
}

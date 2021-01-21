import { DeployConfig } from "../src/config/deploy";
import { GitManager } from "../src/models/GitManager";
import { BackendConfig } from "../src/config/Repository";
import { BackendManager } from "../src/models/BackendManager";
import { Environment } from "../src/config";
import { Shell } from "../src/models/Shell";
import { SSHManager } from "../src/models/SSHManager";

const hostname = DeployConfig.hostname;
const frontendPath = DeployConfig.frontendPath;
const user = DeployConfig.user;
const sshAddress = DeployConfig.sshAddress;
const { gitRepository: repositoryConfig } = BackendConfig;

const gitManager = new GitManager({ repositoryConfig, withSSHConnection: true });
const backendManager = new BackendManager(Environment.NODE_ENV());
const scriptsFolder = "fiuba_laboral_v2_scripts";
const destinationDirectory = `${sshAddress}:~/${scriptsFolder}`;

Shell.execute({ command: SSHManager.copy({ sourceDirectory: "scripts", destinationDirectory }) });
Shell.execute({
  command: SSHManager.command(
    `
    USER=${user}
    HOSTNAME=${hostname}
    FRONTEND_PATH=${frontendPath}
    bash ~/${scriptsFolder}/setup.sh
  `
  )
});

const isFirstDeploy = gitManager.repositoryWasNotCloned();
if (isFirstDeploy) gitManager.cloneRepository();
if (isFirstDeploy) backendManager.initializeEnvFile();

Shell.execute({
  label: "finished! removing scripts from server",
  command: `rm -rf ~/${scriptsFolder}`
});

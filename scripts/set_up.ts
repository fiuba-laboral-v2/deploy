import { SSHManager, Shell, GitManager, BackendManager } from "../src/models";
import { BackendConfig, Config, Environment } from "../src/config";

const hostname = Config.hostname;
const frontendPath = Config.frontendPath;
const user = Config.user;
const sshAddress = Config.sshAddress;

Shell.execute({
  command: SSHManager.copy({
    sourceDirectory: "scripts",
    destinationDirectory: `${sshAddress}:~/fiuba_laboral_v2_scripts`
  })
});
Shell.execute({
  command: `USER=${
    user
  } HOSTNAME=${
    hostname
  } FRONTEND_PATH=${
    frontendPath
  } sh ~/fiuba_laboral_v2_scripts/setup.sh`
});
const gitManager = new GitManager({
  repositoryConfig: BackendConfig.gitRepository,
  withSSHConnection: true
});
const backendManager = new BackendManager(Environment.NODE_ENV());
if (gitManager.repositoryWasNotCloned()) {
  gitManager.cloneRepository();
  backendManager.initializeEnvFile();
}
Shell.execute({
  label: "finished! removing scripts from server",
  command: "rm -rf ~/fiuba_laboral_v2_scripts"
});

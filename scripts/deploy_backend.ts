import { Config, BackendConfig } from "../src/config";
import { DockerManager, GitManager, Shell } from "../src/models";

try {
  const gitManager = new GitManager({
    repositoryConfig: BackendConfig.gitRepository,
    withSSHConnection: true
  });
  const dockerManager = new DockerManager({
    sshAddress: Config.sshAddress,
    repositoryConfig: BackendConfig.gitRepository,
    containerName: BackendConfig.containerName
  });
  gitManager.checkoutToBranch();
  gitManager.pull();
  dockerManager.dockerComposeUp();
  dockerManager.dbMigrate();
  dockerManager.removeUnusedImages();
  Shell.exitSuccess();
} catch (error) {
  Shell.exit(error.code);
}

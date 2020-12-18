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
  const isFirstDeploy = gitManager.repositoryWasNotCloned();
  if (isFirstDeploy) gitManager.cloneRepository();
  gitManager.checkoutToBranch();
  gitManager.pull();
  dockerManager.dockerComposeUp();
  if (isFirstDeploy) dockerManager.createDatabase();
  dockerManager.dbMigrate();
  dockerManager.removeUnusedImages();
  Shell.exitSuccess();
} catch (error) {
  Shell.exit(error.code);
}

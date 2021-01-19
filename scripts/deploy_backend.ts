import { DeployConfig, BackendConfig, Environment } from "../src/config";
import { DockerManager, GitManager, Shell, BackendManager } from "../src/models";

try {
  const backendManager = new BackendManager(Environment.NODE_ENV());
  const gitManager = new GitManager({
    repositoryConfig: BackendConfig.gitRepository,
    withSSHConnection: true
  });
  const dockerManager = new DockerManager({
    sshAddress: DeployConfig.sshAddress,
    repositoryConfig: BackendConfig.gitRepository,
    containerName: BackendConfig.containerName
  });
  const isFirstDeploy = gitManager.repositoryWasNotCloned();
  if (isFirstDeploy) gitManager.cloneRepository();
  gitManager.checkoutToBranch();
  gitManager.pull();
  if (isFirstDeploy) backendManager.initializeEnvFile();
  dockerManager.dockerComposeUp();
  if (isFirstDeploy) dockerManager.createDatabase();
  dockerManager.dbMigrate();
  dockerManager.removeUnusedImages();
  Shell.exitSuccess();
} catch (error) {
  Shell.exit(error.code);
}

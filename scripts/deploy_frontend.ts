import { FrontendConfig } from "../src/config"
import { GitManager, Shell, FrontendManager } from "../src/models"

try {
  const gitManager = new GitManager({
    withSSHConnection: false,
    repositoryConfig: FrontendConfig.gitRepository
  });
  gitManager.removeRepository();
  gitManager.cloneRepository();
  FrontendManager.buildHtml();
  FrontendManager.removeServedHtml();
  FrontendManager.deployHtml();
  gitManager.removeRepository();
  Shell.exitSuccess();
} catch (error) {
  Shell.exit(error.code);
}

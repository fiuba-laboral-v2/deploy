import { GitManager } from "../src/models/GitManager";
import { BackendConfig } from "../src/config/Repository";
import { BackendManager } from "../src/models/BackendManager";
import { Environment } from "../src/config";
import { ApacheManager } from "../src/models";
const { gitRepository: repositoryConfig } = BackendConfig;

const apacheManager = new ApacheManager();
const gitManager = new GitManager({ repositoryConfig, withSSHConnection: true });
const backendManager = new BackendManager(Environment.NODE_ENV());

apacheManager.copyScriptsToTheServer();
apacheManager.executeApacheSetup();
const isFirstDeploy = gitManager.repositoryWasNotCloned();
if (isFirstDeploy) gitManager.cloneRepository();
if (isFirstDeploy) backendManager.initializeEnvFile();
apacheManager.removeScriptsDirectory();

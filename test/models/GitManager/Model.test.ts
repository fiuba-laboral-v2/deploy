import { GitManager } from "../../../src/models";
import { Config } from "../../../src/config";
import { mockShellExecution } from "../../mocks/models/Shell";

describe("GitManager", () => {
  const repositoryConfig = {
    location: "./directory",
    branch: "master",
    url: "https://github.com/organization-name/repository-name.git"
  };

  it("returns false if the repository was not cloned", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(() => 0);
    expect(gitManager.repositoryWasNotCloned()).toBe(false);
  });

  it("returns true if the repository was cloned", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(() => { throw new Error(); });
    expect(gitManager.repositoryWasNotCloned()).toBe(true);
  });

  it("execute the command to clone the repository through shh connection", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location, url } = repositoryConfig;
    const gitCommand = `git clone -b ${branch} ${url} ${location}`;
    expect(gitManager.cloneRepository()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${Config.sshAddress} '${gitCommand}'`
    );
  });

  it("execute the command to clone the repository", async () => {
    const gitManager = new GitManager({ withSSHConnection: false, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location, url } = repositoryConfig;
    expect(gitManager.cloneRepository()).toEqual(`git clone -b ${branch} ${url} ${location}`);
  });

  it("execute the command to remove the repository through shh connection", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(command => command);
    const gitCommand = `rm -rf ${repositoryConfig.location}`;
    expect(gitManager.removeRepository()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${Config.sshAddress} '${gitCommand}'`
    );
  });

  it("execute the command to remove the repository", async () => {
    const gitManager = new GitManager({ withSSHConnection: false, repositoryConfig });
    mockShellExecution(command => command);
    expect(gitManager.removeRepository()).toEqual(`rm -rf ${repositoryConfig.location}`);
  });

  it("checkouts to a branch through shh connection", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location } = repositoryConfig;
    const gitCommand = `cd ${location} && git checkout ${branch}`;
    expect(gitManager.checkoutToBranch()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${Config.sshAddress} '${gitCommand}'`
    );
  });

  it("checkouts to a branch", async () => {
    const gitManager = new GitManager({ withSSHConnection: false, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location } = repositoryConfig;
    expect(gitManager.checkoutToBranch()).toEqual(`cd ${location} && git checkout ${branch}`);
  });

  it("pull last changes through shh connection", async () => {
    const gitManager = new GitManager({ withSSHConnection: true, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location } = repositoryConfig;
    const gitCommand = `cd ${location} && git pull origin ${branch}`;
    expect(gitManager.pull()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${Config.sshAddress} '${gitCommand}'`
    );
  });

  it("pull last changes", async () => {
    const gitManager = new GitManager({ withSSHConnection: false, repositoryConfig });
    mockShellExecution(command => command);
    const { branch, location } = repositoryConfig;
    expect(gitManager.pull()).toEqual(`cd ${location} && git pull origin ${branch}`);
  });
});

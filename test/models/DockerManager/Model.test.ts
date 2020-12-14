import { DockerManager } from "../../../src/models";
import { mockShellExecution } from "../../mocks/models/Shell";

describe("DockerManager", () => {
  const repositoryConfig = {
    location: "./directory",
    branch: "master",
    url: "https://github.com/organization-name/repository-name.git"
  };
  const containerName = "someContainerName";
  const sshAddress = "someSHHAddress@test.fi.uba.ar";

  it("runs the migrations", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);

    const dockerCommand = `docker exec ${containerName} yarn db:migrate`;
    expect(dockerManager.dbMigrate()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${sshAddress} ${dockerCommand}`
    );
  });

  it("builds the image and compose the container", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);

    const dockerCommand = `cd ${repositoryConfig.location} && docker-compose up -d --build`;
    expect(dockerManager.dockerComposeUp()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${sshAddress} '${dockerCommand}'`
    );
  });

  it("creates the database", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);

    const dockerCommand = `docker exec ${containerName} yarn db:create`;
    expect(dockerManager.createDatabase()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${sshAddress} ${dockerCommand}`
    );
  });

  it("removes dangling containers", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);

    const dockerCommand = "docker rmi $(docker images -f 'dangling=true' -q)";
    expect(dockerManager.removeDanglingContainers()).toEqual(
      `ssh -o \"StrictHostKeyChecking no\" ${sshAddress} ${dockerCommand}`
    );
  });
});

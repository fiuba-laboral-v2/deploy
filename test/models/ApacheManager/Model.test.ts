import { ApacheManager } from "../../../src/models";
import { mockShellExecution } from "../../mocks/models/Shell";

describe("ApacheManager", () => {
  it("copies the scripts to a folder in the server", async () => {
    const manager = new ApacheManager({ withSSHConnection: true });
    mockShellExecution(command => command);
    expect(manager.copyScriptsToTheServer()).toEqual(
      "scp -o \"StrictHostKeyChecking no\" " +
      "-r scripts test@antiguos.fi.uba.ar:~/fiuba_laboral_v2_scripts"
    );
  });

  it("executes the setup script with an ssh connection", async () => {
    const manager = new ApacheManager({ withSSHConnection: true });
    mockShellExecution(command => command);
    expect(manager.executeApacheSetup()).toEqual(
     "ssh -o \"StrictHostKeyChecking no\" " +
      "test@antiguos.fi.uba.ar -tt " +
      "'USER=test " +
      "HOSTNAME=test.fi.uba.ar " +
      "FRONTEND_PATH=/test " +
      "bash ~/fiuba_laboral_v2_scripts/setup.sh'"
    );
  });

  it("executes the setup script without an ssh connection", async () => {
    const manager = new ApacheManager({ withSSHConnection: false });
    mockShellExecution(command => command);
    expect(manager.executeApacheSetup()).toEqual(
      "USER=test " +
      "HOSTNAME=test.fi.uba.ar " +
      "FRONTEND_PATH=/test " +
      "bash ~/fiuba_laboral_v2_scripts/setup.sh"
    );
  });

  it("removes the scripts copied in the server with an ssh connection", async () => {
    const manager = new ApacheManager({ withSSHConnection: true });
    mockShellExecution(command => command);
    expect(manager.removeScriptsDirectory()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" " +
      "test@antiguos.fi.uba.ar " +
      "'rm -rf ~/fiuba_laboral_v2_scripts'"
    );
  });

  it("removes the scripts copied in the server without an ssh connection", async () => {
    const manager = new ApacheManager({ withSSHConnection: false });
    mockShellExecution(command => command);
    expect(manager.removeScriptsDirectory()).toEqual("rm -rf ~/fiuba_laboral_v2_scripts");
  });
});

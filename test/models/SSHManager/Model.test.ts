import { SSHManager } from "../../../src/models";

describe("SSHManager", () => {
  it("builds the command to execute though ssh", async () => {
    expect(
      SSHManager.command("someAddress")
    ).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" someAddress"
    );
  });

  it("builds the command copy files through ssh", async () => {
    expect(
      SSHManager.copy({ sourceDirectory: "srcDir", destinationDirectory: "dstDir" })
    ).toEqual(
      "scp -o \"StrictHostKeyChecking no\" -r srcDir dstDir"
    );
  });
});

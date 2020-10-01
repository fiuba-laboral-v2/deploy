import { FrontendManager } from "../../../src/models";
import { mockShellExecution } from "../../mocks/models/Shell";

describe("FrontendManager", () => {
  it("removes the served html files", async () => {
    mockShellExecution(command => command);
    expect(
      FrontendManager.removeServedHtml()
    ).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" test@antiguos.fi.uba.ar " +
      "rm -rf /var/www/test.fi.uba.ar/html/*"
    );
  });

  it("builds the html files", async () => {
    mockShellExecution(command => command);
    expect(
      FrontendManager.buildHtml()
    ).toEqual(
      "cd ./directory && " +
      "yarn install && " +
      "REACT_APP_STAGE=test PUBLIC_URL=http://test.fi.uba.ar/laboral yarn build"
    );
  });
});

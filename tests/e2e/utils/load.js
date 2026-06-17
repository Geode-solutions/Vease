// Node imports
import path from "node:path";

const __dirname = import.meta.dirname;

async function loadData(window, inputFilename) {
  const inputFileExtension = path.extname(inputFilename);
  console.log("inputFileExtension", inputFileExtension);
  const inputFilePath = path.join(__dirname, "..", "tests", "data", inputFilename);
  const importButton = await window.getByRole("button", { name: "Import" });
  await importButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputFilePath);
  await window.getByRole("main").getByRole("button", { name: "Import", exact: true }).click();

  const baseName = path.basename(inputFilename, inputFileExtension);
  const mainTree = window.getByTestId("mainObjectTree");
  await mainTree.waitFor({ state: "attached" });
  
  const collapseButton = window.locator('.tree-view-container button:has(.mdi-collapse-all-outline)');
  if (await collapseButton.isVisible()) {
    await collapseButton.click();
  }

  const expandButton = window.locator('.tree-view-container button:has(.mdi-expand-all-outline)');
  if (await expandButton.isVisible()) {
    await expandButton.click();
  }

  const treeItem = mainTree.getByText(baseName).first();
  await treeItem.waitFor({ state: "attached", timeout: 60_000 });
}

export { loadData };

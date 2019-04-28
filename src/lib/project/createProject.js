import fs from "fs-extra";
import path from "path";
import stripInvalidFilenameCharacters from "../helpers/stripInvalidFilenameCharacters";
import { projectTemplatesRoot } from "../../consts";
import copy from "../helpers/fsCopy";

const ERR_PROJECT_EXISTS = "ERR_PROJECT_EXISTS";

const createProject = async options => {
  const projectFolderName = stripInvalidFilenameCharacters(options.name);
  const projectPath = path.join(options.path, projectFolderName);
  const templatePath = `${projectTemplatesRoot}/${options.target}`;
  const projectTmpDataPath = `${projectPath}/project.gbsproj`;
  const projectDataPath = `${projectPath}/${projectFolderName}.gbsproj`;

  if (fs.existsSync(projectPath)) {
    throw ERR_PROJECT_EXISTS;
  }

  await fs.ensureDir(projectPath);
  await copy(templatePath, projectPath);

  // Replace placeholders in data file
  let dataFile = await fs.readFile(projectTmpDataPath, "utf8");
  dataFile = dataFile.replace(/___PROJECT_NAME___/g, projectFolderName);
  await fs.writeFile(projectDataPath, dataFile);
  await fs.unlink(projectTmpDataPath);
  return projectDataPath;
};

export default createProject;

export { ERR_PROJECT_EXISTS };

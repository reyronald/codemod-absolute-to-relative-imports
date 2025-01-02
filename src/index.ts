import path from "node:path";

import type { API, FileInfo, Options } from "jscodeshift";

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  root.find(j.ImportDeclaration, {}).forEach((importPath) => {
    const relativeImport = importPath.node.source.value;

    if (
      typeof relativeImport === "string" &&
      relativeImport.includes("./") &&
      !relativeImport.includes(".svg") &&
      !relativeImport.includes(".less")
    ) {
      const absoluteImport = path
        .join(path.dirname(file.path), relativeImport)
        .replace(process.cwd() + "/", "");

      importPath.node.source.value = absoluteImport;

      dirtyFlag = true;
    }
  });

  return dirtyFlag ? root.toSource() : undefined;
}

export const parser = "tsx";
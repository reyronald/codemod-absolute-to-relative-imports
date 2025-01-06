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

  // Find imports
  root.find(j.ImportDeclaration, {}).forEach((importPath) => {
    const relativeImport = importPath.node.source.value;

    if (
      typeof relativeImport === "string" &&
      relativeImport.includes("./") &&
      !relativeImport.includes(".svg") &&
      !relativeImport.includes(".less")
    ) {
      const absoluteImport = getAbsoluteImport(file, relativeImport);

      importPath.node.source.value = absoluteImport;

      dirtyFlag = true;
    }
  });

  // Find jest.mock calls
  root
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: { name: "jest" },
        property: { name: "mock" },
      },
    })
    .forEach((importPath) => {
      const args = importPath.node.arguments;

      if (args.length > 0 && j.Literal.check(args[0])) {
        const relativeImport = args[0].value;
        if (
          typeof relativeImport === "string" &&
          relativeImport.includes("./")
        ) {
          const absoluteImport = getAbsoluteImport(file, relativeImport);
          args[0].value = absoluteImport;
          dirtyFlag = true;
        }
      }
    });

  return dirtyFlag ? root.toSource() : undefined;
}

function getAbsoluteImport(file: FileInfo, relativeImport: string) {
  const absoluteImport = path
    .join(path.dirname(file.path), relativeImport)
    .replace(process.cwd() + "/", "");

  return absoluteImport;
}

export const parser = "tsx";

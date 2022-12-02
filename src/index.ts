import { appendFileSync } from 'fs';
import { resolve, join } from 'path';

export async function run() {
  const input_workingDir = process.env.INPUTS_WORKING_DIR;
  const input_path = process.env.INPUTS_PATH;

  const fullPath = buildPath(input_workingDir, input_path);

  const packageJson = await import(fullPath);

  const data = extractName(packageJson);
  outputs(data);
}

export function buildPath(wd?: string, path?: string): string {
  const workingDir = (wd && resolve(wd)) || resolve('.');
  const fullPath = (path && resolve(path)) || join(workingDir, 'package.json');

  return fullPath;
}

export function extractName(packageJson: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fullname = (packageJson as any).name;

  if (!fullname) {
    throw 'File do not contain name field';
  }

  const match = /(?:@(?<namespace>.*)\/)?(?<name>.*)/.exec(fullname);
  return {
    fullname,
    name: match?.groups?.name,
    namespace: match?.groups?.namespace,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function outputs(data: any) {
  const outputFile = process.env.GITHUB_OUTPUT;
  const outputs = Object.entries(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value != undefined)
    .map(([key, value]) => `${key}=${value}`);

  if (!outputFile) {
    console.log(
      'Your are not in a Github Action CI',
      'Redirect output to stdout'
    );
    console.log(outputs.join('\n') + '\n');
    return;
  }

  appendFileSync(outputFile, outputs.join('\n') + '\n');
}

run();

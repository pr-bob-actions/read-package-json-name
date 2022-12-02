import fs from 'fs';
import { buildPath, extractName, outputs, run } from '../src';

import {
  buildPathTestSet,
  e2eTestSet,
  extractNameTestSet,
  outputsTestSet,
} from './sets';

jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
}));

const outputFilePath = 'path/to/output/file';

describe('Test filepath build', () => {
  test.each(buildPathTestSet)('%s', (_, wd, fullPath, expected) => {
    const path = buildPath(wd, fullPath);
    expect(path).toBe(expected);
  });
});

describe('Test name extraction', () => {
  test.each(extractNameTestSet)(
    '%s',
    (_, packageJSON, expected, shouldThrow) => {
      let data;
      const call = () => (data = extractName(packageJSON));

      if (shouldThrow) {
        expect(call).toThrow();
      } else {
        call();
        expect(data).toStrictEqual(expected);
      }
    }
  );
});

describe('Test outputs', () => {
  beforeAll(() => {
    process.env.GITHUB_OUTPUT = outputFilePath;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test.each(outputsTestSet)('%s', (_, inputs, expected) => {
    outputs(inputs);

    expect(fs.appendFileSync).toHaveBeenCalled();
    expect(fs.appendFileSync).toHaveBeenCalledWith(outputFilePath, expected);
  });

  test('GITHUB_OUTPUT not set', () => {
    process.env.GITHUB_OUTPUT = '';
    expect(() => outputs({})).not.toThrow();
  });
});

describe('e2e Tests', () => {
  beforeAll(() => {
    process.env.GITHUB_OUTPUT = outputFilePath;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test.each(e2eTestSet)('%#', async (wb, path, packageJSON, expected) => {
    process.env.INPUT_WORKINGDIR = wb ?? '';
    process.env.INPUT_PATH = path ?? '';
    jest.mock(buildPath(wb, path), () => packageJSON, { virtual: true });

    await run();

    expect(fs.appendFileSync).toHaveBeenCalled();
    expect(fs.appendFileSync).toHaveBeenCalledWith(outputFilePath, expected);
  });
});

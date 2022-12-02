import { resolve } from 'path';

export const buildPathTestSet: [
  string,
  string | undefined,
  string | undefined,
  string
][] = [
  ['All undefined', undefined, undefined, resolve('./package.json')],
  ['All empty string', '', '', resolve('./package.json')],
  ['WorkingDir only', 'wd', undefined, resolve('wd/package.json')],
  ['WorkingDir + empty string', 'wd', '', resolve('wd/package.json')],
  ['Path only', undefined, 'filepath.json', resolve('filepath.json')],
  ['Path + empty string', '', 'filepath.json', resolve('filepath.json')],
  ['WorkingDir + Path', 'wd', 'filepath.json', resolve('filepath.json')],
];

export const extractNameTestSet: [string, unknown, unknown, boolean][] = [
  [
    'Simple name',
    { name: 'package-name' },
    { fullname: 'package-name', name: 'package-name', namespace: undefined },
    false,
  ],
  [
    'Package with namespace',
    { name: '@namespace/package-name' },
    {
      fullname: '@namespace/package-name',
      name: 'package-name',
      namespace: 'namespace',
    },
    false,
  ],
  [
    'Simple name with an @',
    { name: '@package-name' },
    {
      fullname: '@package-name',
      name: '@package-name',
      namespace: undefined,
    },
    false,
  ],
  ['No name field => should throw', {}, {}, true],
];

export const outputsTestSet: [string, unknown, string][] = [
  [
    'With namespace',
    {
      fullname: '@namespace/package-name',
      name: 'package-name',
      namespace: 'namespace',
    },
    'fullname=@namespace/package-name\nname=package-name\nnamespace=namespace\n',
  ],
  [
    'Without namespace',
    { fullname: 'package-name', name: 'package-name' },
    'fullname=package-name\nname=package-name\n',
  ],
];

export const e2eTestSet: [
  string | undefined,
  string | undefined,
  unknown,
  string
][] = [
  [
    undefined,
    undefined,
    { name: 'package-name' },
    'fullname=package-name\nname=package-name\n',
  ],
  [
    'working_dir',
    undefined,
    { name: '@namespace/package-name' },
    'fullname=@namespace/package-name\nname=package-name\nnamespace=namespace\n',
  ],
  [
    undefined,
    'path/to/package.json',
    { name: '@package-name' },
    'fullname=@package-name\nname=@package-name\n',
  ],
];

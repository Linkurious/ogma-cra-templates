'use strict';

const execa = require('execa');
const { remove, existsSync } = require('fs-extra');
const { join } = require('path');

jest.setTimeout(1000 * 60 * 5);

const projectName = 'test-app';
const genPath = join(__dirname, projectName);

const generatedFiles = [
  '.gitignore',
  'package.json',
  'src',
  'package-lock.json',
];

beforeEach(() => remove(genPath));
afterAll(() => remove(genPath));

const run = (args, options) => {
  // console.log(
  //   'npx',
  //   ['create-react-app'].concat(args).concat(['--use-npm']).join(' ')
  // );
  const child = execa(
    'npx',
    ['create-react-app'].concat(args).concat(['--use-npm']),
    options
  );
  child.stdout.on('data', data => {
    if (data.toString().indexOf('Ogma') !== -1) {
      // TODO: update it to "latest" when our npm would work
      child.stdin.write('4.0.4');
      child.stdin.write('\n');
    }
  });
  return child;
};

const genFileExists = f => existsSync(join(genPath, f));

describe('create-react-app', () => {
  it('creates an Ogma project based on the ogma template', async () => {
    const { code } = await run(
      [projectName, '--template', 'file:../../packages/ogma'],
      {
        cwd: __dirname,
      }
    );

    // Assert for exit code
    expect(code).toBe(0);

    // // Assert for the generated files
    // [...generatedFiles, 'tsconfig.json'].forEach(file =>
    //   expect(genFileExists(file)).toBeTruthy()
    // );
  });

  it('creates an Ogma project based on the typescript template', async () => {
    const { code } = await run(
      [projectName, '--template', 'file:../../packages/ogma-ts'],
      {
        cwd: __dirname,
      }
    );

    // Assert for exit code
    expect(code).toBe(0);

    // Assert for the generated files
    [...generatedFiles, 'tsconfig.json'].forEach(file =>
      expect(genFileExists(file)).toBeTruthy()
    );
  });
});

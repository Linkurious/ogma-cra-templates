'use strict';
const readline = require('readline');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const semver = require('semver');

const DIST_URL_RE = /^https:\/\/get.linkurio.us\/api\/get\/npm\/ogma\//;

function addDependency(name, link) {
  const template = JSON.parse(
    readFileSync(path.join(__dirname, 'template.json'), 'utf8')
  );
  template.package.dependencies[name] = link;
  writeFileSync(
    path.join(__dirname, 'template.json'),
    JSON.stringify(template, null, 2),
    'utf8'
  );
  console.log(`Added '${name}' dependency: \n`, `"${name}": "${link}"\n\n`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt(
  'Please provide the link to Ogma npm package that you got from get.linkurio.us: '
);
rl.prompt();

rl.on('line', function (line) {
  const packageLink = line.trim();
  if (DIST_URL_RE.test(packageLink) || semver.valid(packageLink)) {
    addDependency('@linkurious/ogma', packageLink);
    rl.close();
    return;
  }
  console.log('Invalid link');
  rl.prompt();
}).on('close', function () {
  process.exit(0);
});

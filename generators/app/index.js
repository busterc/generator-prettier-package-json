'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const extend = require('lodash.merge');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Let's make package.json prettier!`));
  }

  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    const pkg = extend(currentPkg, {
      eslintConfig: {
        plugins: ['prettier', 'json']
      },
      'lint-staged': {
        'package.json': ['prettier-package-json --write', 'git add']
      }
    });
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall(
      ['prettier-package-json', 'eslint-plugin-json', 'lint-staged', 'husky'],
      {
        saveDev: true
      }
    ).then(() => {
      return this.spawnCommand(
        `${this.destinationPath('./node_modules/.bin/prettier-package-json')}`,
        [`--write`, `${this.destinationPath('package.json')}`]
      );
    });
  }
};

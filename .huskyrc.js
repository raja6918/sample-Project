/*
const branchName = require('current-git-branch');

const tasks = arr => arr.join(' && ');
const prePushTasks = [];
const currentBranchName = branchName();
const DEV_BRANCH = 'development';

if (currentBranchName === DEV_BRANCH) {
  prePushTasks.push('cross-env CI=true npm run test');
}
*/

const huskyConfig = {
  hooks: {
    'pre-commit': 'lint-staged',
    // 'pre-push': tasks(prePushTasks),
  },
};

module.exports = huskyConfig;

const child = require('child_process');

const output = child.execSync(`git log --format=%B%H----DELIMITER----`).toString('utf-8');

const commitsArray = output.split('----DELIMITER----\n').map(commit => {
   const [message, sha] = commit.split('\n');

   return { sha, message };
}).filter(commit => Boolean(commit.sha));

console.log({ commitsArray });

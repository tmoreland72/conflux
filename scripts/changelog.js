const child = require('child_process')
const fs = require('fs')

const process = require('process')
process.chdir('C:\\code\\34fame\\q-conflux')

const CHANGELOG = './CHANGELOG.md'
const PACKAGE = './package.json'
const APP = './src/store/app/state.js'

const REPO = 'https://github.com/34fame/conflux'

const currentPackageJson = fs.readFileSync(PACKAGE, 'utf-8')
const packageObj = JSON.parse(currentPackageJson)
const currentVersion = Number(packageObj.version)
const newVersion = currentVersion + 1
packageObj.version = String(newVersion)
fs.writeFileSync(PACKAGE, JSON.stringify(packageObj, null, 2))
child.execSync('git add .')
child.execSync(`git commit -m "chore: Bump to version ${newVersion}"`)

const appStateJs = fs.readFileSync(APP, 'utf-8')
appStateJs.replace("%version%", `"${newVersion}"`)
console.log('appStateJs', appStateJs)
fs.writeFileSync(APP, appStateJs)

const currentChangelog = fs.readFileSync(CHANGELOG, 'utf-8')
let newChangelog = `# Version ${newVersion} (${new Date().toISOString().split('T')[0]})\n\n`
const latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0]
const output = child
   .execSync(`git log ${latestTag}..HEAD --format=%B%H----DELIMITER----`)
   .toString('utf-8')

const commitsArray = output
   .split('----DELIMITER----\n')
   .map(commit => {
      const [message, sha] = commit.split('\n')
      return { sha, message }
   })
   .filter(commit => Boolean(commit.sha))

const features = []
const chores = []
const fixes = []

commitsArray.forEach(commit => {
   let messageParts = commit.message.split(':')
   switch (messageParts[0]) {
      case 'chore':
         chores.push(`* ${messageParts[1]} ([${commit.sha.substring(0, 6)}](${REPO}/commit/${commit.sha}))\n`)
         break
      case 'feat':
         features.push(`* ${messageParts[1]} ([${commit.sha.substring(0, 6)}](${REPO}/commit/${commit.sha}))\n`)
         break
      case 'fix':
         fixes.push(`* ${messageParts[1]} ([${commit.sha.substring(0, 6)}](${REPO}/commit/${commit.sha}))\n`)
         break
   }

})

if (fixes.length) {
   newChangelog += `## Fixes\n`
   fixes.forEach(fix => {
      newChangelog += fix
   })
   newChangelog += '\n'
}

if (features.length) {
   newChangelog += `## Features\n`
   features.forEach(feature => {
      newChangelog += feature
   })
   newChangelog += '\n'
}

if (chores.length) {
   newChangelog += `## Chores\n`
   chores.forEach(chore => {
      newChangelog += chore
   })
   newChangelog += '\n'
}

// prepend the newChangelog to the current one
fs.writeFileSync(CHANGELOG, `${newChangelog}${currentChangelog}`)

// tag the commit
child.execSync('git add .')
child.execSync(`git commit -m "chore: Updated CHANGELOG.md"`)
child.execSync(`git tag -a -m "Tagged for version ${newVersion}" version${newVersion}`)
child.execSync(`git push --follow-tags`)

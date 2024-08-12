import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const raw = { ...packageJsonPath }
const packageJson = require(packageJsonPath)

packageJson.devDependencies = {}
packageJson.peerDependencies = {}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

exec('pnpm', [
  'publish',
  '--access',
  'public',
  '-no-git-checks',
]).then(() => {
  fs.writeFileSync(packageJsonPath, JSON.stringify(raw, null, 2))
})

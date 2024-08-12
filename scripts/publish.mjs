import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import packageJson from '../package.json'

const cwd = process.cwd()
const packageJsonPath = path.resolve(cwd, 'package.json')
const raw = { ...packageJson }

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

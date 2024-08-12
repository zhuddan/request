import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { exec } from './exec.mjs'

const cwd = process.cwd()
const packageJsonPath = path.resolve(cwd, 'package.json')
const rawString = fs.readFileSync(packageJsonPath).toString()
const packageJson = JSON.parse(rawString)

// packageJson.devDependencies = {}
packageJson.dependencies = {}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

exec('pnpm', [
  'publish',
  '--access',
  'public',
  '-no-git-checks',
]).then((res) => {
  console.log(res.stderr)
}).finally(() => {
  fs.writeFileSync(packageJsonPath, rawString)
})

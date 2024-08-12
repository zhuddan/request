import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { exec } from './exec.mjs'

const cwd = process.cwd()
const packageJsonPath = path.resolve(cwd, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())
const raw = { ...packageJson }

packageJson.devDependencies = {}
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
  fs.writeFileSync(packageJsonPath, JSON.stringify(raw, null, 2))
})

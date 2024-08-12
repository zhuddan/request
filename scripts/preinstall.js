// const fs = require('node:fs')
const path = require('node:path')

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = require(packageJsonPath)

packageJson.devDependencies = {}

// fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

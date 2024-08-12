const fs = require('node:fs')
const path = require('node:path')

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = require(packageJsonPath)

// 动态修改 package.json 的内容
packageJson.scripts.devDependencies = {}

// 将修改后的内容写回 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

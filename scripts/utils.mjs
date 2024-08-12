// @ts-check
import { spawn } from 'node:child_process'
import process from 'node:process'
import { Buffer } from 'node:buffer'

/**
 * @param {string} command
 * @param {ReadonlyArray<string>} args
 * @param {object} [options]
 */
export async function exec(command, args, options) {
  return new Promise((resolve, reject) => {
    const _process = spawn(command, args, {
      stdio: [
        'ignore', // stdin
        'pipe', // stdout
        'pipe', // stderr
      ],
      ...options,
      shell: process.platform === 'win32',
    })

    /**
     * @type {Buffer[]}
     */
    const stderrChunks = []
    /**
     * @type {Buffer[]}
     */
    const stdoutChunks = []

    _process.stderr?.on('data', (chunk) => {
      stderrChunks.push(chunk)
    })

    _process.stdout?.on('data', (chunk) => {
      stdoutChunks.push(chunk)
    })

    _process.on('error', (error) => {
      reject(error)
    })

    _process.on('exit', (code) => {
      const ok = code === 0
      const stderr = Buffer.concat(stderrChunks).toString('utf-8').trim()
      const stdout = Buffer.concat(stdoutChunks).toString('utf-8').trim()
      const result = { ok, code, stderr, stdout }
      resolve(result)
    })
  })
}

const s = await exec('d --help', [])
console.log(s)

import fs from 'fs-extra'
import { join } from 'node:path'
import { execaCommandSync } from 'execa'
import { afterEach, beforeAll, expect, test } from 'vitest'
import type { ExecaSyncReturnValue, SyncOptions } from 'execa'

const projectName = 'test-app'
const genPath = join(__dirname, projectName)
const CLI_PATH = join(__dirname, '../packages/create-brage')

const run = (
  args: string[],
  options: SyncOptions = {},
): ExecaSyncReturnValue => {
  return execaCommandSync(`node ${CLI_PATH} ${args.join(' ')}\n`, options)
}

const createNonEmptyDir = () => {
  fs.mkdirpSync(genPath)

  const pkgJson = join(genPath, 'package.json')
  fs.writeFileSync(pkgJson, '{ "foo": "bar" }')
}

const templateFiles = fs
  .readdirSync(join(CLI_PATH, './template'))
  .map((filePath) => (filePath === '_gitignore' ? '.gitignore' : filePath))
  .sort()

beforeAll(() => fs.remove(genPath))
afterEach(() => fs.remove(genPath))

test('shows the bin file name with its version', () => {
  const { stdout } = run(['-v'])

  expect(stdout).toMatch(/create-brage\/\d+\.\d+\.\d+/)
})

test('prompts for the project name if none supplied', () => {
  const { stdout } = run([])

  expect(stdout).toContain('Project name:')
})

test('asks to overwrite non-empty target directory', () => {
  createNonEmptyDir()
  const { stdout } = run([projectName], { cwd: __dirname })

  expect(stdout).toContain(`Target directory "${projectName}" is not empty.`)
})

test('asks to overwrite non-empty current directory', () => {
  createNonEmptyDir()
  const { stdout } = run(['.'], { cwd: genPath })

  expect(stdout).toContain(`Current directory is not empty.`)
})

test('accepts command line override for --overwrite', () => {
  createNonEmptyDir()
  const { stdout } = run(['.', '--overwrite', 'ignore'], { cwd: genPath })

  expect(stdout).not.toContain(`Current directory is not empty.`)
})

test('successfully scaffolds a project based on starter template', () => {
  const { stdout } = run([projectName], { cwd: __dirname })
  const generatedFiles = fs.readdirSync(genPath).sort()

  expect(stdout).toContain(`We will scaffold your app in a few seconds...`)
  expect(templateFiles).toEqual(generatedFiles)
})

test('successfully matches expected changes on .env file content', () => {
  run([projectName], { cwd: __dirname })

  const envFileContent = fs.readFileSync(join(CLI_PATH, './template', '/.env'), 'utf8')
  const changedEnvFileContent = envFileContent.replace(/brage_db/g, `${projectName.replace('-', '_')}_db`)
  
  const generatedEnvFileContent = fs.readFileSync(join(__dirname, projectName, '/.env'), 'utf8')

  expect(changedEnvFileContent).toEqual(generatedEnvFileContent)
})
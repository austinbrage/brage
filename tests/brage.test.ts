import fs from 'fs-extra'
import { join } from 'node:path'
import { execaCommandSync } from 'execa'
import { afterAll, beforeAll, expect, test } from 'vitest'
import type { ExecaSyncReturnValue, SyncOptions } from 'execa'

const projectName = 'test-app'
const genPath = join(__dirname, projectName)
const BRAGE_CLI_PATH = join(__dirname, '../packages/brage')
const CREATE_CLI_PATH = join(__dirname, '../packages/create-brage')

const run = (
  cli: string,
  args: string[],
  options: SyncOptions = {},
): ExecaSyncReturnValue => {
  return execaCommandSync(`node ${cli} ${args.join(' ')}\n`, options)
}

const templateFiles = fs
  .readdirSync(join(CREATE_CLI_PATH, './template'))
  .map((filePath) => (filePath === '_gitignore' ? '.gitignore' : filePath))
  .sort()

const cleanString = (content: string) => {
    return content
        .trim()
        .replace(/\s+/g, '')
        .replace(/\u001b\[\d+m/g, '')
}


const compareFiles = (file1: string, file2: string) => {
    const content1 = fs.readFileSync(file1, 'utf-8')
    const content2 = fs.readFileSync(file2, 'utf-8')
    expect(cleanString(content1)).toEqual(cleanString(content2))
}

const compareFolders = (folder1: string, folder2: string) => {
    const files1 = fs.readdirSync(folder1)

    files1.forEach(file => {
        const filePath1 = join(folder1, file)
        const filePath2 = join(folder2, file)
        
        if (fs.statSync(filePath1).isDirectory()) {
            compareFolders(filePath1, filePath2)
        } else {
            compareFiles(filePath1, filePath2)
        }
    })
}

beforeAll(() => fs.remove(genPath))
afterAll(() => fs.remove(genPath))

test('shows the bin file name with its version', () => {
    const { stdout } = run(BRAGE_CLI_PATH, ['-v'])
  
    expect(stdout).toMatch(/brage\/\d+\.\d+\.\d+/)
})

test('setup starter template with create-brage', () => {
    run(CREATE_CLI_PATH, [projectName], { cwd: __dirname })
    const generatedFiles = fs.readdirSync(genPath).sort()
    
    expect(templateFiles).toEqual(generatedFiles)
})

test('successfully generates new articles route on template', () => {
    run(BRAGE_CLI_PATH, [], { cwd: genPath })
    const fixturesPath = join(process.cwd(), './tests/fixtures')

    compareFolders(fixturesPath, genPath)  
})
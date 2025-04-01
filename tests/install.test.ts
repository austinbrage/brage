import { expect, test } from 'vitest'
import { execaCommandSync } from 'execa'
import type { ExecaSyncReturnValue, SyncOptions } from 'execa'

const run = (
  cli: string,
  args: string[],
  options: SyncOptions = {},
): ExecaSyncReturnValue => {
  return execaCommandSync(`${cli} ${args.join(' ')}\n`, options)
}

test('starts by installing the packages globally', () => {
    const { stdout } = run('pnpm run start', [])
  
    const installSuccessCount = stdout
        .split('\n')
        .filter(line => line.includes('has installed successfully'))
        .length

    expect(installSuccessCount).toBe(2)
})

test('shows the bin file name with its version on packages', () => {
    const { stdout: stdout1 } = run('brage', ['-v'])
    const { stdout: stdout2 } = run('create-brage', ['-v'])
  
    expect(stdout1).toMatch(/brage\/\d+\.\d+\.\d+/)
    expect(stdout2).toMatch(/create-brage\/\d+\.\d+\.\d+/)
})

test('stops by uninstalling the packages globally', () => {
    const { stdout } = run('pnpm stop', [])
  
    const installSuccessCount = stdout
        .split('\n')
        .filter(line => line.includes('has uninstalled successfully'))
        .length

    expect(installSuccessCount).toBe(2)
})

test('do not show the bin file name with its version on packages', () => {
    let error1Thrown = false
    let error2Thrown = false

    try {
        run('brage', ['-v'])
    } catch (error) {
        error1Thrown = true
    }

    try {
        run('create-brage', ['-v'])
    } catch (error) {
        error2Thrown = true
    }
  
    expect(error1Thrown).toBe(true)
    expect(error2Thrown).toBe(true)
})
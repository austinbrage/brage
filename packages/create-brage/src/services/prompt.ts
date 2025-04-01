import prompts from 'prompts'
import fsExtra from 'fs-extra'
import minimist from 'minimist'
import { red, reset } from 'kolorist'
import { basename, join, resolve } from 'path'

const { existsSync, readdirSync } = fsExtra

type Options = { overwrite?: string, version?: string, v?: string }
type Results = 'projectName' | 'overwrite' | 'packageName'
type Prompts = prompts.Answers<Results> | void

export class Prompt {
    private argv: { _: string[] } & Options

    constructor(private defaultTargetDir: string) {
        this.argv = minimist<Options>(process.argv.slice(2), { string: ['_'] })
    }

    private getProjectName(targetDir: string) {
        return targetDir === '.' ? basename(resolve()) : targetDir        
    }

    private formatTargetDir(targetDir: string | undefined) {
        return targetDir?.trim().replace(/\/+$/g, '')
    }

    private isEmpty(path: string) {
        const files = readdirSync(path)
        return files.length === 0 || (files.length === 1 && files[0] === '.git')
    }

    private isValidPackageName(projectName: string) {
        return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
            projectName
        )
    }

    private toValidPackageName(projectName: string) {
        return projectName
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/^[._]/, '')
            .replace(/[^a-z\d\-~]+/g, '-')
    }

    private onCancel() {
        return {
            onCancel: () => {
                throw new Error('\n' + red('✖ ') + ' Operation cancelled' + '\n')
            }
        }
    }

    async init() {
        const argTargetDir = this.formatTargetDir(this.argv._[0])
        const argVersion = this.argv.version || this.argv.v
        
        let targetDir = argTargetDir || this.defaultTargetDir

        if(argVersion) return { argVersion }

        prompts.override({
            overwrite: this.argv.overwrite
        })

        const result: Prompts = await prompts(
            [
                {
                    type: argTargetDir ? null : 'text',
                    name: 'projectName',
                    message: 'Project name:',
                    initial: this.defaultTargetDir,
                    onState: (state) => {
                        targetDir = this.formatTargetDir(state.value) || this.defaultTargetDir
                    }
                },
                {
                    type: () =>
                        !existsSync(targetDir) || this.isEmpty(targetDir) ? null : 'select',
                    name: 'overwrite',
                    message: () =>
                        (targetDir === '.'
                            ? 'Current directory'
                            : `Target directory "${targetDir}"`) +
                        ` is not empty. Please choose how to proceed:`,
                    initial: 0,
                    choices: [
                        {
                            title: 'Remove existing files and continue',
                            value: 'yes',
                        },
                        {
                            title: 'Cancel operation',
                            value: 'no',
                        },
                        {
                            title: 'Ignore files and continue',
                            value: 'ignore',
                        },
                    ],
                },
                {
                    type: (_, { overwrite }: { overwrite?: string }) => {
                        if (overwrite === 'no') {
                            throw new Error(red('✖ ') + ' Operation cancelled')
                        }
                        return null
                    },
                    name: 'overwriteChecker',
                },
                {
                    type: () => (this.isValidPackageName(this.getProjectName(targetDir)) ? null : 'text'),
                    name: 'packageName',
                    message: reset('Package name:'),
                    initial: () => this.toValidPackageName(this.getProjectName(targetDir)),
                    validate: (dir) =>
                        this.isValidPackageName(dir) || 'Invalid package.json name',
                },
            ],
            this.onCancel()
        ).catch(err => { throw err.message })

        const isInRoot = join(process.cwd(), targetDir) !== process.cwd()
        const targetDirLog = targetDir.includes(' ') ? `"${targetDir}"` : targetDir

        return { 
            ...result, 
            targetDir,
            cdTargetDir: isInRoot && targetDirLog,
            defaultPackageName: this.getProjectName(targetDir)  
        }
    }
}
import fsExtra from 'fs-extra'
import { relative } from 'path'

const { 
    pathExists, 
    readdir, 
    readFile, 
    writeFile, 
    ensureDir, 
    remove, 
    stat
} = fsExtra

export class Methods {

    constructor() {}

    parseJson(content: string, originalPath: string): object {
        try {
            return JSON.parse(content)
        } catch(err) {
            if(!(err instanceof SyntaxError)) throw err
            throw new Error(`Failed to parse the json on ${originalPath}\n ${err.message}`)
        }
    }

    async getInnerFiles(path: string) {
        try {
            const exists = await pathExists(path)
            if(exists) return await readdir(path, 'utf-8')
            return null
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to read files on ${relativePath}`)
        }
    }

    async getContent(path: string) {
        try {
            const exists = await pathExists(path)
            if(exists) return await readFile(path, 'utf-8')
            return null
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to read file ${relativePath}`)
        }
    }

    async getJsonObject(path: string) {
        const relativePath = relative(process.cwd(), path)

        try {
            const exists = await pathExists(path)
            if(exists) {
                const content = await readFile(path, 'utf-8')
                return this.parseJson(content, relativePath)
            }
            return null
        } catch(err) {
            if(err instanceof Error) throw new Error(err.message)
            throw new Error(`Failed to read file ${relativePath}`)
        }
    }

    async writeContent(path: string, content: string) {
        try {
            await writeFile(path, content, 'utf-8')
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to write file ${relativePath}`)
        }
    }

    async checkExistingFile(path: string) {
        try {
            return await pathExists(path)
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to check existing file ${relativePath}`)
        }
    }

    async checkExistingFolder(path: string) {
        try {
            const exists = await pathExists(path)
            if(exists) {
                const stats = await stat(path)
                return stats?.isDirectory()
            }
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to check existing folder ${relativePath}`)
        }
    }
    
    async ensureFolder(path: string) {
        try {
            return await ensureDir(path)
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to ensure folder ${relativePath}`)
        }
    }

    async removeFolder(path: string) {
        try {
            const exists = await pathExists(path)
            if(exists) return await remove(path)
            return null
        } catch(err) {
            const relativePath = relative(process.cwd(), path)
            throw new Error(`Failed to remove folder ${relativePath}`)
        }
    }
}
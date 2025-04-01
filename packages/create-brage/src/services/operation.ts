import fsExtra from "fs-extra"
import { green } from 'kolorist'
import { fileURLToPath } from "url"
import { join, relative, resolve, dirname } from "path"

type PromptResult = {
    targetDir: string,
    overwrite?: string, 
    packageName?: string,
    defaultPackageName: string
}

const { 
    existsSync, 
    mkdirSync, 
    readFileSync, 
    readdirSync, 
    rmSync, 
    writeFileSync,
    statSync, 
    copyFileSync
} = fsExtra

export class Operation {
    private data: PromptResult
    private root: string
    private templateDir: string
    private renameFiles: Record<string, string | undefined>

    constructor(data: PromptResult, indexDirname: string) {
        this.data = data
        this.root = join(process.cwd(), this.data.targetDir)
        this.renameFiles = { _gitignore: '.gitignore' }
        this.templateDir = join(dirname(fileURLToPath(indexDirname)), '../template')
    }

    private emptyDir(dir: string) {
        if (!existsSync(dir)) return

        for (const file of readdirSync(dir)) {
            if (file === '.git') continue
            rmSync(resolve(dir, file), { recursive: true, force: true })
        }
    }

    private copyDir(srcDir: string, destDir: string) {
        mkdirSync(destDir, { recursive: true })

        for (const file of readdirSync(srcDir)) {
            const srcFile = resolve(srcDir, file)
            const destFile = resolve(destDir, file)
            this.copy(srcFile, destFile)
        }
    }

    private copy(src: string, dest: string) {
        const stat = statSync(src)

        if (stat.isDirectory()) {
            this.copyDir(src, dest)
        } else {
            copyFileSync(src, dest)

            const fileStat = statSync(dest)
            const filePath = relative(process.cwd(), dest)
            console.log(`${green('CREATE')} ${filePath} (${fileStat.size} bytes)`)
        }
    }

    private writeDatabaseNames(pkgName: string) {
        const targetPath = join(this.root, '.env')

        const content = readFileSync(targetPath, 'utf-8')
        const cleanPackageName = pkgName.replace(/-/g, '_')
        const newContent = content.replace(/brage_db/g, `${cleanPackageName}_db`)
        
        writeFileSync(targetPath, newContent)        
    }

    private write(file: string, content?: string) {
        const targetPath = join(this.root, this.renameFiles[file] ?? file)

        if (content) {
            writeFileSync(targetPath, content)
        } else {
            this.copy(join(this.templateDir, file), targetPath)
        }
    }

    static handleVersion(indexDirname: string) {
        const packagePath = join(dirname(fileURLToPath(indexDirname)), '../package.json')
        const packageFile = readFileSync(packagePath, 'utf-8')

        const packageJson = JSON.parse(packageFile)
        const binName = packageJson?.bin ? Object.keys(packageJson.bin)[0] : null
        const version = packageJson?.version ? packageJson.version : null

        return console.log(`${binName}/${version}`)
    }

    handleOverwrite() {
        if (this.data.overwrite === 'yes') {
            this.emptyDir(this.root)
        } else if (!existsSync(this.root)) {
            mkdirSync(this.root, { recursive: true })
        }
    }

    handleTemplate() {
        const files = readdirSync(this.templateDir)

        for (const file of files.filter((f) => f !== 'package.json')) {
            this.write(file)
        }

        const pkgString = readFileSync(join(this.templateDir, `package.json`), 'utf-8')
        const pkg = JSON.parse(pkgString)

        pkg.name = this.data.packageName || this.data.defaultPackageName
        this.write('package.json', JSON.stringify(pkg, null, 2) + '\n')
        this.writeDatabaseNames(pkg.name)
    }
}
import fsExtra from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const { readFileSync } = fsExtra

export function printVersion(indexDirname: string) {
    const packagePath = join(dirname(fileURLToPath(indexDirname)), '../package.json')
    const packageFile = readFileSync(packagePath, 'utf-8')

    const packageJson = JSON.parse(packageFile)
    const binName = packageJson?.bin ? Object.keys(packageJson.bin)[0] : null
    const version = packageJson?.version ? packageJson.version : null

    return console.log(`${binName}/${version}`)
}
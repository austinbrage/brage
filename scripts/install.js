const minimist = require('minimist')
const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)
const { join, resolve } = require('path')
const { readFileSync, remove } = require('fs-extra')
const { gray, green, inverse, bold } = require('kolorist')

const argv = minimist(process.argv.slice(2), { string: ['_'] })
const flagArguments = { remove : argv?.remove }

async function installBrage() {
    const packagePath = '../packages/brage/'
    const packageJsonPath = resolve(__dirname, `${packagePath}package.json`)
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8')
    
    const { name, version, bin } = JSON.parse(packageJsonContent)
    
    const binName = Object.keys(bin)[0]
    const tarballName = `${name}-${version}.tgz`    
    
    if(flagArguments.remove) {
        console.log(gray(`⚡  $ npm uninstall -g ${name}\n`))
        
        const { stdout, stderr } = await exec(`npm uninstall -g ${name}`)
        console.log(gray(`stdout: ${stdout}`))
        
        if(stderr) throw new Error(stderr)
    
        console.log(`👍  The package ${name} of version ${version} has uninstalled successfully\n`)
        
    } else {
        console.log(gray(`⚡  $ npm install -g ${tarballName}\n`))

        const { stdout, stderr } = await exec(`npm install -g ${tarballName}`)
        console.log(gray(`stdout: ${stdout}`))
        
        if(stderr) throw new Error(stderr)
        await remove(resolve(__dirname, `../${tarballName}`))
        
        console.log(`👍  The package ${name} of version ${version} has installed successfully\n`)
        console.log(`👉  ${green('EXECUTE:')} ${inverse(bold(` ${binName} -v `))} to verify its installation\n`)
    }
}

async function installCreate() {
    const packagePath = '../packages/create-brage/'
    const packageJsonPath = join(__dirname, `${packagePath}package.json`)
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8')
    
    const { name, version, bin } = JSON.parse(packageJsonContent)
    
    const binName = Object.keys(bin)[0]
    const tarballName = `${name}-${version}.tgz`    
    
    if(flagArguments.remove) {
        console.log(gray(`⚡  $ npm uninstall -g ${name}\n`))

        const { stdout, stderr } = await exec(`npm uninstall -g ${name}`)
        console.log(gray(`stdout: ${stdout}`))
        
        if(stderr) throw new Error(stderr)
    
        console.log(`👍  The package ${name} of version ${version} has uninstalled successfully\n`)
        
    } else {
        console.log(gray(`⚡  $ npm install -g ${tarballName}\n`))

        const { stdout, stderr } = await exec(`npm install -g ${tarballName}`)
        console.log(gray(`stdout: ${stdout}`))
        
        if(stderr) throw new Error(stderr)
        await remove(resolve(__dirname, `../${tarballName}`))

        console.log(`👍  The package ${name} of version ${version} has installed successfully\n`)
        console.log(`👉  ${green('EXECUTE:')} ${inverse(bold(` ${binName} -v `))} to verify its installation\n`)
    }
}

installBrage().catch(err => console.error(err))
installCreate().catch(err => console.error(err))
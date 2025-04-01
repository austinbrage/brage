import { gray } from "kolorist"
import { Prompt } from './services/prompt'
import { Operation } from './services/operation'

async function createTemplate() {
    
    const prompt = new Prompt('brage-project')
    const promptResult = await prompt.init()

    if('argVersion' in promptResult) return Operation.handleVersion(import.meta.url)
    
    console.log('\n🚀  We will scaffold your app in a few seconds...\n')

    const operation = new Operation(promptResult, import.meta.url)
    operation.handleOverwrite()
    operation.handleTemplate()

    console.log('\n👍  Successfully created project ' + promptResult.targetDir)
    console.log('👉  Get started with the following commands:\n')
    
    promptResult?.cdTargetDir && console.log(gray(`$ cd ${promptResult.cdTargetDir}`))
    console.log(gray('$ npm install'))
    console.log(gray('$ git init'))
}

createTemplate()
    .catch(err => console.error(err))
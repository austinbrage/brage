import { Methods } from "../../utils/methods"
import { type Fields } from "../../types"

type Arguments = {
    writes: { 
        routeName: string, 
        readFieldsPath: string, 
        sanitizedMethods: string[], 
        writePath: string 
    }
}

export class RoutersFile {
    private methods
    private routeName: string
    private sanitizedMethods: string[]
    private fieldsContent: Record<string, Fields>

    constructor() {
        this.routeName = ''
        this.fieldsContent = {}
        this.sanitizedMethods = []
        this.methods = new Methods()
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private generateExpressRoutes() {

        const functionBody = Object.entries(this.fieldsContent).map(([key, value]) => {
            const methodName = key
            const endpoint = value?.endpoint ? value.endpoint : methodName

            let endpointMethod = ''
            let middleware = ''

            if(this.sanitizedMethods.includes(methodName)) middleware = ` sanitize.${methodName},`

            if(methodName.includes('get')) endpointMethod = 'get' 
            if(methodName.includes('add')) endpointMethod = 'post' 
            if(methodName.includes('change')) endpointMethod = 'put' 
            if(methodName.includes('remove')) endpointMethod = 'delete' 

            if(endpointMethod === '') return ''

            return (
                `   ${this.routeName}Router.${endpointMethod}('/${endpoint}',${middleware} ${this.routeName}Controller.${methodName});\n`
            )
        }).join('')

        return functionBody
    }

    private generateRouting() {
        const RouteName = this.capitalizeFirstLetter(this.routeName)

        const functionBody = this.generateExpressRoutes()
        
        const sanitizeCall = this.sanitizedMethods.length > 0
            ? '   const sanitize = new SanitizeGetRequests();\n'
            : ''
        
        const sanitizeImport = this.sanitizedMethods.length > 0
            ? `import SanitizeGetRequests from './${this.routeName}.middlewares.js';\n`
            : ''

        return (
            `import { Router } from "express";\n` +
            `${sanitizeImport}` +
            `import ${RouteName}Controller from './${this.routeName}.controllers.js';\n\n` +

            `const create${RouteName}Router = ({ ${this.routeName}Model }) => {\n` +
            `   const ${this.routeName}Router = Router();\n\n` +

            `${sanitizeCall}` +
            `   const ${this.routeName}Controller = new ${RouteName}Controller({ ${this.routeName}Model });\n\n` +
            
                `${functionBody}\n` +

            `   return ${this.routeName}Router;\n` +
            `}\n\n` +

            `export default create${RouteName}Router;`
        )
    }

    async writeRouterFile({ routeName, readFieldsPath, sanitizedMethods, writePath }: Arguments['writes']) {
        
        const fieldsContent = await this.methods.getJsonObject(readFieldsPath)

        if(fieldsContent) {
            this.routeName = routeName

            this.fieldsContent = fieldsContent as Record<string, Fields>
            this.sanitizedMethods = sanitizedMethods

            const content = this.generateRouting()            
            
            await this.methods.writeContent(writePath, content)

            return content
        }
    }
}
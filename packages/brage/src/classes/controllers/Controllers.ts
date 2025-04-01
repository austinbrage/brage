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

export class ControllersFile {
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

    private generateMethods() {
        
        const RouteName = this.capitalizeFirstLetter(this.routeName)

        const classBody = Object.entries(this.fieldsContent).map(([key, value]) => {
            const methodName = key
            const isFields = value.fields.length > 0

            let reqData = methodName.includes('get') ? 'query' : 'body'
            if(this.sanitizedMethods.includes(methodName)) reqData = 'sanitizedData'

            const validationConst = isFields 
                ? (
                    `        const validation = this.validate${RouteName}.${methodName}(req.${reqData});\n\n` +
                    `        if (!validation.success) return this.validationErr(res, validation.error);\n\n`
                ) : ''
            const returnedData = methodName.includes('get') ? 'data' : 'data: [data]'
            const modelMethodCall = isFields ? `validation.data` : ''
            const requestArgument = isFields ? `req` : '_req'
            
            const requestMessage = value?.message 
                ? value.message
                : `${methodName} in ${this.routeName} executed successfully`
            
            return (
                `    ${methodName} = asyncErrorHandler(async (${requestArgument}, res) => {\n` +
                        `${validationConst}` + 

                `        const data = await this.${this.routeName}Model.${methodName}(${modelMethodCall});\n\n` +

                `        return res.status(200).json(createOkResponse({\n` +
                `            message: '${requestMessage}',\n` +
                `            ${returnedData}\n` +
                `        }));\n` +
                `    })\n\n`
            )
        }).join('')

        return classBody
    }

    private generateController() {

        const RouteName = this.capitalizeFirstLetter(this.routeName)
        const methods = this.generateMethods()

        return (
            `import { ${RouteName}Validation } from './${this.routeName}.validations.js';\n` +
            `import { asyncErrorHandler } from './../../global/handlers/asyncError.js';\n` +
            `import { createOkResponse, createErrorResponse } from './../../global/utils/responses.js';\n\n` +

            `class ${RouteName}Controller {\n\n` +
            
            `    constructor({ ${this.routeName}Model }) {\n` +
            `        this.${this.routeName}Model = ${this.routeName}Model;\n` +
            `        this.validate${RouteName} = new ${RouteName}Validation();\n` +
            `    }\n\n` +
            
            `    validationErr(res, validationError) {\n` +
            `        return res.status(400).json(createErrorResponse({\n` +
            `            message: 'Validation data error',\n` +
            `            error: validationError.format()\n` +
            `        }));\n` +
            `    }\n\n` +

            `${methods}` +

            `}\n\n` +

            `export default ${RouteName}Controller;`
        )
    }

    async writeControllersFile({ routeName, readFieldsPath, sanitizedMethods, writePath }: Arguments['writes']) {
        
        const fieldsContent = await this.methods.getJsonObject(readFieldsPath)

        if(fieldsContent) {
            this.routeName = routeName

            this.fieldsContent = fieldsContent as Record<string, Fields>
            this.sanitizedMethods = sanitizedMethods

            const content = this.generateController()            

            await this.methods.writeContent(writePath, content)

            return content
        }
    }
}
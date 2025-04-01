import { Methods } from "../../utils/methods"
import { type Fields } from "../../types"

type Arguments = {
    writes: { 
        routeName: string, 
        readTypesPath: string, 
        readFieldsPath: string, 
        writePath: string 
    }
}

class SchemaFile {

    constructor() {}

    private generateZodType(name: string, type: string) {
        let zodType = ''
        
        if (type.includes('|')) {
            const types = type?.trim().split('|').map(type => {
                return type.includes('null')
                    ? 'z.null()'
                    : `z.${type?.trim()?.toLowerCase()}()`
            })
            zodType = `z.union([${types.join(', ')}])`
        } else {
            zodType = `z.${type?.trim()?.toLowerCase()}()`
        }
        
        return `${name?.trim()}: ${zodType},`
    }

    private generateZodStringType(name: string) {    
        return `${name?.trim()}: z.string(),`
    }

    generateSchemas(typesContent: Record<string, string>) {

        const properties = Object.entries(typesContent).map(([name, type]) => {
            return this.generateZodType(name, type)
        })

        const propertiesString = Object.entries(typesContent).map(([name]) => {
            return this.generateZodStringType(name)
        })

        return {
            tableSchema: properties.join('\n      '),
            stringTableSchema: propertiesString.join('\n      ')
        }
    }
}

export class ValidationsFile {
    private methods
    private schemaFile
    private routeName: string
    private typesContent: Record<string, string>
    private fieldsContent: Record<string, Fields>

    constructor() {
        this.routeName = ''
        this.typesContent = {}
        this.fieldsContent = {}
        this.methods = new Methods()
        this.schemaFile = new SchemaFile()
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private generateZodMethods() {

        const classBody = Object.entries(this.fieldsContent).map(([key, value]) => {
            if(value?.fields.length === 0) return

            const fields = value.fields.filter((item) => item.trim().length > 0)
            const fieldString = `{ ${fields.map(field => `${field.trim()}: true`).join(', ')} }`

            return `   ${key} = (data) => this.schema.pick(${fieldString}).safeParse(data)\n`
        }).join('')

        return classBody
    }

    private generateZodStringMethods() {

        const classBody = Object.entries(this.fieldsContent).map(([key, value]) => {
            if(!key.includes('get')) return
            if(value?.fields.length === 0) return

            const fields = value.fields.filter((item) => item.trim().length > 0)
            const fieldString = `{ ${fields.map(field => `${field.trim()}: true`).join(', ')} }`

            return `   ${key} = (data) => this.schema.pick(${fieldString}).safeParse(data)\n`
        }).join('')

        return classBody
    }

    private generateValidaton() {
        const RouteName = this.capitalizeFirstLetter(this.routeName)
        
        const classMethod = this.generateZodMethods()
        const classMethodStrig = this.generateZodStringMethods()

        const zodSchemas = this.schemaFile.generateSchemas(this.typesContent)

        return (
            `import { z } from 'zod';\n\n` +

            `export class ${RouteName}Validation {\n\n` +

            `   schema = z.object({\n` +
            `      ${zodSchemas.tableSchema}\n` +
            `   })\n\n` +

                `${classMethod}` +
            `}\n\n` +

            `export class ${RouteName}StringValidation {\n\n` +
            
            `   schema = z.object({\n` +
            `      ${zodSchemas.stringTableSchema}\n` +
            `   })\n\n` +

                `${classMethodStrig}` +
            `}`
        )
    }

    async writeValidationFile({ routeName, readFieldsPath, readTypesPath, writePath }: Arguments['writes']) {
        
        const fieldsContent = await this.methods.getJsonObject(readFieldsPath)
        const typesContent = await this.methods.getJsonObject(readTypesPath)

        if(fieldsContent && typesContent) {
            this.routeName = routeName

            this.fieldsContent = fieldsContent as Record<string, Fields>
            this.typesContent = typesContent as Record<string, string>

            const content = this.generateValidaton()            

            await this.methods.writeContent(writePath, content)

            return content
        }
    }
}
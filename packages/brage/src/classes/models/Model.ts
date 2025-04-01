import { Methods } from "../../utils/methods"

type Arguments = {
    writes: { fieldsObject: Record<string, string[]>, routeName: string, writePath: string }
}


export class ModelFile {
    private methods
    private routeName: string
    private fieldsObject: Record<string, string[]>

    constructor() {
        this.routeName = ''
        this.fieldsObject = {}
        this.methods = new Methods() 
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private addMethods() {

        let generatedCode = ''

        for (const functionName in this.fieldsObject) {
            const parameters = this.fieldsObject[functionName].join(', ')
            const parameterObject = parameters ? `{ ${parameters} }` : ''

            generatedCode += (
                `    ${functionName} = async (${parameterObject}) => {\n` +
                `        return this.connectionHandler(this.pool, async (connection) => {\n\n` +

                `            const [rows] = await connection.execute(\n` +
                `               ${this.routeName}Queries.${functionName},\n` +
                `               [${parameters}]\n` +
                `            );\n\n` +

                `            return rows;\n` +
                `        })\n` +
                `    }\n\n`
            ) 
        }

        return generatedCode
    }

    private addTemplate() {

        const RouteName = this.capitalizeFirstLetter(this.routeName)
        const methods = this.addMethods()

        return (
        `import ${this.routeName}Queries from './${this.routeName}.queries.js';\n` +
        `import { ConnectionHandler } from '../../global/handlers/connection.js';\n\n` +

        `class ${RouteName}Mysql {\n\n` +
            
        `    constructor({ ${this.routeName}Pool }) {\n` +
        `        const connectionHandler = new ConnectionHandler('${this.routeName}');\n\n` +

        `        this.pool = ${this.routeName}Pool;\n` +
        `        this.connectionHandler = connectionHandler.connect;\n` +
        `    }\n\n` +
        
        `${methods}` +
        `}\n\n` +

        `export default ${RouteName}Mysql;`
        )
    }

    async writeModelFile({ fieldsObject, routeName, writePath }: Arguments['writes']) {
        this.fieldsObject = fieldsObject
        this.routeName = routeName

        const content = this.addTemplate()

        await this.methods.writeContent(writePath, content)

        return content
    }
}
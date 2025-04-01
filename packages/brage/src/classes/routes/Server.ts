import { Methods } from "../../utils/methods"

type Arguments = {
    routes: { routeNames: string[] }
    writes: { routeNames: string[], writePath: string }
}

export class IndexFile {
    private methods

    constructor() {
        this.methods = new Methods()
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private generatePools({ routeNames }: Arguments['routes']) {

        return routeNames.map(elem => {
            return `const ${elem}Pool = createPoolConnection({ wait: true, cLimit: 1, qLimit: 0 });`
        }).join('\n')
    }

    private generateModels({ routeNames }: Arguments['routes']) {

        return routeNames.map(elem => {
            const RouteName = this.capitalizeFirstLetter(elem)
            return `const ${elem}Model = new ${RouteName}Model({ ${elem}Pool });`
        }).join('\n')
    }

    private generateImports({ routeNames }: Arguments['routes']) {

        return routeNames.map(elem => {
            const RouteName = this.capitalizeFirstLetter(elem)
            return `import ${RouteName}Model from "./routes/${elem}/${elem}.model.mysql.js";`
        }).join('\n')
    }

    private generateExports({ routeNames }: Arguments['routes']) {

        return routeNames.map((elem, index) => {
            if(index === elem.length - 1) return `   ${elem}Pool`
            return `   ${elem}Pool,`
        }).join('\n')
    }

    private generateModelsArgs({ routeNames }: Arguments['routes']) {

        return routeNames.map((elem, index) => {
            if(index === elem.length - 1) return `   ${elem}Model`
            return `   ${elem}Model,`
        }).join('\n')
    }

    private modifyBodyFile({ routeNames }: Arguments['routes']) {

        const pools = this.generatePools({ routeNames })
        const models = this.generateModels({ routeNames })
        const imports = this.generateImports({ routeNames })
        const exports = this.generateExports({ routeNames })
        const modelsArgs = this.generateModelsArgs({ routeNames })

        return (
            `import createApp from "./routes/app.js";\n` +
            `${imports}\n` +
            `import { PORT, ENVIRONMENT } from "./global/utils/config.js";\n` +
            `import { createPoolConnection } from "./global/utils/database.js";\n` +
            `import { checkDatabaseConnection } from "./global/helpers/databaseCheck.js";\n\n` +

            `const pingPool = createPoolConnection({ wait: true, cLimit: 1, qLimit: 0 });\n` +
            `${pools}\n\n` +

            `${models}\n\n` +

            `const app = createApp({\n` +
            `   pingPool,\n` +
                `${modelsArgs}\n` +
            `});\n\n` +

            `await checkDatabaseConnection({\n` +
            `   pool: pingPool,\n` +
            `   delay: 2000,\n` +
            `   devRetries: 1,\n` +
            `   prodRetries: 5\n` +
            `});\n\n` +

            `const server = app.listen(PORT[ENVIRONMENT], () => {\n` +
            `   console.log(\`Server running on Port: \${PORT[ENVIRONMENT]}\`);\n` +
            `});\n\n` +

            `export {\n` +
            `   app,\n` +
            `   server,\n` +
                `${exports}\n` +
            `};`
        )
    }

    async writeServerFile({ routeNames, writePath }: Arguments['writes']) {
        const content = this.modifyBodyFile({ routeNames })            

        await this.methods.writeContent(writePath, content)
    }
}
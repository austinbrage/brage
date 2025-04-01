import { Methods } from "../../utils/methods"

type Arguments = {
    routes: { routeNames: string[] }
    writes: { routeNames: string[], writePath: string }
}

export class AppFile {
    private methods

    constructor() {
        this.methods = new Methods()
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private generateAppArgs({ routeNames }: Arguments['routes']) {
        
        return routeNames.map((elem) => {
            return `   ${elem}Model,`
        }).join('\n')
    }

    private generateControllerImports({ routeNames }: Arguments['routes']) {

        return routeNames.map((elem) => {
            const RouteName = this.capitalizeFirstLetter(elem)
            return `import create${RouteName}Router from "./${elem}/${elem}.router.js";`
        }).join('\n')
    }

    private generateControllerMountings({ routeNames }: Arguments['routes']) {

        return routeNames.map((elem) => {
            const ROUTENAME = elem.toLocaleUpperCase()
            const RouteName = this.capitalizeFirstLetter(elem)
            return `   mainRouter.use(RESOURCES.${ROUTENAME}, create${RouteName}Router({ ${elem}Model }));`
        }).join('\n')
    }

    private modifyCreateFunction({ routeNames }: Arguments['routes']) {

        const args = this.generateAppArgs({ routeNames })
        const controllers = this.generateControllerImports({ routeNames })
        const controllersMounts = this.generateControllerMountings({ routeNames })

        return (
            `import morgan from "morgan";\n` +
            `import helmet from "helmet";\n` +
            `import express, { json, Router } from "express";\n` +
            `import { APP, RESOURCES } from "./endpoints.js";\n` +
            `import corsMiddleware from "../global/middlewares/cors.js";\n` +
            `import errorMiddleware from "../global/middlewares/error.js";\n` +
            `import createHealthcareRouter from "./healthcare/healthcare.router.js";\n` +
            `${controllers}\n` +
            `import { notFoundHandler } from "../global/handlers/notFound.js";\n\n` +

            `const createApp = ({\n` +
            `   pingPool,\n` +
                `${args}\n` +
            `}) => {\n` +
            `   const app = express();\n` +
            `   const mainRouter = Router();\n\n` +

            `   app.use(json());\n` +
            `   app.use(helmet());\n` +
            `   app.use(morgan('dev'));\n` +
            `   app.use(corsMiddleware());\n\n` +

            `   mainRouter.use(RESOURCES.PING, createHealthcareRouter({ pingPool }));\n` +
                `${controllersMounts}\n\n` +
            
            `   app.use(APP.VERSION_1, mainRouter);\n` +
            `   app.all('*', notFoundHandler);\n` +
            `   app.use(errorMiddleware);\n\n` +

            `   return app;\n` +
            `}\n\n` +

            `export default createApp;`
        )
    }

    async writeAppFile({ routeNames, writePath }: Arguments['writes']) {
        const content = this.modifyCreateFunction({ routeNames })            

        await this.methods.writeContent(writePath, content)
    }
}
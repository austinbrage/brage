import { join } from "path"

export const folder = {
    app: join(process.cwd(), 'app'),
    brage: join(process.cwd(), 'brage'),
    server: join(process.cwd(), 'server', 'routes')
}

export class Path {
    private readonly inputPathFolder: string
    private readonly statePathFolder: string
    private readonly outputPathFolder: string

    constructor(private readonly routeName: string) {
        this.inputPathFolder = join(folder.app, this.routeName)
        this.statePathFolder = join(folder.brage, this.routeName)
        this.outputPathFolder = join(folder.server, this.routeName)
    }

    private buildPath(folder: string, fileName: string): string {
        return join(folder, fileName)
    }


    //* Input Paths 
    get getQueriesPath(): string {
        return this.buildPath(this.inputPathFolder, 'queries.sql')
    }

    get getTablePath(): string {
        return this.buildPath(this.inputPathFolder, 'table.sql')
    }


    //* Output Paths [CREATE]
    get getControllersPath(): string {
        const controllerFileName = `${this.routeName}.controllers.js`
        return this.buildPath(this.outputPathFolder, controllerFileName)
    }

    get getHelpersPath(): string {
        const helperFileName = `${this.routeName}.queries.js`
        return this.buildPath(this.outputPathFolder, helperFileName)
    }

    get getMiddlewaresPath(): string {
        const middlewareFileName = `${this.routeName}.middlewares.js`
        return this.buildPath(this.outputPathFolder, middlewareFileName)
    }

    get getModelPath(): string {
        const modelFileName = `${this.routeName}.model.mysql.js`
        return this.buildPath(this.outputPathFolder, modelFileName)
    }

    get getValidationsPath(): string {
        const validationFileName = `${this.routeName}.validations.js`
        return this.buildPath(this.outputPathFolder, validationFileName)
    }

    get getRouterPath(): string {
        const routerFileName = `${this.routeName}.router.js`
        return this.buildPath(this.outputPathFolder, routerFileName)
    }

    //* Output Paths [UPDATE]
    get getAppPath(): string {
        return this.buildPath(folder.server, 'app.js')
    }
    
    get getEndpointsPath(): string {
        return this.buildPath(folder.server, 'endpoints.js')
    }
    
    get getIndexPath(): string {
        return this.buildPath(join(process.cwd(), 'server'), 'index.js')
    }


    //* State Paths 
    get getTypesPath(): string {
        return this.buildPath(this.statePathFolder, 'types.json')
    }
    
    get getFieldsPath(): string {
        return this.buildPath(this.statePathFolder, 'fields.json')
    }
}
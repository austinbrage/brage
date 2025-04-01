import { LOGS } from "../../utils/logs"
import { Path, folder } from "../../utils/paths"
import { relative, resolve, sep } from "path"
import { ValidationsFile } from "./Validations"
import { MiddlewaresFile } from "./Middlewares"
import { ControllersFile } from "./Controllers"
import { RoutersFile } from "./Routers"

export class AppController {
    private routeName: string
    private sanitizedMethods: string[]
    private validationsFile
    private middlewaresFile
    private controllersFile
    private routersFile

    constructor(private mode: 'added' | 'changed') {
        this.routeName = ''
        this.sanitizedMethods = []
        this.validationsFile = new ValidationsFile()
        this.middlewaresFile = new MiddlewaresFile()
        this.controllersFile = new ControllersFile()
        this.routersFile = new RoutersFile()
    }

    private handleError(err: Error) {
        console.error(err.message)
    }

    private isQueriesFile(filePath: string) {
        const relativePath = relative(folder.app, resolve(filePath))
        const normalizedPath = relativePath.replace(/[/\\]/g, sep)
        const pathSegments = normalizedPath.split(sep)
        
        if(pathSegments.length !== 2) return false
        if(pathSegments[1] !== 'queries.sql') return false
        
        this.routeName = pathSegments[0]  
        return true
    }

    private isTableFile(filePath: string) {
        const relativePath = relative(folder.app, resolve(filePath))
        const normalizedPath = relativePath.replace(/[/\\]/g, sep)
        const pathSegments = normalizedPath.split(sep)

        if(pathSegments.length !== 2) return false
        if(pathSegments[1] !== 'table.sql') return false
        
        this.routeName = pathSegments[0]  
        return true
    }

    private async createValidationsFiles() {
        const paths = new Path(this.routeName)

        const content_validations = await this.validationsFile.writeValidationFile({
            readFieldsPath: paths.getFieldsPath,
            readTypesPath: paths.getTypesPath,
            routeName: this.routeName,
            writePath: paths.getValidationsPath
        })

        if(content_validations) console.log(LOGS.VALIDATIONS_GENERATED(this.routeName, this.mode))
    }

    private async createMiddlewaresFiles() {
        const paths = new Path(this.routeName)

        const content_middlewares = await this.middlewaresFile.writeMiddlewareFile({
            readFieldsPath: paths.getFieldsPath,
            readTypesPath: paths.getTypesPath,
            routeName: this.routeName,
            writePath: paths.getMiddlewaresPath
        })

        if(content_middlewares) {
            this.sanitizedMethods = content_middlewares
            console.log(LOGS.MIDDLEWARES_GENERATED(this.routeName, this.mode))
        }
    }

    private async createControllersFiles() {
        const paths = new Path(this.routeName)

        const content_controllers = await this.controllersFile.writeControllersFile({
            readFieldsPath: paths.getFieldsPath,
            sanitizedMethods: this.sanitizedMethods,
            routeName: this.routeName,
            writePath: paths.getControllersPath
        })

        if(content_controllers) console.log(LOGS.CONTROLLERS_GENERATED(this.routeName, this.mode))
    }

    private async createRoutersFiles() {
        const paths = new Path(this.routeName)

        const content_router = await this.routersFile.writeRouterFile({
            readFieldsPath: paths.getFieldsPath,
            sanitizedMethods: this.sanitizedMethods,
            routeName: this.routeName,
            writePath: paths.getRouterPath
        })

        if(content_router) console.log(LOGS.ROUTERS_GENERATED(this.routeName, this.mode))
    }

    async createController(filePath: string) {
        if(!this.isTableFile(filePath) && !this.isQueriesFile(filePath)) return

        await this.createValidationsFiles()
        await this.createMiddlewaresFiles()
        await this.createControllersFiles()
        await this.createRoutersFiles()
    }
}
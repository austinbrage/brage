import { Path, folder } from '../../utils/paths'
import { AppFile } from './CreateApp'
import { IndexFile } from './Server'
import { EndpointsFile } from './Endpoints'
import { LOGS } from '../../utils/logs'
import { sep, join, resolve, relative } from 'path'
import { Methods } from '../../utils/methods'

export class AppRoute {
    private methods
    private appFile
    private indexFile
    private endpointsFile
    private routeName: string
    private routeNames: string[]

    constructor() {
        this.routeName = ''
        this.routeNames = []
        this.methods = new Methods()
        this.appFile = new AppFile()
        this.indexFile = new IndexFile()
        this.endpointsFile = new EndpointsFile()
    }

    private handleError(err: Error) {
        console.error(err.message)
    }

    private isRouteFolder(filePath: string) {
        const relativePath = relative(folder.app, resolve(filePath))
        const normalizedPath = relativePath.replace(/[/\\]/g, sep)
        const pathSegments = normalizedPath.split(sep)

        if(pathSegments.length !== 1) return false
        return this.routeName = pathSegments[0]  
    }

    private async getRouteFolders() {
        const files = await this.methods.getInnerFiles(folder.app)

        if(files) {
            for (const name of files) {
                const paths = new Path(name)
                
                const existControllersFile = await this.methods.checkExistingFile(paths.getControllersPath)
                    .catch(this.handleError)
            
                const existModelFile = await this.methods.checkExistingFile(paths.getModelPath)
                    .catch(this.handleError)

                const isFolder = await this.methods.checkExistingFolder(`${folder.app}/${name}`)
                    .catch(this.handleError)

                if (isFolder && existControllersFile && existModelFile) {
                    this.routeNames.push(name)
                }
            }
        }
    }

    private async modifyCreateAppFile() {
        const paths = new Path('')

        await this.appFile.writeAppFile({ 
            routeNames: this.routeNames, 
            writePath: paths.getAppPath 
        })
            .catch(this.handleError)
    }

    private async modifyEndpointsFile() {
        const paths = new Path('')

        await this.endpointsFile.writeEndpointsFile({ 
            routeNames: this.routeNames, 
            writePath: paths.getEndpointsPath 
        })
            .catch(this.handleError)
    }

    private async modifyIndexFile() {
        const paths = new Path('')

        this.indexFile.writeServerFile({ 
            routeNames: this.routeNames, 
            writePath: paths.getIndexPath 
        })
            .catch(this.handleError)
    }

    async createRouteFolder(filePath: string) {
        if(!this.isRouteFolder(filePath)) return

        const serverFolderPath = join(folder.server, this.routeName)
        const brageFolderPath = join(folder.brage, this.routeName)

        await this.methods.ensureFolder(serverFolderPath)
            .catch(this.handleError)
        
        await this.methods.ensureFolder(brageFolderPath)
            .catch(this.handleError)
            
        console.log(LOGS.ROUTE_CREATED(this.routeName))
    }

    async deleteRouteFolder(filePath: string) {
        if(!this.isRouteFolder(filePath)) return

        const serverFolderPath = join(folder.server, this.routeName)
        const brageFolderPath = join(folder.brage, this.routeName)

        await this.methods.removeFolder(serverFolderPath)
            .catch(this.handleError)

        await this.methods.removeFolder(brageFolderPath)
            .catch(this.handleError)

        console.log(LOGS.ROUTE_DELETED(this.routeName))
    }

    async createEntryPoints(filePath: string) {
        await this.getRouteFolders()

        await this.modifyCreateAppFile()
        await this.modifyEndpointsFile()
        await this.modifyIndexFile()

        console.log(LOGS.ROUTE_INTEGRATED(this.routeName))
    }
}
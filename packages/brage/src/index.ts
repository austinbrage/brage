import chokidar from 'chokidar'
import { folder } from './utils/paths'
import { AppRoute } from './classes/routes/AppRoutes'
import { AppModel } from './classes/models/AppModel'
import { AppController } from './classes/controllers/AppController'
import { LOGS } from './utils/logs'
import { Methods } from './utils/methods'
import { flagArguments } from './helpers/arguments'
import { printVersion } from './helpers/version'

async function createRoutes() {

    const methods = new Methods()
    
    let showMessage: boolean = true
    if(flagArguments.version) return printVersion(import.meta.url)
    
    const isFolderApp = await methods.checkExistingFolder(folder.app)
    if(!isFolderApp) throw new Error('Failed: No app folder on this directory')

    const noPersistent = () => (
        process.env.NODE_ENV === 'production' || 
        process.env.NODE_ENV === 'test' ||
        flagArguments.once
    )
    
    const watcher = chokidar.watch(folder.app, {
        ignored: /(^|[/\\])\..*|README\.md$/, 
        persistent: noPersistent() ? false : true
    })

    watcher.on('all', async () => { 
        if(showMessage) {
            console.log(LOGS.PROGRAM_STARTED)
            console.log(LOGS.LISTENING)
            showMessage = false
        } 
    })
    
    // Create, Delete Server Route
    watcher.on('addDir', async (path) => {
        const appRoute = new AppRoute()
        await appRoute.createRouteFolder(path)
    })
    
    watcher.on('unlinkDir', async (path) => {
        const appRoute = new AppRoute()
        await appRoute.deleteRouteFolder(path)
        await appRoute.createEntryPoints(path)
    })
    
    // Create Server Routes Model
    watcher.on('add', async (path) => {
        const appModel = new AppModel('added')
        await appModel.createModel(path)
    
        const appController = new AppController('added')
        await appController.createController(path)
    
        const appRoute = new AppRoute()
        await appRoute.createEntryPoints(path)
    })
    
    watcher.on('change', async (path) => {
        const appModel = new AppModel('changed')
        await appModel.createModel(path)
    
        const appController = new AppController('changed')
        await appController.createController(path)
    
        const appRoute = new AppRoute()
        await appRoute.createEntryPoints(path)
    })
}

createRoutes()
    .catch(err => console.error(err.message))
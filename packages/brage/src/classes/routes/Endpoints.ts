import { Methods } from "../../utils/methods"

type Arguments = {
    writes: { routeNames: string[], writePath: string }
}

export class EndpointsFile {
    private methods
    private routeNames: string[]

    constructor() {
        this.routeNames = []
        this.methods = new Methods()
    }

    private generateEndpoints() {

        return this.routeNames.map((elem, index) => {
            if(index === this.routeNames.length - 1) return `   ${elem.toUpperCase()}: '/${elem}'`
            return `   ${elem.toUpperCase()}: '/${elem}',`
        }).join('\n')
    }

    private modifyObjects() {

        const endpoints = this.generateEndpoints()

        return (
            `export const APP = {\n` +
            `   VERSION_1: '/app'\n` +
            `}\n\n` +

            `export const RESOURCES = {\n` +
            `   PING: '/ping',\n` +
                `${endpoints}\n` +
            `}`
        )
    }

    async writeEndpointsFile({ routeNames, writePath }: Arguments['writes']) {
        this.routeNames = routeNames
        const content = this.modifyObjects()            

        await this.methods.writeContent(writePath, content)
    }
}
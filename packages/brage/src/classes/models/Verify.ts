import { Methods } from "../../utils/methods"
import { LOGS } from "../../utils/logs"

type Arguments = {
    checker: {
        routeName: string,
        typesObject: Record<string, string>,
        fieldsObject: Record<string, Record<string, string | string[]>>
    }
    queries: {
        typesPath: string,
        fieldsPath: string,
        routeName: string,
        fieldsObject: Record<string, Record<string, string | string[]>>
    }
    table: {
        fieldsPath: string,
        routeName: string,
        typesObject: Record<string, string>
    }
}

export class VerifyFields {
    private methods
    private newOnlyFields: Record<string, string[]>

    constructor() {
        this.methods = new Methods()
        this.newOnlyFields = {}
    }

    private checkCorrectFields({ routeName, fieldsObject, typesObject }: Arguments['checker']) {
        const badQueries: string[] = []
        const isTypesObject = Object.keys(typesObject).length > 0

        Object.entries(fieldsObject).map(([key, value]) => {
            if(!Array.isArray(value?.fields)) return

            value.fields.forEach((elem) => {
                if(!(elem in typesObject)) {
                    isTypesObject && console.log(LOGS.WARNING_WRONGFIELD(key, elem, routeName))
                    badQueries.push(key)
                } 
                else return elem 
            })

            this.newOnlyFields[key] = value.fields
        })

        if(badQueries.length > 0) {
            badQueries.forEach((badQuery) => {
                delete fieldsObject[badQuery]
                delete this.newOnlyFields[badQuery]
            })

            return JSON.stringify(fieldsObject, null, 2)
        } 
    }
    
    async verifyOnTableChange({ fieldsPath, routeName, typesObject }: Arguments['table']) {
        
        const fieldsObject = await this.methods.getJsonObject(fieldsPath) as Record<string, Record<string, string | string[]>>
        if(!fieldsObject) return 
        
        const newContent = this.checkCorrectFields({ routeName, fieldsObject, typesObject })
        if(newContent) await this.methods.writeContent(fieldsPath, newContent)

        return this.newOnlyFields
    }

    async verifyOnQueriesChange({ typesPath, fieldsPath, routeName, fieldsObject }: Arguments['queries']) {

        const typesObject = await this.methods.getJsonObject(typesPath) as Record<string, string>
        if(!typesObject) return console.log(LOGS.WARNING_MISSINGTYPES(routeName))

        const newContent = this.checkCorrectFields({ routeName, fieldsObject, typesObject })
        if(newContent) await this.methods.writeContent(fieldsPath, newContent)

        return this.newOnlyFields
    }   
}
import { Methods } from "../../utils/methods"

type Arguments = {
    writes: { 
        writePath: string, 
        queries: Record<string, string>, 
        metadata: Record<string, Record<string, string>> 
    }
}

export class FieldsFile {
    private methods

    constructor() {
        this.methods = new Methods()
    }

    private getFieldsFromQuery(query: string) {
        const insertMatch = query.match(/INSERT INTO `[^`]+` \(([^)]+)\)/)
        const regularMatch = query.matchAll(/`(\w+)` = \?/g)

        if(insertMatch) return insertMatch[1].split(',').map(field => {
            return field.trim().replace(/`/g, '')
        })

        return Array.from(regularMatch, match => match[1])
    }

    async writeFieldsFile({ writePath, queries, metadata }: Arguments['writes']) {
        const newContent: Record<string, Record<string, string | string[]>> = {}
        const newFieldsOnly: Record<string,string[]> = {}

        for (const key in queries) {
            const newFields: Record<string, string[]> = {}

            if (queries[key] !== undefined) {
                const query = queries[key]
                const fields = this.getFieldsFromQuery(query)
                
                newFields['fields'] = fields
                newFieldsOnly[key] = fields

                if(key in metadata) newContent[key] = { ...newFields, ...metadata[key] }
                else newContent[key] = newFields
            }
        }

        const fieldsObject = JSON.stringify(newContent, null, 2)

        await this.methods.writeContent(writePath, fieldsObject)

        return { fieldsOnly: newFieldsOnly, fieldsData: newContent }
    }
}
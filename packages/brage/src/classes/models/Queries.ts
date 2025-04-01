import { Methods } from '../../utils/methods'
import { LOGS } from '../../utils/logs'

type Arguments = {
    writes: { readPath: string, writePath: string, tableName: string }
}

export class QueriesFile {
    private methods
    private queries: Record<string, string>
    private metadata: Record<string, Record<string, string>>
    private content: string
    private allowedKeys: string[]
    private allowedMetadata: string[]

    constructor() {
        this.content = ''
        this.queries = {}
        this.metadata = {}
        this.methods = new Methods()
        this.allowedKeys = ['get', 'add', 'change', 'remove']
        this.allowedMetadata = ['endpoint', 'message']
    }

    private isValidQuery(line: string) {
        const isIncluded = (key: string) => line.slice(2).trim().startsWith(key)
        return line.startsWith('--') && !line.startsWith('-- !') && !this.allowedKeys.some(key => isIncluded(key))
    }

    private processMetadata(line: string, currentComment: string, currentMetadata: Record<string, string>) {
        const metadataMatch = line.match(/-- ! (\w+): (.+)/)

        if(metadataMatch) {
            const key = metadataMatch[1]
            const value = metadataMatch[2]
            
            if(this.allowedMetadata.includes(key)) {
                if(key === this.allowedMetadata[0]) currentMetadata[key] = value.replace(/\s+/g, '')
                else currentMetadata[key] = value
                if(currentComment !== '') this.metadata[currentComment] = currentMetadata
            }
            
            return true
        } 
        
        return false
    }

    private async processSQL(fileText: string) {
        const newData: Record<string, string> = {}
        const lines = fileText.split('\n')
        
        let currentQuery = ''
        let currentComment = ''
        let currentMetadata: Record<string, string> = {}

        for (const line of lines) {
            const cleanLine = line.trim()
    
            if (this.isValidQuery(cleanLine)) {
                const cleanKey = cleanLine.slice(2).trim()
                const allowedKeysString = this.allowedKeys.join(', ')
                console.log(LOGS.WARNING_WRONGQUERY(cleanKey, allowedKeysString))
                continue
            }
            
            if (cleanLine.startsWith('--')) {
                if(!this.processMetadata(cleanLine, currentComment, currentMetadata)) {
                    currentComment = cleanLine.slice(2).trim()
                }
            } else if (cleanLine !== '') {
                currentMetadata = {}
                if (currentComment !== '') currentQuery += cleanLine + ' '
            } else if (currentComment !== '' && currentQuery.trim() !== '') {
                newData[currentComment] = currentQuery
                currentComment = ''
                currentQuery = ''
            }
        }

        this.queries = newData
    }

    private generateContent(tableName: string) {
        this.content = `const ${tableName}Queries = ${JSON.stringify(this.queries, null, 2)};\n\nexport default ${tableName}Queries;`
    }

    async writeQueriesFile({ readPath, writePath, tableName }: Arguments['writes']) {        
        const sqlContent = await this.methods.getContent(readPath)

        this.processSQL(sqlContent ?? '')
        this.generateContent(tableName)

        await this.methods.writeContent(writePath, this.content)

        return { queries: this.queries, metadata: this.metadata }
    }
}
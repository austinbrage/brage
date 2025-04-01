import { LOGS } from '../../utils/logs'
import { Methods } from '../../utils/methods'
import { TYPES_MAP, isValidType } from "../../utils/types"

type Arguments = {
    write: { readPath: string, writePath: string, routeName: string }
    columnInfo: { name: string, type: string, constraint?: string }
}

export class TableFile {
    private methods

    constructor() {
        this.methods = new Methods()
    }    

    private getTypescriptTypes(sqlType: string, constraint: string) {

        const match = sqlType.match(/(\w+)(?:\((\d+)\))?/)

        if(!match) return 'any'
    
        const baseType = match[1].toUpperCase()
        const tsType = isValidType(baseType) ? TYPES_MAP[baseType] : 'any'
        const isNotNull = constraint ? constraint.includes('NOT NULL') : false
        const isAutoIncrement = constraint ? constraint.includes('AUTO_INCREMENT') : false
    
        if(isNotNull || isAutoIncrement) return tsType
        return tsType + ' | null'
    }

    private parseTableContent(tableContent: string): Arguments['columnInfo'][] {
        const columnRegex = /`(\w+)`\s+(\w+(?:\(\d+\))?)\s+(NOT NULL|AUTO_INCREMENT|DEFAULT|UNIQUE \S+)?/;
        const columnsMatch = tableContent.match(new RegExp(columnRegex, 'g'))
    
        if (!columnsMatch) return []
        
        return columnsMatch.map(column => {
            const matchResult = column.match(columnRegex)
    
            if (matchResult && matchResult.length >= 4) {
                const [, name, type, constraint] = matchResult as [string, string, string, string]
                return { name, type, constraint }
            } else {
                console.error(`No match found for column ${column}.`)
                return { name: '', type: '', constraint: '' }
            }
        })
    }

    private getTypeScriptContent(columns: Arguments['columnInfo'][]) {

        return `{\n${columns.map((column, index) => {
            if(!column.type || !column.constraint) return
            
            const comma = index === columns.length - 1 ? '' : ',' 

            const tsType = this.getTypescriptTypes(column.type, column.constraint)
            return `   "${column.name}": "${tsType}"${comma}`
            
        }).join('\n')}\n}`
    }

    async writeTablesFile({ readPath, writePath, routeName }: Arguments['write']) {
        const sqlContent = await this.methods.getContent(readPath)

        const tableRegex = /CREATE TABLE `(\w+)` \(([\s\S]*?)\);/i
        const match = sqlContent ? sqlContent.match(tableRegex) : null

        if(match) {
            const tableContent = match[2]

            const columns = this.parseTableContent(tableContent)
            
            if (columns.length === 0) return

            const content = this.getTypeScriptContent(columns)

            await this.methods.writeContent(writePath, content)
            return this.methods.parseJson(content, writePath)
        } else {
            console.log(LOGS.WARNING_MISSINGTABLE(routeName))
            await this.methods.writeContent(writePath, '{}')
        }

        return {}
    }    
}
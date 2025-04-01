import { relative, resolve, sep } from "path"
import { folder, Path } from "../../utils/paths"
import { LOGS } from "../../utils/logs"
import { TableFile } from "./Table"
import { QueriesFile } from "./Queries" 
import { FieldsFile } from "./Fields"
import { ModelFile } from "./Model"
import { VerifyFields } from "./Verify"

export class AppModel {
    private types: Record<string, string>
    private fields: Record<string, string[]>
    private queries: Record<string, string>
    private metadata: Record<string, Record<string, string>>
    private fieldsData: Record<string, Record<string, string | string[]>>
    private routeName: string
    private tableFile
    private fieldsFile
    private queriesFile
    private verifyFields
    private modelFile

    constructor(private mode: 'added' | 'changed') {
        this.types = {}
        this.fields = {}
        this.queries = {}
        this.metadata = {}
        this.fieldsData = {}
        this.routeName = ''
        this.tableFile = new TableFile()
        this.fieldsFile = new FieldsFile()
        this.queriesFile = new QueriesFile()
        this.verifyFields = new VerifyFields()
        this.modelFile = new ModelFile()
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

    private async createTableFile(filePath: string) {
        if(!this.isTableFile(filePath)) return

        const paths = new Path(this.routeName)

        const content_types = await this.tableFile.writeTablesFile({ 
            readPath: filePath, 
            writePath: paths.getTypesPath,
            routeName: this.routeName
        })
            .catch(this.handleError)

        if(content_types) {
            this.types = content_types as Record<string, string>
            console.log(LOGS.TYPES_GENERATED(this.routeName, this.mode))
        }
    }

    private async createQueriesFiles(filePath: string) {
        if(!this.isQueriesFile(filePath)) return

        const paths = new Path(this.routeName)

        const content_queries = await this.queriesFile.writeQueriesFile({ 
            readPath: filePath, 
            writePath: paths.getHelpersPath,
            tableName: this.routeName 
        })
            .catch(this.handleError)

        if(content_queries) {
            this.queries = content_queries.queries
            this.metadata = content_queries.metadata
            console.log(LOGS.QUERIES_GENERATED(this.routeName, this.mode))
        }
    }

    private async createFieldsFile(filePath: string) {
        if(!this.isQueriesFile(filePath)) return

        const paths = new Path(this.routeName)
        
        const content_fields = await this.fieldsFile.writeFieldsFile({  
            writePath: paths.getFieldsPath,
            metadata: this.metadata,
            queries: this.queries,
        })
            .catch(this.handleError)

        if(content_fields) {
            this.fields = content_fields.fieldsOnly
            this.fieldsData = content_fields.fieldsData
            console.log(LOGS.FIELDS_GENERATED(this.routeName, this.mode))
        }
    }

    private async verifyFieldsFile(filePath: string) {
        if(this.isTableFile(filePath)) {

            const paths = new Path(this.routeName)
            
            const newFields = await this.verifyFields.verifyOnTableChange({
                routeName: this.routeName,
                typesObject: this.types,
                fieldsPath: paths.getFieldsPath
            })
                .catch(this.handleError)

            if(newFields) this.fields = newFields

        } else if(this.isQueriesFile(filePath)) {

            const paths = new Path(this.routeName)
            
            const newFields = await this.verifyFields.verifyOnQueriesChange({
                routeName: this.routeName,
                fieldsObject: this.fieldsData,
                typesPath: paths.getTypesPath,
                fieldsPath: paths.getFieldsPath
            })
                .catch(this.handleError)

            if(newFields) this.fields = newFields
        } 
    }

    private async createModelFile() {
        if(Object.keys(this.fields).length === 0) return

        const paths = new Path(this.routeName)

        const content_model = await this.modelFile.writeModelFile({  
            writePath: paths.getModelPath,
            routeName: this.routeName,
            fieldsObject: this.fields
        })
            .catch(this.handleError)

        if(content_model) console.log(LOGS.MODEL_GENERATED(this.routeName, this.mode))
    }

    async createModel(filePath: string) {
        await this.createTableFile(filePath)
        await this.createQueriesFiles(filePath)
        await this.createFieldsFile(filePath)
        await this.verifyFieldsFile(filePath)
        await this.createModelFile()
    }
}
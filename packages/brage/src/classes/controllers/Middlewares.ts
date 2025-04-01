import { Methods } from "../../utils/methods"
import { type Fields } from "../../types"

type Arguments = {
    writes: { 
        routeName: string, 
        readTypesPath: string, 
        readFieldsPath: string, 
        writePath: string 
    }
}

export class MiddlewaresFile {
    private methods
    private routeName: string
    private sanitizedMethods: string[]
    private typesContent: Record<string, string>
    private fieldsContent: Record<string, Fields>

    constructor() {
        this.routeName = ''
        this.typesContent = {}
        this.fieldsContent = {}
        this.sanitizedMethods = []
        this.methods = new Methods()
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    private getDataConvertions() {
        
        const dataComparedObj: Record<string, string[]> = {}

        Object.entries(this.typesContent).map(([typeKey, typeValue]) => {
            Object.entries(this.fieldsContent).forEach(([fieldKey, fieldValue]) => {
                if(!fieldKey.includes('get')) return

                fieldValue.fields.forEach(elem => {
                    if(elem.includes(typeKey.trim())) dataComparedObj[elem.trim().replace(/"/g, '')] = ['string', typeValue.trim()]
                })
            })
        })
        
        return dataComparedObj        
    }

    private generateMethods() {
        
        const RouteName = this.capitalizeFirstLetter(this.routeName)

        const dataComparedObj = this.getDataConvertions()

        const classBody = Object.entries(this.fieldsContent).map(([fieldKey, fieldValue]) => {
            if(!fieldKey.includes('get')) return

            const fields = fieldValue.fields
                .filter((item) => item.trim().length > 0)
                .map(elem => elem.trim().replace(/"/g, ''))

            let dataConvertions: string = ''
            let isDataToConvert: boolean = false
            
            fields.map(elem => {
                if(Object.keys(dataComparedObj).includes(elem)) {
                    
                    dataConvertions += '        //' + elem + ' goes from ' + dataComparedObj[elem].join(',').replace(',', ' to ') + '\n'
                    
                    if(dataComparedObj[elem][1] === 'number') {
                        dataConvertions += `        req.sanitizedData.${elem} = parseInt(validation.data.${elem}, 10);\n`
                    } else if(dataComparedObj[elem][1] === 'string') {
                        dataConvertions += `        req.sanitizedData.${elem} = validation.data.${elem};\n`
                    } else if(dataComparedObj[elem][1] === 'string | null') {
                        dataConvertions += `        req.sanitizedData.${elem} = validation.data.${elem} === 'null' ? null : validation.data.${elem};\n`
                    } else if(dataComparedObj[elem][1] === 'boolean') {
                        dataConvertions += `        req.sanitizedData.${elem} = validation.data.${elem} === 'true' ? true : (validation.data.${elem} === 'false' ? false : null);\n`
                    }
                    
                    if(dataComparedObj[elem][0] !== dataComparedObj[elem][1]) isDataToConvert = true
                }
            })

            if(!isDataToConvert) return
            this.sanitizedMethods.push(fieldKey)

            const validationConst = fields 
                ? (
                    `    const validation = this.validateString${RouteName}.${fieldKey}(req.query);\n` +
                    `        if (!validation.success) return this.validationErr(res, validation.error);\n\n` +

                    `        // Initialize req.sanitizedData\n` +
                    `        req.sanitizedData = {};\n\n`
                ) : ''

            return (
                `    ${fieldKey} = (req, res, next) => {\n` +
                `    ${validationConst}` +
                    `${dataConvertions}\n` +
                `        next();\n` +
                `    }\n\n`
            )
        }).join('')

        return classBody
    }

    private generateMiddleware() {

        const RouteName = this.capitalizeFirstLetter(this.routeName)
        const methods = this.generateMethods()

        return (
            `import { createErrorResponse } from './../../global/utils/responses.js';\n` +
            `import { ${RouteName}StringValidation } from './${this.routeName}.validations.js';\n\n` +

            `class SanitizeGetRequests {\n\n` +

            `    constructor() {\n` +
            `        this.validateString${RouteName} = new ${RouteName}StringValidation();\n` +
            `    }\n\n` +
            
            `    validationErr(res, validationError) {\n` +
            `        return res.status(400).json(createErrorResponse({\n` +
            `            message: 'Validation data error',\n` +
            `            error: validationError.format()\n` +
            `        }));\n` +
            `    }\n\n` +

            `${methods}` +

            `}\n\n` +

            `export default SanitizeGetRequests;`
        )
    }

    async writeMiddlewareFile({ routeName, readFieldsPath, readTypesPath, writePath }: Arguments['writes']) {
        
        const fieldsContent = await this.methods.getJsonObject(readFieldsPath)
        const typesContent = await this.methods.getJsonObject(readTypesPath)

        if(fieldsContent && typesContent) {
            this.routeName = routeName
            
            this.fieldsContent = fieldsContent as Record<string, Fields>
            this.typesContent = typesContent as Record<string, string>

            const content = this.generateMiddleware()            

            await this.methods.writeContent(writePath, content)
            
            return this.sanitizedMethods
        }
    }
}
import { bold, italic, inverse, underline, bgGray, bgCyan, bgYellow } from 'kolorist'

type Mode = 'added' | 'changed'

export const COLORS = {
    title: (arg: string) => inverse(bold(arg)),
    subtitle: (arg: string) => bgGray(italic(bold(arg))),  
    clarification: (arg: string) => underline(italic(bold(arg))),  
    warnings: bgYellow(bold(' ⚠️ WARNING ')),  
    information: bgCyan(bold(' 🛈 INFO ')),  
}

export const LOGS = {
    ROUTE_CREATED: (route: string) => `${COLORS.information} New ${route.toUpperCase()} route created, proceed to add sql files\n`,
    ROUTE_DELETED: (route: string) => `${COLORS.information} Route ${route.toUpperCase()} deleted, all files related on server were removed\n`,
    ROUTE_INTEGRATED: (route: string) => `${COLORS.information} Route ${route.toUpperCase()} added to server entry point\n`,
    
    TYPES_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Types ${mode} for ${route.toUpperCase()} route on brage folder\n`,
    FIELDS_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Fields ${mode} for ${route.toUpperCase()} route on brage folder\n`,
    QUERIES_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Queries ${mode} for ${route.toUpperCase()} route on server folder\n`,
    MODEL_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Model ${mode} for ${route.toUpperCase()} route on server folder\n`,

    VALIDATIONS_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Validations ${mode} for ${route.toUpperCase()} route on server folder\n`,
    MIDDLEWARES_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Middlewares ${mode} for ${route.toUpperCase()} route on server folder\n`,
    CONTROLLERS_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Controllers ${mode} for ${route.toUpperCase()} route on server folder\n`, 
    ROUTERS_GENERATED: (route: string, mode: Mode) => `${COLORS.information} Router ${mode} for ${route.toUpperCase()} route on server folder\n`,
    
    WARNING_WRONGQUERY: (key: string, allowed: string) => `${COLORS.warnings} The query key ${key} does not start with some of the keys ${allowed}\n`,
    WARNING_WRONGFIELD: (key: string, field: string, routeName: string) => `${COLORS.warnings} ${COLORS.clarification(`[${routeName} route]`)} The field '${field}' on the query '${key}' does not exist on its table schema\n`,

    WARNING_MISSINGTYPES: (routeName: string) => `${COLORS.warnings} ${COLORS.clarification(`[${routeName} route]`)} missing table.sql file, create it before queries.sql\n`,
    WARNING_EMPTYTYPES: (routeName: string) => `${COLORS.warnings} ${COLORS.clarification(`[${routeName} route]`)} could not read any type on table.sql file, check the fields definition\n`,
    WARNING_MISSINGTABLE: (routeName: string) => `${COLORS.warnings} ${COLORS.clarification(`[${routeName} route]`)} could not read CREATE TABLE \`tableName\` (); pattern on table.sql, check the SQL format\n`,
    
    PROGRAM_STARTED: `\n${COLORS.title('                       \n')}${COLORS.title(' BRAGE JS HAS STARTED❕\n')}${COLORS.title('                       ')}`,
    LISTENING: `\n${COLORS.subtitle('                                          \n')}${COLORS.subtitle(' [Listening for changes on app folder] ✅ \n')}${COLORS.subtitle(underline('                                          '))}\n`,
}
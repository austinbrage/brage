import minimist from 'minimist'

type Options = { version?: string, v?: string, once: string, o: string }
type Returns = { version?: string, once: string }

const argv = minimist<Options>(process.argv.slice(2), { string: ['_'] })

export const flagArguments: Returns = {
    version: argv?.version || argv?.v,
    once: argv?.once || argv?.o
}
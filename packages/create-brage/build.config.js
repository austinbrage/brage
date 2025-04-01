import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: ['src/index'],
    clean: true,
    rollup: {
        output: {
            format: 'esm',
        },
    },
    esbuild: {
        target: 'node18',
        minify: true,
    },
})
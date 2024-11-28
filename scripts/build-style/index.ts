import { buildAllStyles } from './buildAllStyles'
import { CopyBaseOptions, runCopy } from './copy'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function build({ allStylesOutputFile, ...opts }: CopyBaseOptions & { allStylesOutputFile: string }) {
	return Promise.all([buildAllStyles(allStylesOutputFile), runCopy(opts)])
}

export { runCopy }

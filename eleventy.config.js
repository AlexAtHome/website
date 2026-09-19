export default function (config) {
	const inputDir = "views"
	config.setServerPassthroughCopyBehavior('passthrough')
	config.addPassthroughCopy(`./${inputDir}/assets`)
	config.addWatchTarget('_site/style.css')
	return {
		dir: {
			input: inputDir,
		},
	}
}

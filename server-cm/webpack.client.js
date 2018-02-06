const path = require('path')
const merge = require('webpack-merge');
const baseConfig = require("./webpack.base.js")

const config = {
	// removed the node target

	// changed the entry point
	entry: './src/client/client.js',

	// instead of 'build' directory, this is 'public'
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	}

}

module.exports = merge(baseConfig, config);
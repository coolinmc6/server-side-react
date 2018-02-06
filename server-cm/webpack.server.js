const path = require('path')
const merge = require('webpack-merge');
const baseConfig = require("./webpack.base.js");
const webpackNodeExternals = require('webpack-node-externals');

const config = {
	// Inform webpack that we're building a bundle for NodeJS rather
	// than for the browser
	target: 'node',

	// Tell webpack the root file of our server application => entry point
	entry: './src/index.js',

	// Tell webpack where to put the output file
	// - we are utilizing the path module here and thus must require it at the top of the file
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build')
	},

	externals: [webpackNodeExternals()]

}

module.exports = merge(baseConfig, config);
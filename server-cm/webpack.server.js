const path = require('path')

module.exports = {
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

	// Tell webpack to run babel on every file it runs through
	module: {
		rules: [
			{
				// this regex ensures we only use babel on JS files
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [
						'react',
						'stage-0', // this is going to be used for some async code

						// 'env' is a master pre-set; run all the different transform rules to 
						// to meet the requirements of the latest 2 versions of all popular browsers
						[ 'env', { targets: { browsers: [ 'last 2 versions']}}]
					]
				}
			}
		]
	}

}
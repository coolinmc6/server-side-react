const path = require('path')

module.exports = {
	// removed the node target

	// changed the entry point
	entry: './src/client/client.js',

	// instead of 'build' directory, this is 'public'
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
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
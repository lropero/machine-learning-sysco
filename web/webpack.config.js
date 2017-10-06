const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

module.exports = new function() {

	const config = {

		context: __dirname + '/src',
		entry: './app.js',
		output: {
			filename: 'bundle.js',
			path: __dirname + '/public'
		},

		module: {
			rules: [
				{
					test: /\.js$/,
					include: /src/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['env', 'react']
							}
						}
					]
				}
			]
		},

		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV.trim())
				}
			})
		]
	};

	const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : '';

	switch(env) {

		case 'analyze':
			config.plugins.push(
				new BundleAnalyzerPlugin()
			);
		break;

		case 'development':
			config.devtool = '#cheap-module-source-map';
		break;

		case 'production':
			config.plugins.push(
				new webpack.optimize.UglifyJsPlugin({
					output: {
						comments: false
					}
				})
			);
		break;
	}

	return config;
};

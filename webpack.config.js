var webpack = require('webpack');
var path = require('path');
var nodeModules = path.resolve(__dirname, 'node_modules');
var pathToAngular = path.resolve(nodeModules, 'angular/angular.min.js');

console.log(pathToAngular);

module.exports = {
    entry: "./src/index",
    output: {
        path: "./static",
        filename: "bundle.js"
    },
	module:{
		loaders: [
			{ test: /\.js$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components)/,
				query: {
				   presets: ['es2015']
				}
			},
		]
	},
    resolve: {
    }
};

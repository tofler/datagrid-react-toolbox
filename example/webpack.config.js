const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const reactToolboxVariables = require('./src/datagrid/variables.jsx');


let config = {
    entry: {
        index: './test.jsx',        
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        libraryTarget: 'umd',
        library: 'DataGridReactToolBox'
    },
    resolve: {
        modules: [
            '../node_modules'            
        ]
    },
    module: {
        rules: [{
            test: /\.css$/,            
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: debug,
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]__[local]___[hash:base64:5]',
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: debug,
                        sourceComments: debug,
                        plugins: function () {
                            return [
                                require('postcss-import'),
                                require('postcss-cssnext')({
                                    features: {
                                        customProperties: {},
                                        applyRule: {},
                                        calc: {},
                                        customMedia: {},
                                        colorFunction: {},
                                    },
                                }),
                                require('postcss-nested'),
                            ];
                        },
                    },
                }],
            }),        
        }, {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', { loose: true, modules: false }],
                        'react',
                        'stage-0',
                        'stage-1',
                    ]
                },
            }],
        }],
    },
    plugins: [        
        new ExtractTextPlugin({
            filename: 'datagrid.css',
            allChunks: true,
        }),
    ],
};
module.exports = config;

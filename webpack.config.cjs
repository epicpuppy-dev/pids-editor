const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

const plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    filename: 'index.html',
    force: true
  })
]

if (!devMode) {
  plugins.push(new MiniCssExtractPlugin());
}

const langs = {
  'en-us': 'src/lang/en_us.json',
  'zh-tw': 'src/lang/zh_tw.json'
}

const configs = [{
  //devtool: 'eval-source-map',
  name: 'default',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: path.resolve('script/localizationloader.cjs'),
          options: {
            langFile: 'src/lang/en_us.json',
          }
        }, 'html-loader']
      },
      {
        test: /\.ts(x)?$/,
        use: ['ts-loader', {
          loader: path.resolve('script/localizationloader.cjs'),
          options: {
            langFile: 'src/lang/en_us.json',
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  },

  plugins: plugins
}];

for (const lang in langs) {
  configs.push({
    //devtool: 'eval-source-map',
    name: lang,
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/' + lang),
      filename: 'bundle.js'
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [{
            loader: path.resolve('script/localizationloader.cjs'),
            options: {
              langFile: langs[lang],
            }
          }, 'html-loader']
        },
        {
          test: /\.ts(x)?$/,
          use: ['ts-loader', {
            loader: path.resolve('script/localizationloader.cjs'),
            options: {
              langFile: langs[lang],
            }
          }],
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.png$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ]
    },
  
    plugins: plugins
  });
};

module.exports = configs;
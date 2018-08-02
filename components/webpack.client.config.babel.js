/* eslint-disable import/no-extraneous-dependencies */
import path from 'upath';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const production = process.env.NODE_ENV === 'production';
const development = !production;

const srcDir = path.resolve(__dirname);
const distDir = path.resolve(__dirname, 'dist');
const publicPath = '/dist/';

const defaultCssLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
    importLoaders: 2,
    discardComments: true
  }
};

const moduleCssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 2,
    localIdentName: '[name]__[local]___[hash:base64:5]',
    discardComments: true
  }
};

const postCssLoader = {
  loader: 'postcss-loader'
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    outputStyle: production ? 'compressed' : 'expanded'
  }
};

const globalCssLoaderConfig = [
  defaultCssLoader,
  postCssLoader,
  sassLoader
];

const localCssLoaderConfig = [
  moduleCssLoader,
  postCssLoader,
  sassLoader
];

const plugins = [
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer()]
    }
  })
];

const devPlugins = development ? [

] : [];

const prodPlugins = production ? [

] : [];

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          'react',
          'stage-1',
          [
            'env',
            {
              modules: false,
              targets: {
                browsers: ['last 2 versions', 'safari >= 7', 'ie >= 10']
              },
              useBuiltIns: true
            }
          ]
        ],
        plugins: [
          'transform-class-properties',
          'transform-object-rest-spread',
          development ? 'transform-react-jsx-self' : null,
          development ? 'transform-react-jsx-source' : null,
          production ? 'transform-react-inline-elements' : null,
          production ? 'transform-react-constant-elements' : null
        ].filter(Boolean)
      }
    }
  },
  {
    test: /\.(jpe?g|png|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]'
        }
      }
    ]
  },
  {
    test: /\.(ttf|eot|svg|woff(2)?)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]'
        }
      }
    ]
  },
  // Use a CSS loader without modules support for the site.scss file which includes Bootstrap
  // Bootstrap doesn't play nice with CSS modules and it can't be imported globally, since that
  // clashes with a global import used within Bootstrap.
  {
    test: /\.(scss)$/,
    include: /styles[\\/]site\.scss$/i,
    exclude: /src[\\/]app[\\/].*\.scss$/i,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: globalCssLoaderConfig,
      publicPath
    })
  },
  // For any SASS file in /src/app, it's desirable to use CSS modules
  {
    test: /\.(scss)$/i,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: localCssLoaderConfig,
      publicPath
    })
  }
];

const devLoaders = development ? [] : [];

const prodLoaders = production ? [] : [];

export default {
  mode: production ? 'production' : 'development',
  devtool: development && 'cheap-module-source-map',
  entry: ['whatwg-fetch', path.resolve(srcDir, 'index.js')],
  output: {
    path: distDir,
    filename: production ? '[name].[hash:8].js' : '[name].js',
    chunkFilename: production ? '[name].[chunkhash:8].js' : '[name].js',
    publicPath
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        polyfill: {
          test: /[\\/]core-js/,
          name: 'polyfill',
          chunks: 'initial',
          enforce: true,
          priority: 10
        },
        vendors: {
          test: /[\\/]node_modules[\\/](?!core-js)/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
          priority: 20
        }
      }
    }
  },
  plugins: [...plugins, ...devPlugins, ...prodPlugins],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [...loaders, ...devLoaders, ...prodLoaders]
  },
  devServer: {
    historyApiFallback: true
  }
};

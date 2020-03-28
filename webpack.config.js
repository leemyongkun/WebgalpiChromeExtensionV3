const webpack = require("webpack");
const ejs = require("ejs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const { VueLoaderPlugin } = require("vue-loader");
const { version } = require("./package.json");

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + "/src",
  entry: {
    "contents/core/core": "./contents/core/core.js",
    "contents/core/hl-core": "./contents/core/hl-core.js",
    "contents/global/config": "./contents/global/config.js",
    "contents/global/url": "./contents/global/url.js",
    "contents/listener": "./contents/listener.js",
    "contents/form": "./contents/form.js",
    "contents/contents": "./contents/contents.js",
    "contents/application": "./contents/application.js",
    "contents/common": "./contents/common.js",
    "background/background": "./background/background.js",
    "background/listener": "./background/listener.js",
    "background/contextMenu": "./background/contextMenu.js",
    "popup/popup": "./popup/popup.js",
    "dashboard/dashboard": "./dashboard/dashboard.js",
    "options/options": "./options/options.js",
    "common/common": "./common/common.js",
    "css/hl": "./css/hl.css",
    "lib/jcrop/jcrop": "./lib/jcrop/jcrop.css"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".vue"]
  },
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require("sass"),
              indentedSyntax: true // optional
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loaders: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "/images/",
          emitFile: false
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "/fonts/",
          emitFile: false
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: "window"
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin([
      { from: "icons", to: "icons", ignore: ["icon.xcf"] },
      {
        from: "popup/popup.html",
        to: "popup/popup.html",
        transform: transformHtml
      },
      {
        from: "dashboard/dashboard.html",
        to: "dashboard/dashboard.html",
        transform: transformHtml
      },
      {
        from: "dashboard/lib/**",
        to: "./",
        transform: transformHtml
      },
      {
        from: "dashboard/common/**",
        to: "./",
        transform: transformHtml
      },
      {
        from: "options/options.html",
        to: "options/options.html",
        transform: transformHtml
      },
      {
        from: "manifest.json",
        to: "manifest.json",
        transform: content => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          //if (config.mode === "development") {
          jsonContent["content_security_policy"] =
            "script-src 'self' 'unsafe-eval'; object-src 'self'";
          //}

          return JSON.stringify(jsonContent, null, 2);
        }
      }
    ])
  ],
  performance: {
    maxEntrypointSize: 4000000,
    maxAssetSize: 10000000
  }
};

if (config.mode === "production") {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    })
  ]);
}

if (process.env.HMR === "true") {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: __dirname + "/src/manifest.json"
    })
  ]);
}

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env
  });
}

module.exports = config;

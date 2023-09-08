const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
        "service-worker": path.resolve(__dirname, "..", "src", "service-worker.ts"),
        "popup": path.resolve(__dirname, "..", "src", "popup.ts"),
        "content-script": path.resolve(__dirname, "..", "src", "content-script.ts"),
        "settings": path.resolve(__dirname, "..", "src", "settings.ts"),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        // copy the contents of /public into the build folder
        new CopyWebpackPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};
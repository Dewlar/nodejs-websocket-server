import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  entry: './index.ts',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  externals: [nodeExternals()]
};

export default config;

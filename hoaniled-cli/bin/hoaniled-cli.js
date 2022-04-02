import esm from 'esm';
import { cli } from '../src/cli.js';

// require = esm(module /*, options */);
cli(process.argv);
/// <reference types="vite/client" />

// Left in the package for the product's bundler to replace, so a development warning drops out of its build.
declare const process: { env: { NODE_ENV?: string } };

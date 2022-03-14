Altitude FE Project
==================================

Below you will find some information on how to perform common tasks.<br>

## Table of Contents

- [Folder Structure](#folder-structure)
- [Adding Custom Environment Variables](#adding-custom-environment-variables)
  * [Referencing Environment Variables in the HTML](#referencing-environment-variables-in-the-html)
  * [Adding Development Environment Variables In `.env`](#adding-development-environment-variables-in--env-)
    + [What other `.env` files can be used?](#what-other--env--files-can-be-used-)
    + [Expanding Environment Variables In `.env`](#expanding-environment-variables-in--env-)
- [How to change Altitude labels?](#how-to-change-altitude-labels-)
- [Available Scripts](#available-scripts)
  * [`npm start`](#-npm-start-)
  * [`npm test`](#-npm-test-)
  * [`npm run build`](#-npm-run-build-)
- [Advanced Configuration](#advanced-configuration)

## Folder Structure

```
.
├── config
│   ├── env.js
│   ├── jest
│   │   └── ...
│   ├── paths.js
│   ├── polyfills.js
│   ├── webpack.config.dev.js
│   ├── webpack.config.prod.js
│   └── webpackDevServer.config.js
├── public
│   ├── index.html
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── src
│   ├── components
│   │   └── ...
│   ├── containers
│   │   └── ...
│   ├── locales
│   │   └── en
│   │       ├── common.json
│   │       └── fedex.json
│   ├── utils
│   │   ├── API.js
│   │   └── storage.js
│   ├── i18n.js
│   └── index.js
├── README.md
├── package.json
└── yarn.lock
```

**config**  
Where all the configuration for the deployments live.

**public**
Here you can find the `index.html` and all the static resources for the template (_like favicon_).

**scripts**
For `npm` [start|test|build]

**src**
Where the Altitude APP lives.
  - **components**
  - **containers**
    - For more information you can read about [smart and dumb components philosophy](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
  - **locales** : All the translation information and with `common.json` and `$carrier.json` (_for now we have `fedex.json` only_).
  - **utils**
    - **API.js** : This is an [axios](https://github.com/axios/axios) instance with base API URL
    - **storage.json** : A simple Web API wrapper for Storage (_session/local_).
  - **i18n.js** : This is the initialization for i18n that makes the translations possible. Currently is a static implementation that merge `common.js` with `$carrier.json` from `locales`.
  - **index.js** : Altitude entry point

## Adding Custom Environment Variables

This project can consume variables declared in your environment as if they were declared locally in JS files. By
default you will have `NODE_ENV` defined for you, and any other environment variables starting with
`ALTITUDE_`.

**The environment variables are embedded during the build time**.

Having an environment variable named `ALTITUDE_VAR` will be exposed in JS as `process.env.ALTITUDE_VAR`.

### Referencing Environment Variables in the HTML

You can also access the environment variables starting with `ALTITUDE_` in the `public/index.html`. For example:

```html
<title>%ALTITUDE_WEBSITE_NAME%</title>
```

### Adding Development Environment Variables In `.env`

To define permanent environment variables, create a file called `.env` in the root of your project:

```
ALTITUDE_SECRET_CODE=abcdef
```

`.env` files **should be** checked into source control (with the exclusion of `.env*.local`).

#### What other `.env` files can be used?

* `.env`: Default.
* `.env.local`: Local overrides. **This file is loaded for all environments except test.**
* `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
* `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

* `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
* `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
* `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

#### Expanding Environment Variables In `.env`

Expand variables already on your machine for use in your `.env` file (using [dotenv-expand](https://github.com/motdotla/dotenv-expand)).

For example, to get the environment variable `npm_package_version`:

```
ALTITUDE_VERSION=$npm_package_version
# also works:
# ALTITUDE_VERSION=${npm_package_version}
```

Or expand variables local to the current `.env` file:

```
DOMAIN=www.example.com
ALTITUDE_FOO=$DOMAIN/foo
ALTITUDE_BAR=$DOMAIN/bar
```

## How to change Altitude labels?
Currently, our language is `english` and the labels are from `fedex` as **default**. This is _static at build_, to change this behaviour we have two **environment variables:

```
ALTITUDE_LANGUAGE=en
ALTITUDE_LABELS=fedex
```

You can change to other language or labels with the instructions at [`adding Custom Environment Variables`](#adding-custom-environment-variables)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
The ALTITUDE app is ready to be deployed!

## Advanced Configuration

You can adjust various development and production settings by setting environment variables in your shell or with [.env](#adding-development-environment-variables-in-env).

Variable | Development | Production | Usage
:--- | :---: | :---: | :---
BROWSER | :white_check_mark: | :x: | By default, Altitude APP will open the default system browser, favoring Chrome on macOS. Specify a [browser](https://github.com/sindresorhus/opn#app) to override this behavior, or set it to `none` to disable it completely. 
HOST | :white_check_mark: | :x: | By default, the development web server binds to `localhost`. You may use this variable to specify a different host.
PORT | :white_check_mark: | :x: | By default, the development web server will attempt to listen on port 3000 or prompt you to attempt the next available port. You may use this variable to specify a different port.
HTTPS | :white_check_mark: | :x: | When set to `true`, Altitude APP will run the development server in `https` mode.
PUBLIC_URL | :x: | :white_check_mark: | Altitude APP assumes the application is hosted at the serving web server's root or a subpath as specified in `package.json` (`homepage`). You may use this variable to force assets to be referenced verbatim to the url you provide (hostname included). This may be particularly useful when using a CDN.
CI | :large_orange_diamond: | :white_check_mark: | When set to `true`, Altitude APP treats warnings as failures in the build. It also makes the test runner non-watching. Most CIs set this flag by default.
REACT_EDITOR | :white_check_mark: | :x: | When an app crashes in development, you will see an error overlay with clickable stack trace. When you click on it, Altitude APP will try to determine the editor you are using based on currently running processes, and open the relevant source file. Setting this environment variable overrides the automatic detection. If you do it, make sure your systems [PATH](https://en.wikipedia.org/wiki/PATH_(variable)) environment variable points to your editor’s bin folder. You can also set it to `none` to disable it completely.
CHOKIDAR_USEPOLLING | :white_check_mark: | :x: | When set to `true`, the watcher runs in polling mode, as necessary inside a VM. Use this option if `npm start` isn't detecting changes.
GENERATE_SOURCEMAP | :x: | :white_check_mark: | When set to `false`, source maps are not generated for a production build. This solves OOM issues on some smaller machines.
NODE_PATH | :white_check_mark: |  :white_check_mark: | Same as [`NODE_PATH` in Node.js](https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders), but only relative folders are allowed. Can be handy for emulating a monorepo setup by setting `NODE_PATH=src`.

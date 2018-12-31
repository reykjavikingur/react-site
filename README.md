# react-site

Starter kit for a React full-stack web site.


## How It Works

When started, it compiles the browser-side and server-side JSX.
The server-side app runs a Koa server using React rendering to produce the HTML containers and metadata.
The browser-side app is a front-end interactive interface.


## Setup

* clone repo
* `npm install`
* `npm start`


## Environment Variables

* `PORT` - vary the port that the server runs on (default: `4020`)
* `NODE_ENV` - whether to run in "production" mode (default: "development")

### Development Mode

The default mode is development, where the Browser-sync will proxy the server,
watch files for changes, and automatically restart process and live-reload in browser.

### Production Mode

Set environment variable `NODE_ENV` to "production" to run in production mode,
in which case it will not launch Browser-sync, watch files, or live-reload in browser.


## Features

* compile jsx for server and browser
* live-reload
* sass
* webpack within gulp
* koa web server


## References

https://webpack.js.org/api/node/


# Roadmap

* database
* user login with passport
* randomized text and images
* carbon design system supporting react
* test various kinds of error handling (front-end js, back-end js, sass)
* js sourcemaps and debugging support
* automated testing
* react browser router


## Eventual Setup Process

* clone repo
* `npm install`
* create db on mlab
* configure db connection string
* create user with CLI
* `npm start`
* log in via `/admin`
* enter site metadata, including title (text), description (html)
* deploy to remote server


## Eventual Code/Data Management Scheme

* Environments: DEV, QA, PROD
* Code will start at DEV, then go to QA, then to PROD
* Data will start at QA, then go to DEV and to PROD


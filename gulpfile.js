const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const webpack = require('webpack');
const nodemon = require('nodemon');
const browserSync = require('browser-sync');
const nodeExternals = require('webpack-node-externals');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const DEFAULT_PORT = 4020;

const PROD = (process.env.NODE_ENV === 'production');

const compiler = webpack([
	{
		mode: PROD ? 'production' : 'development',
		entry: './src/scripts/main.js',
		output: {
			path: path.resolve(__dirname, 'dist/scripts'),
			filename: 'main.js',
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.(js)$/,
					use: 'babel-loader',
				}
			],
		},
	},
	{
		mode: PROD ? 'production' : 'development',
		entry: './src/server/index.js',
		target: 'node',
		externals: [nodeExternals()],
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'server.js',
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.(js)$/,
					use: 'babel-loader',
				}
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				$dirname: '__dirname',
				$defaultPort: DEFAULT_PORT,
			}),
		],
	}
]);

gulp.task('start', [PROD ? 'serve:prod' : 'serve:dev']);

gulp.task('postinstall', PROD ? ['build'] : []);

gulp.task('serve:prod', [], () => {
	require('./dist/server');
});

gulp.task('serve:dev', ['watch'], () => {
	const bs = () => {
		const port = parseInt(process.env.PORT) || DEFAULT_PORT;
		const delay = 250; // time in milliseconds between server start/restart and browser-sync start/reload
		const name = 'bs';
		setTimeout(() => {
			if (browserSync.has(name)) {
				browserSync.get(name).reload();
			}
			else {
				browserSync.create(name).init({
					proxy: `http://localhost:${port}`,
					files: [
						'dist/scripts/*.js',
						'dist/static/**/*',
						'dist/styles/*.css',
					],
					ghostMode: false,
				});
			}
		}, delay);
	};
	let listening = false;
	nodemon({
		script: 'dist/server.js',
		watch: 'dist/server.js',
		ext: 'js json',
		stdout: false,
	})
		.on('restart', (files) => {
			listening = false;
			console.log('nodemon - restarting due to changes in files');
			for (let file of files) {
				console.log(file);
			}
		})
		.on('start', () => {
			listening = false;
			console.log('nodemon - starting');
		})
		.on('stdout', (stdout) => {
			if (!listening) {
				console.log('nodemon - listening');
				bs();
				listening = true; // if it was not listening before, now on stdout, it is
			}
			process.stdout.write(stdout);
		})
		.on('quit', () => {
			console.log('nodemon - quit');
			process.exit();
		})
	;
});

gulp.task('clean', [], (done) => {
	rimraf(path.resolve(__dirname, 'dist'), done);
});

gulp.task('build', [], (done) => {
	runSequence('clean', 'build:all', done);
});

gulp.task('watch', ['watch:all']);

const types = ['static', 'styles', 'js'];

gulp.task('build:all', types.map(type => `build:${type}`));

gulp.task('watch:all', types.map(type => `watch:${type}`));

gulp.task('build:static', [], () => {
	return gulp.src('src/static/**/*')
		.pipe(gulp.dest('dist/static'));
});

gulp.task('watch:static', ['build:static'], () => {
	gulp.watch('src/static/**/*', ['build:static']);
});

gulp.task('build:js', [], (done) => {
	compiler.run((err, stats) => {
		var hasError = parseCompilationErrors(err, stats);
		if (hasError) {
			done(new Error('compilation failed'));
		}
		else {
			done();
		}
	});
});

gulp.task('watch:js', ['build:js'], () => {
	compiler.watch({}, (err, stats) => {
		parseCompilationErrors(err, stats);
	});
});

gulp.task('build:styles', [], () => {

	return gulp.src('src/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // valid values: nested, expanded, compact, compressed
		}).on('error', handleError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/styles'))
		;

	function handleError(err) {
		sass.logError.call(this, err);
		this.emit('end');
	}
});

gulp.task('watch:styles', ['build:styles'], () => {
	gulp.watch('src/styles/**/*.scss', ['build:styles']);
});

function parseCompilationErrors(err, stats) {
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		return true;
	}
	else {
		const info = stats.toJson();

		if (stats.hasErrors()) {
			for (let error of info.errors) {
				console.error(error);
			}
			return true;
		}
		else {
			if (stats.hasWarnings()) {
				for (let warning of info.warnings) {
					console.warn(warning);
				}
			}
			return false;
		}
	}
}

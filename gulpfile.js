// ==========================================================================
// Gulp build script
// ==========================================================================
/* global require, __dirname */
/* eslint no-console: "off" */

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
// ------------------------------------
// JavaScript
// ------------------------------------
const terser = require('gulp-terser');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
// ------------------------------------
// CSS
// ------------------------------------
const sass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefix = require('gulp-autoprefixer');
// ------------------------------------
// Images
// ------------------------------------
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
// ------------------------------------
// Utils
// ------------------------------------
const del = require('del');
const filter = require('gulp-filter');
const header = require('gulp-header');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const gulpIf = require('gulp-if');
// ------------------------------------
// Configs
// ------------------------------------
const pkg = require('./package.json');
const build = require('./build.json');
const environment = require('./environment.json');
const endPoint = environment[env];

// ------------------------------------
// Info from package
// ------------------------------------
const { browserslist: browsers } = pkg;
const minSuffix = '.min';

// Paths
const paths = {
  uiza: {
    // Source paths
    src: {
      sass: path.join(__dirname, 'src/sass/**/*.scss'),
      js: path.join(__dirname, 'src/js/**/*.js'),
      sprite: path.join(__dirname, 'src/sprite/*.svg'),
    },

    // Output paths
    output: path.join(__dirname, 'dist/'),
  },
  demo: {
    // Source paths
    src: {
      sass: path.join(__dirname, 'demo/src/sass/**/*.scss'),
      js: path.join(__dirname, 'demo/src/js/**/*.js'),
      html: path.join(__dirname, 'demo/*.html'),
    },

    // Output paths
    output: path.join(__dirname, 'dist/'),

    // Demo
    root: path.join(__dirname, 'demo/'),
  },
  upload: [path.join(__dirname, `dist/*${minSuffix}.*`), path.join(__dirname, 'dist/*.css'), path.join(__dirname, 'dist/*.svg')],
};

// Task arrays
const tasks = {
  css: [],
  js: [],
  sprite: [],
  clean: 'clean',
  demo: [],
  static: [],
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Copy static libs & media
Object.entries(build.static).forEach(([filename, entry]) => {
  const { dist, src } = entry;
  const name = `static:${filename}`;
  tasks.static.push(name);

  gulp.task(name, () => {
    return gulp.src(src).pipe(gulp.dest(dist));
  });
});

// Copy demo libs & media
Object.entries(build.demo).forEach(([filename, entry]) => {
  const { dist, src } = entry;
  const name = `demo:${filename}`;
  tasks.demo.push(name);

  gulp.task(name, () => {
    return gulp.src(src).pipe(gulp.dest(dist));
  });
});

// Clean out /dist
gulp.task(tasks.clean, done => {
  const dirs = [paths.uiza.output, paths.demo.output].map(dir => path.join(dir, '**/*'));
  del(dirs);
  done();
});

// JavaScript
Object.entries(build.js).forEach(([filename, entry]) => {
  const { formats, namespace, polyfill, src } = entry;
  const dist = env === 'staging' ? `${entry.dist}/${version}` : entry.dist;

  formats.forEach(format => {
    const name = `js:${filename}:${format}`;
    const extension = format === 'es' ? 'mjs' : 'js';
    tasks.js.push(name);

    gulp.task(name, () =>
      gulp
        .src(src)
        .pipe(plumber())
        .pipe(gulpIf(env !== 'production', sourcemaps.init()))
        .pipe(
          rollup(
            {
              plugins: [
                resolve(),
                commonjs(),
                json(),
                babel({
                  presets: [
                    [
                      '@babel/env',
                      {
                        // debug: true,
                        useBuiltIns: polyfill ? 'usage' : false,
                        corejs: polyfill ? 3 : undefined,
                      },
                    ],
                  ],
                  babelrc: false,
                  exclude: [/\/core-js\//],
                }),
              ],
            },
            {
              name: namespace,
              format,
            },
          ),
        )
        .pipe(header('typeof navigator === "object" && ')) // "Support" SSR (#935)
        .pipe(
          rename({
            extname: `.${extension}`,
          }),
        )
        .pipe(replace('__ENVIRONMENT__', env))
        .pipe(replace('__UIZA_EMBED_API__', endPoint.embed))
        .pipe(replace('__API_ANALYTIC_POST__', endPoint.analytic))
        .pipe(replace('__API_ANALYTIC_GET__', endPoint.liveViewers))
        .pipe(gulp.dest(dist))
        .pipe(filter(`**/*.${extension}`))
        .pipe(terser())
        .pipe(rename({ suffix: minSuffix }))
        .pipe(size(sizeOptions))
        .pipe(gulpIf(env !== 'production', sourcemaps.write('')))
        .pipe(gulp.dest(dist)),
    );
  });
});

// CSS
Object.entries(build.css).forEach(([filename, entry]) => {
  const { src } = entry;
  const dist = env === 'staging' ? `${entry.dist}/${version}` : entry.dist;
  const name = `css:${filename}`;
  tasks.css.push(name);

  gulp.task(name, () =>
    gulp
      .src(src)
      .pipe(plumber())
      .pipe(sass())
      .pipe(
        prefix(browsers, {
          cascade: false,
        }),
      )
      .pipe(clean())
      .pipe(size(sizeOptions))
      .pipe(gulp.dest(dist)),
  );
});

// SVG Sprites
Object.entries(build.sprite).forEach(([filename, entry]) => {
  const { src } = entry;
  const dist = env === 'staging' ? `${entry.dist}/${version}` : entry.dist;
  const name = `sprite:${filename}`;
  tasks.sprite.push(name);

  gulp.task(name, () =>
    gulp
      .src(src)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(svgstore())
      .pipe(rename({ basename: path.parse(filename).name }))
      .pipe(size(sizeOptions))
      .pipe(gulp.dest(dist)),
  );
});

// Build all JS
gulp.task('js', () => gulp.parallel(...tasks.js));

// Watch for file changes
gulp.task('watch', () => {
  // Uiza core
  gulp.watch(paths.uiza.src.js, gulp.parallel(...tasks.js));
  gulp.watch(paths.uiza.src.sass, gulp.parallel(...tasks.css));
  gulp.watch(paths.uiza.src.sprite, gulp.parallel(...tasks.sprite));

  // Demo
  gulp.watch(paths.demo.src.js, gulp.parallel(...tasks.js));
  gulp.watch(paths.demo.src.sass, gulp.parallel(...tasks.css));
  gulp.watch(paths.demo.src.html, gulp.parallel(...tasks.demo));
});

// Build distribution
gulp.task('build', gulp.series(tasks.clean, gulp.parallel(...tasks.static, ...tasks.js, ...tasks.css, ...tasks.sprite)));

// Default gulp task
gulp.task('default', gulp.series('build', 'watch'));

// Do everything
gulp.task(gulp.series(tasks.clean, gulp.parallel(...tasks.js, ...tasks.css, ...tasks.sprite, ...tasks.demo)));

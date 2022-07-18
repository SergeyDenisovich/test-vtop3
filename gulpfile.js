const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const webp = require('gulp-webp');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const browserSync = require('browser-sync').create();

// Task for styles
function styles() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write())
    .pipe(cleanCss({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

// Task for scripts
function scripts() {
  return gulp
    .src('./src/js/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('main.js'))
    .pipe(uglify({ toplevel: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

// Task for images
function imageCompress() {
  return gulp
    .src('./src/images/**/*.{gif,png,jpg,svg,webp}')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(webp())
    .pipe(gulp.dest('./build/images/'));
}

// task for fonts
function ttf2woff2Converter() {
  return gulp.src('./src/fonts/**/*.ttf').pipe(ttf2woff2()).pipe(gulp.dest('./build/fonts/'));
}

function ttf2woffConverter() {
  return gulp.src('./src/fonts/**/*.ttf').pipe(ttf2woff()).pipe(gulp.dest('./build/fonts/'));
}

function otf2ttf() {
  return gulp
    .src('./src/fonts/**/*.otf')
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(gulp.dest('./src/fonts/'));
}

const fontsConvert = gulp.series(otf2ttf, ttf2woff2Converter, ttf2woffConverter);

// clean build folder
function clean() {
  return del(['./build/*']);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/images/**/.{gif,png,jpg,svg,webp}', imageCompress);
  gulp.watch('./src/fonts/**/*.*', fontsConvert);
  gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('fontsConvert', fontsConvert);

// build files
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, imageCompress, fontsConvert)));
// dev
gulp.task('dev', gulp.series('build', 'watch'));

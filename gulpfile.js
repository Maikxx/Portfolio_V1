const gulp = require('gulp');

const browserSync = require('browser-sync').create(),
    reloadBrowser = browserSync.reload;

const plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    minifyImage = require('gulp-imagemin'),
    rename = require('gulp-rename');

const sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-cssnano');

const babel = require('gulp-babel'),
    minifyJS = require('gulp-uglify');

let assetsDir = './src';
let distDir = './dist';

gulp.task('ppHTML', () => {
    return gulp.src(`${assetsDir}/index.html`)
        .pipe(plumber())
        .pipe(gulp.dest(distDir))
});

gulp.task('ppPHP', () => {
    return gulp.src(`${assetsDir}/php/mail.inc.php`)
        .pipe(plumber())
        .pipe(gulp.dest(`${distDir}/php`))
});

gulp.task('ppCSS', () => {
    return gulp.src(`${assetsDir}/css/main.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(rename('compiled.css'))
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(minifyCSS({
            zindex: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(`${distDir}/css`));
});

gulp.task('ppJS', () => {
    return gulp.src(`${assetsDir}/js/index.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('compiled.js'))
        .pipe(gulp.dest(`${distDir}/js`))
        .pipe(minifyJS())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(`${distDir}/js`));
});

gulp.task('sync', ['ppHTML', 'ppPHP', 'ppCSS', 'ppJS'], () => {
    browserSync.init({
        proxy: 'maikelvanveen.local:8080'
    });

    gulp.watch(`${assetsDir}/*.html`, ['ppHTML']);
    gulp.watch(`${distDir}/*.html`).on('change', reloadBrowser);

    gulp.watch(`${assetsDir}/php/*.php`, ['ppPHP']);
    gulp.watch(`${distDir}/php/*.php`).on('change', reloadBrowser);

    gulp.watch(`${assetsDir}/**/*.scss`, ['ppCSS']);
    gulp.watch(`${distDir}/css/**/*.css`).on('change', reloadBrowser);

    gulp.watch(`${assetsDir}/js/index.js`, ['ppJS']);
    gulp.watch(`${distDir}/**/*.js`).on('change', reloadBrowser);
});

gulp.task('cleanImages', () => {
    gulp.src(`${distDir}/img`)
        .pipe(clean())
});

gulp.task('ppImages', () => {
    gulp.src(`${assetsDir}/img/**/*`, {
            base: `${assetsDir}/img/`
        })
        .pipe(minifyImage())
        .pipe(gulp.dest(`${distDir}/img`));
});

gulp.task('cleanProjects', () => {
    gulp.src(`${distDir}/projects`)
        .pipe(clean())
});

gulp.task('copyProjects', () => {
    gulp.src([
            '../maikelvanveen_old/**/*',
            '../business_template/**/*',
            '../watch_and_code/**/*'
        ], {
            base: '../'
        })
        .pipe(gulp.dest(`${distDir}/projects`));
});

gulp.task('cleanDist', () => {
    gulp.src(`${distDir}`)
        .pipe(clean())
});

gulp.task('buildDist', ['ppHTML', 'ppCSS', 'ppJS', 'ppImages', 'copyProjects'], () => {
    console.log('Done');
});
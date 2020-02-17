const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const del = require('del');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const styleFiles = [
    './src/style/owl.carousel.css',
    './src/style/main.scss',
    './src/style/_reset.scss',
    './src/style/_variables.scss',
    './src/style/_fonts.scss',
    './src/style/_mixins.scss',
    './src/style/_core.scss'
];

const jsFiles = [
    './src/js/owl.carousel.js',
    './src/js/lib.js',
    './src/js/main.js'
];

// Style task
gulp.task('css', () => {
    return gulp.src(styleFiles)
    .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpConcat('style.css'))
        .pipe(cleanCSS({
            level: 2
        }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});
// JavaScript task
gulp.task('js', () => {
    return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
        .pipe(gulpConcat('main.js'))
        .pipe(uglify({
            toplevel: true
        }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
// Del task
gulp.task('del', () => {
    return del(['build/*'])
});
// Img compress task
gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
        .pipe(imagemin({
            progressive: true
        }))
    .pipe(gulp.dest('./build/img'))
})
// Watch task
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress'))
    gulp.watch('./src/style/**/*.scss', gulp.series('css'))
    gulp.watch('./src/style/**/*.css', gulp.series('css'))
    gulp.watch('./src/js/**/*.js', gulp.series('js'))
    gulp.watch("./*.html").on('change', browserSync.reload);
});
// Default task
gulp.task('default', gulp.series('del', gulp.parallel('css', 'js', 'img-compress'), 'watch'));
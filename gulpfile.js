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
    './src/style/main.scss',
    './src/style/partials/colors.scss'
];

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];


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

gulp.task('del', () => {
    return del(['build/*'])
});

gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
        .pipe(imagemin({
            progressive: true
        }))
    .pipe(gulp.dest('./build/img'))
})

gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress'))
    gulp.watch('./src/style/**/*.scss', gulp.series('css'))
    gulp.watch('./src/js/**/*.js', gulp.series('js'))
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', gulp.series('del', gulp.parallel('css', 'js', 'img-compress'), 'watch'));
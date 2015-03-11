var gulp = require('gulp'),
    path = require('path'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

// Server

gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('demo/*.html')
        .pipe(connect.reload());
});

// Work with JS

gulp.task('min-js', function() {
    gulp.src('src/*.js')
        .pipe(concat('jquery.fantlab.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['min-js']);

gulp.task('watch', ['connect'], function () {
    gulp.watch(['demo/*.html'], ['html']);
    gulp.watch('src/*.js', ['default'])
});
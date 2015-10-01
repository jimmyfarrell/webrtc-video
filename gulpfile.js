var gulp = require('gulp');
var run = require('gulp-run');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var runSeq = require('run-sequence');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');

// Live reload
gulp.task('reload', function() {
    livereload.reload();
});

// Default
gulp.task('default', function() {
    livereload.listen();

    // Reload when a template (.html) file changes.
    gulp.watch(['client/**/*.html', 'server/*.html'], ['reload']);

    gulp.watch(['server/**/*.js'], ['testServerJS']);

});

// Database seed
gulp.task('seedDB', function() {
    run('node seed.js').exec();
});

// Testing
gulp.task('testServerJS', function() {
    return gulp.src('./server/**/*.spec.js', {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }));
});
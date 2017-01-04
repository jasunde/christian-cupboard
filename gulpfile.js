var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    bs = require('browser-sync').create(),
    karma = require('gulp-karma-runner'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass')
    sourcemaps = require('gulp-sourcemaps')

gulp.task('browserSync', function () {
  bs.init(null, {
    notify: false,
    proxy: 'http://localhost:3000',
    port: 5000,
    ui: {
      port: 5001
    }
  })
})

gulp.task('nodemon', ['browserSync'], function () {
  return nodemon({
    script: 'server/app.js',
    ext: 'html js',
    ignore: 'gulpfile.js'
  }).on('start', function () {
    setTimeout(function () {
      bs.reload()
    }, 1000)
  })
})

gulp.task('sass', function () {
  return gulp.src('public/styles/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/styles/'))
    .pipe(bs.stream())
})

gulp.task('test', function () {
  gulp.src([
    'public/app/**/*.js',
    'spec/**/*.js'
  ], {read: false})
    .pipe(karma.server({
      singleRun: true,
      frameworks: ['jasmine'],
      browsers: ['Chrome']
    }))
})
gulp.task('sass:watch', ['sass'], function () {
  gulp.watch('public/styles/sass/**/*.scss', ['sass'])
})

gulp.task('default', ['nodemon', 'sass:watch'])

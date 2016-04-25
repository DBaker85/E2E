var gulp                  = require('gulp');
var server                = require('gulp-express');
var fs                    = require('fs-extra');
var open                  = require('gulp-open');
var gulpProtractorAngular = require('gulp-angular-protractor');
var argv                  = require('yargs').argv;
var nodemon               = require('gulp-nodemon');
var sass                  = require('gulp-sass');
var postcss               = require('gulp-postcss');
var autoprefixer          = require('autoprefixer');
var cssnano               = require('cssnano');
var uglify                = require('gulp-uglify');
var concat                = require('gulp-concat');

gulp.task('sass', function () {
  var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano(),
  ];
  return gulp.src('./app/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./app/Front/css'));
});

gulp.task('js', function() {
  return gulp.src('./app/js/*.js')
    .pipe(concat('customActions.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/Front/js/'));
});


gulp.task('server', function () {
    server.run(['app.js']);
});

gulp.task('openhost', function () {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3030'
        }));
});

gulp.task('default', ['sass','js','server'], function () {
    gulp.run('openhost');
    gulp.watch(['app.js'], [server.run]);
});

gulp.task('protractor', function(cb){
    gulp
      .src(['./app/testcases/'+argv.program+'/*.js'])
      .pipe(gulpProtractorAngular({
         'configFile': './app/config/config.js',
          'debug': false,
          'autoStartStopServer': true,
          'isVerbose': true,
          'args': ['--params.id', argv.id, '--params.program', argv.program, '--params.angular', argv.angular]
      }))
      .on('error', cb)
      .on('end', cb)
})

gulp.task('dev', ['sass','js'], function () {
  nodemon({ script: 'app.js'
          , ext: 'pug js scss'
          , ignore: ['app/Front/css/**', 'app/Front/js/**']
          , tasks: ['sass','js']
    })
    .on('restart', function () {
      console.log('restarted!')
    })
})

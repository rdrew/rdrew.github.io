//@format
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var yaml = require('js-yaml');
var fs = require('fs');

var {
  COMPATIBILITY,
  PORT,
  PROXY,
  LOCALPROXY,
  THEMENAME,
  UNCSS_OPTIONS,
  PATHS,
} = loadConfig();
function loadConfig() {
  var ymlFile = fs.readFileSync('../config.yml', 'utf8');
  return yaml.load(ymlFile);
}
var themePath = '..';
//

function sass() {
  return gulp
    .src(themePath + '/' + PATHS.ScssDir + '/' + PATHS.ScssFileName)
    .pipe(
      $.sass({
        includePaths: themePath + '/' + PATHS.ScssLibraries,
        outputStyle: 'compressed', // if css compressed **file size**
      }).on('error', $.sass.logError),
    )
    .pipe($.postcss([autoprefixer({browsers: ['last 2 versions', 'ie >= 9']})]))
    .pipe(gulp.dest(themePath + PATHS.CssFileDir))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    //server: './',
    proxy: '127.0.0.1',
    port: '8888',
  });

  gulp.watch(themePath + '/' + PATHS.ScssDir + '/*.scss', sass);
}

gulp.task('sass', sass);
gulp.task('serve', gulp.series('sass', serve));
gulp.task('default', gulp.series('sass', serve));

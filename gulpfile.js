
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var child_process = Promise.promisifyAll(require('child_process'))
var browserSync = require('browser-sync').create();
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');

var cheerio = require('cheerio');
var walk = require('walk')

gulp.task('ts-clean',function(){
	return gulp.src('dist/*', {read: false})
		.pipe(clean());
})

gulp.task('laya-build', ['ts-clean'], function(){
	return gulp.src('laya/libs/*.js')
		.pipe(gulp.dest('dist/libs'))
})

gulp.task('ts-3rd',function(){
	return child_process.execAsync('typings install')
})

gulp.task('ts-build', ['laya-build','ts-3rd'], function(){
	var tsProject = ts.createProject('tsconfig.json');
	tsProject.sortOutput = true;
	return tsProject
		.src()
		.pipe(ts(tsProject))
		.js
		.pipe(gulp.dest('dist'))
})

gulp.task('cp-res',['ts-build'],function(){
	return gulp.src('res/*')
		.pipe(gulp.dest('dist'))
})

gulp.task('ts-merge-js-debug', ['cp-res'], function(){
	$ = cheerio.load(fs.readFileSync('template/index.html'))
	var layas = ['core','webgl','html','plugins','ani','filters','particle','ui'];
	layas.forEach(function(elem){
		$('body').append('<script src="libs/laya.' + elem + '.js" language="JavaScript"></script>\n')
	})
	walk.walkSync('dist/src',{ listeners:{ file: function (root, fileStats, next) {
		var jspath = path.relative( 'dist/src' , path.join(root,fileStats.name) ).replace(/\\/g,'/');
		if( jspath !== 'app.js' ) {
			$('body').append('<script src="src/' + jspath + '" language="JavaScript"></script>\n');
		}
		next();
	}}});
	$('body').append('<script src="src/app.js" language="JavaScript"></script>\n');
	fs.writeFileSync('dist/index.html',$.html())
})

gulp.task('ts-debug-reload',['ts-merge-js-debug'],function(){
	browserSync.reload();
})

gulp.task('debug', ['ts-merge-js-debug'], function() {
	browserSync.init({
		server: "dist"
	});
	return gulp.watch('src/*.ts',['ts-debug-reload'])
})


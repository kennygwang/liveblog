var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
// var uglify = require('gulp-uglify');

// Define paths.
var path = {
	html: ['views/*.html', 'public/**/*.html'],
	serverFiles: ['*.js', 'routes/*.js'],
	scripts: 'js/*.js',
	vendorScripts: 'bower_components/**/*.js',
	scss: ['bower_components/foundation/scss/*', 'scss/*']
};


// Define tasks.
gulp.task('scripts', function (){
	return gulp.src(path.scripts)
			.pipe(concat('scripts.js'))
			.pipe(gulp.dest('public/js'))
			.pipe(livereload());
			// .pipe(uglify());
});

gulp.task('vendorScripts', function (){
	return gulp.src(path.vendorScripts)
			.pipe(concat('vendor.js'))
			.pipe(gulp.dest('public/js'))
			.pipe(livereload());
});

gulp.task('styles', function (){
	return gulp.src(path.scss)
			.pipe(sass())
			.pipe(gulp.dest('public/stylesheets'))
			.pipe(livereload());
});

gulp.task('html', function (){
	return gulp.src(path.html)
			.pipe(livereload());
});



// Watch files for changes.
gulp.task('watch', function (){
	livereload.listen();
	gulp.watch(path.html, []);
	gulp.watch(path.scripts, ['scripts']);
	gulp.watch(path.vendorScripts, ['vendorScripts']);
	gulp.watch(path.scss, ['styles']);
});

gulp.task('server', function (){
	nodemon({
		script: '',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }

	}).on('restart', function (){
		console.log('Restarted server.')
	});
});


// Default task.
gulp.task('default', ['vendorScripts', 'scripts', 'styles', 'watch', 'server']);

var gulp = require('gulp'),
		sass = require ('gulp-sass'),
		notify = require('gulp-notify'),
		mainBowerFiles = require('main-bower-files'),
		filter = require('gulp-filter'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify');

var config = {
	stylesPath: 'assets/styles',
	jsPath: 'assets/scripts',
	bowerDir: 'bower_components' ,
	outputDir: 'public'
}

gulp.task('js', function() {
	return gulp.src(mainBowerFiles())
		.pipe(filter('**/*.js'))
		.pipe(concat('rest.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('jsmain', function() {
	return gulp.src(config.jsPath+'/main.js')
		.pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('css', function() {
	return gulp.src(config.stylesPath + '/main.scss')
		.pipe(sass({
				outputStyle: 'compressed',
				includePaths: [
					config.stylesPath,
					config.bowerDir + '/bootstrap-sass/assets/stylesheets',
					config.bowerDir + '/font-awesome/scss'
				]
			}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(config.outputDir + '/css'));
});

gulp.task('watch', function(){
	gulp.watch([config.stylesPath + '**/*.scss', config.stylesPath + '**/*.sass', config.stylesPath + '**/*.css'], ['css']);

	gulp.watch([config.jsPath + '**/*.js'], ['js'], ['jsmain']);

})

gulp.task('default', ['js', 'jsmain', 'css']);

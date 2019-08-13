var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync').create();
// var watch = require('gulp-watch');




gulp.task('sass-compile', function () {
	return gulp.src('./src/css/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./src/css'))
});

gulp.task('sass', function () {
	gulp.watch('./src/**/*.scss', gulp.series('sass-compile'))

});

//Порядок подключения файлов css
var cssFiles = [
	'./src/css/main.css',
	'./src/css/media.css',
	'./src/css/my_reset.css'
]
//Порядок подключения файлов js
var jsFiles = [
	'./src/js/lib.js',
	'./src/js/main.js'
]
//Таск на стили CSS
function styles() {
	//Шаблон для поиска файлов css
	//Все файлы пошаблону './src/css/**/*.css'
	return gulp.src(cssFiles)
		//Папка где лежит объедененный файл
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			//добавление префиксов
			browswrs: ['last 2 version'],
			cascade: false
		}))
		//Минификацич CSS
		.pipe(cleanCSS({
			level: 2
		}))
		//Выводнвя папка для стилей
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
};


//Таск на скрипты JS
function scripts() {
	//Шаблон для поиска файлов css
	//Все файлы пошаблону './src/css/**/*.css'
	return gulp.src(jsFiles)
		//Папка кде лежит объедененный файл
		.pipe(concat('script.js'))
		//Минификация JS
		.pipe(uglify({
			//Максимально сжимает
			toplevel: true
		}))
		//Выводнвя папка для стилей
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());

};

//
function clean() {
	return del(['build/*'])
};

//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Удалить все в указанной папке
gulp.task('del', clean);
//Таск для отслеживанияизменений
gulp.task('watch', watch);
//
gulp.task('sass:watch', sass);
//Таскдляудаленияфайловвпапке build и запуска styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//
gulp.task('dev', gulp.series('build', 'watch'));

//Просматривать файлы
function watch() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	//Следить за CSS файлами
	gulp.watch('./src/css/**/*.css', styles);
	//Следить за JS файлами
	gulp.watch('./src/js/**/*.js', scripts);
	//При изменении HTML запустьть синхронизацию
	gulp.watch("./*.html").on('change', browserSync.reload);
};
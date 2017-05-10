// Definición de componentes a utilizar
var gulp = require('gulp');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var mincss = require('gulp-cssmin');
var mainBowerFiles = require('main-bower-files');


// Definición de rutas
var project = require('./project.json');

var paths = {

    scripts: {
        orig: 'site/js',
        dest: project.webroot + '/js'
    },

    content: {
        orig: 'site/content',
        dest: project.webroot + '/content',
    },

    htmls: {
        orig: '',
        dest: project.webroot,
    },

    fonts: {
        orig: 'site/content/fonts',
        dest: project.webroot + '/content/fonts',
    },

    images: {
        orig: 'site/content/images',
        dest: project.webroot + '/content/images',
    }

};

// Se minifican los paquetes js
gulp.task('minifyJs', function () {

    var jsFilter = filter('**/*.js');

    var t01 = gulp.src([paths.scripts.orig + "/AdsbApp.js",
                        paths.scripts.orig + '/**/*.js',
                        "!" + paths.scripts.orig + "/AdsbApp.constant.js"])
                        .pipe(concat('app.js'))
                        //.pipe(uglify())
                        .pipe(gulp.dest(paths.scripts.dest));

    var t02 = gulp.src(paths.scripts.orig + "/AdsbApp.constant.js")
                        .pipe(concat('configuration.js'))
                        .pipe(gulp.dest(paths.scripts.dest));

    var t03 = gulp.src(mainBowerFiles())
                  .pipe(jsFilter)
                  //.pipe(uglify())
                  .pipe(gulp.dest(paths.scripts.dest + '/vendor'));

    return;
});

// Se minifican los paquetes css
gulp.task('minifyCss', function () {

    //var cssFilter = filter(['**/*.css']);
    var cssFilter = filter(['**/*.css', '**/*.ttf', '**/*.woff']);

    var t01 = gulp.src(paths.content.orig + '/**/css/*.css')
                  .pipe(mincss())
                  .pipe(gulp.dest(paths.content.dest));

    var t02 = gulp.src(mainBowerFiles())
                  .pipe(cssFilter)
                  .pipe(mincss())
                  .pipe(gulp.dest(paths.content.dest + '/vendor'));

    return;
});

// Se minifican las fuentes
gulp.task('minifyFonts', function () {

    var fontsFilter = filter(['**/*.eot', '**/*.ttf', '**/*.woff', '**/*.woff2']);

    var t01 = gulp.src(paths.fonts.orig)
                  .pipe(fontsFilter)
                  .pipe(gulp.dest(paths.fonts.dest));

    var t02 = gulp.src(mainBowerFiles())
                  .pipe(fontsFilter)
                  .pipe(mincss())
                  .pipe(gulp.dest(paths.fonts.dest));

    return;
});

// Copia de arhivos html
gulp.task('copiaHtml', function () {

    var htmlFilter = filter(['**/*.html']);

    var t01 = gulp.src(['*.html'])
                  .pipe(gulp.dest(paths.htmls.dest));

    var t02 = gulp.src(['Vistas/**/*.html'])
                  .pipe(gulp.dest(paths.htmls.dest + "/Vistas"));

    return;
});

// Copia imagenes
gulp.task('copiaImages', function () {

    var imagesFilter = filter(['**/*.png']);

    var t01 = gulp.src(paths.images.orig + '/**/*.png')
                  .pipe(gulp.dest(paths.images.dest));

    return;
});

// A medida que se cambia un archivo html se hace la copia en la carpeta de despliegue
gulp.task('watchHtml', function () {

    var htmlFilter = filter(['**/*.html']);

    var t01 = gulp.src(['*.html'])
                  .pipe(watch('*.html'))
                  .pipe(gulp.dest(paths.htmls.dest));

    var t02 = gulp.src(['Vistas/**/*.html'])
                  .pipe(watch('Vistas/**/*.html'))
                  .pipe(gulp.dest(paths.htmls.dest + "/Vistas"));

    return;
});

// Tarea de revisión de cambio en los archivos html, js o css
gulp.task('watchJsCss', function () {
    gulp.watch(paths.scripts.orig + '/**/*.js', ['minifyJs']);
    gulp.watch(paths.content.orig + '/**/*.css', ['minifyCss']);
});


// Se minifican los paquetes js
gulp.task('deploy', function () {

    var jsFilter = filter('**/*.js');

    var t01 = gulp.src([paths.scripts.orig + "/AdsbApp.js",
                        paths.scripts.orig + '/**/*.js',
                        "!" + paths.scripts.orig + "/AdsbApp.constant.js"])
                        .pipe(concat('app.js'))
                        .pipe(uglify())
                        .pipe(gulp.dest(paths.scripts.dest));

    var t02 = gulp.src(paths.scripts.orig + "/AdsbApp.constant.js")
                        .pipe(concat('configuration.js'))
                        .pipe(gulp.dest(paths.scripts.dest));

    var t03 = gulp.src(mainBowerFiles())
                  .pipe(jsFilter)
                  .pipe(uglify())
                  .pipe(gulp.dest(paths.scripts.dest + '/vendor'));


    var cssFilter = filter(['**/*.css', '**/*.ttf', '**/*.woff']);

    var t04 = gulp.src(paths.content.orig + '/**/*.css')
                  .pipe(mincss())
                  .pipe(gulp.dest(paths.content.dest));

    var t05 = gulp.src(mainBowerFiles())
                  .pipe(cssFilter)
                  .pipe(mincss())
                  .pipe(gulp.dest(paths.content.dest + '/vendor'));

    return;
});


// Tarea por defecto
gulp.task('default', ['minifyJs', 'minifyCss', 'minifyFonts', 'copiaHtml', 'copiaImages']);
gulp.task('watch', ['watchJsCss']);

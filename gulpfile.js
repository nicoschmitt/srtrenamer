var gulp     = require('gulp');
var del      = require('del');
var uglify   = require("gulp-uglify");
var rename   = require("gulp-rename");
var concat   = require("gulp-concat");

// Dev

gulp.task("clean", function() {
   del("electron-app/app/lib/*"); 
});

gulp.task('angular-js', function() {
    return gulp.src([
                    "node_modules/angular/angular.js",
                    "node_modules/angular-route/angular-route.js",
                    "node_modules/angular-animate/angular-animate.js",
                    "node_modules/angular-aria/angular-aria.js",
                    "node_modules/angular-material/angular-material.js"
                ])
                .pipe(concat("angular.full.min.js"))
                .pipe(uglify())
                .pipe(gulp.dest("electron-app/app/lib"));
});

gulp.task('angular-css', function() {
    return gulp.src([
                    "node_modules/angular-material/angular-material.min.css"
                ])
                .pipe(gulp.dest("electron-app/app/lib"));
});


// Main tasks

gulp.task('default', [ "clean", "angular-js", "angular-css" ]);

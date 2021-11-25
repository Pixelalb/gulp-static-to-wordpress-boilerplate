let gulp = require("gulp");
var fileinclude = require("gulp-file-include");
let sass = require("gulp-dart-sass");
let browserSync = require("browser-sync");
let uglify = require("gulp-uglify");
let gulpIf = require("gulp-if");
var fs = require("fs");
let cleanCSS = require("gulp-clean-css");
let sourcemaps = require("gulp-sourcemaps");
let cache = require("gulp-cache");
let del = require("del");
let rsync = require("gulp-rsync");
var argv = require("yargs").argv;

// Build aruments
var isWordpress = argv.wordpress === undefined ? false : true;
var isTheme = argv.theme === undefined ? false : true;

// Get the config
var config = require("./config.json");

// Get settings
// -----------------
// -----------------
var assetsFolder = config.assetsFolder;
var themeName = config.themeName;
var localWordPressThemeBackupFolder = config.localWordPressThemeBackupFolder;
var localWordPressThemesFolder = config.localWordPressThemesFolder;
var remoteStaticHTMLPath = config.remoteStaticHTMLPath;
var remoteWordPressPath = config.remoteWordPressPath;
var setupAssetsFolder = config.setupAssetsFolder;
var wpCustomizerFileName = config.wpCustomizerFileName;
// -----------------
// -----------------

var wordpressLocalThemePath = localWordPressThemesFolder + themeName;
var wordpressRemoteThemePath =
	remoteWordPressPath + "/wp-content/themes/" + themeName;
var wordpressLocalAssetsPath = wordpressLocalThemePath + "/" + assetsFolder;
// var wordpressRemoteAssetsPath = remoteWordPressPath + "/wp-content/themes/"+ themeName + "/" + assetsFolder;
var customizerFile = setupAssetsFolder + "/" + wpCustomizerFileName;

// Default Tasks
// -----------------
gulp.task("browserSync", function () {
	browserSync({
		server: ["theme-assets"],
		port: 8000,
	});
});

gulp.task("sass", function () {
	return gulp
		.src("app/scss/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				includePaths: require("node-normalize-scss").includePaths,
			}).on("error", sass.logError)
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(assetsFolder + "/css"))
		.pipe(gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath + "/css")))
		.pipe(
			browserSync.reload({
				stream: true,
			})
		);
});

gulp.task("html", function () {
	return gulp
		.src([
			"app/*.html",
			"!app/_head.html", // ignore
			"!app/_header.html", // ignore
			"!app/_footer.html", // ignore
		])
		.pipe(
			fileinclude({
				prefix: "@@",
				basepath: "@file",
			})
		)
		.pipe(gulp.dest(assetsFolder))
		.pipe(
			browserSync.reload({
				stream: true,
			})
		);
});

gulp.task("javascript", function () {
	return gulp
		.src("app/js/**/*.js")
		.pipe(gulp.dest(assetsFolder + "/js"))
		.pipe(
			browserSync.reload({
				stream: true,
			})
		)
		.pipe(gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath + "/js")));
});

// Optimization tasks
// ------------
gulp.task("compressJS", function () {
	return gulp
		.src(assetsFolder + "/**/*.js")
		.pipe(gulpIf("*.js", uglify()))
		.pipe(gulp.dest(assetsFolder))
		.pipe(gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath)));
});

gulp.task("compressCSS", function () {
	return gulp
		.src(assetsFolder + "/**/*.css")
		.pipe(gulpIf("*.css", cleanCSS()))
		.pipe(gulp.dest(assetsFolder))
		.pipe(gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath)));
});

gulp.task("images", function () {
	return gulp
		.src("app/images/**/*.+(png|jpg|jpeg|gif|svg)")
		.pipe(gulp.dest(assetsFolder + "/images"))
		.pipe(
			gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath + "/images"))
		);
});

//Flow tasks
// --------------

// Copy theme to backup folder
gulp.task("copytheme", function () {
	return gulp
		.src(wordpressLocalThemePath + "/**/*.*")
		.pipe(gulp.dest(localWordPressThemeBackupFolder));
});

// Copying the PHP customizer file
gulp.task("copycustomizer", function (done) {
	if (
		fs.existsSync(wordpressLocalThemePath + "/inc/" + wpCustomizerFileName)
	) {
		console.log(
			"\x1b[33mThe file " +
				wordpressLocalThemePath +
				"/inc/" +
				wpCustomizerFileName +
				" already exists\x1b[0m"
		);
		done();
	} else {
		return gulp
			.src(customizerFile)
			.pipe(gulp.dest(wordpressLocalThemePath + "/inc"));
	}
});

// Copying the PHP customizer file
gulp.task("includecustomizer", function (cb) {
	fs.appendFile(
		wordpressLocalThemePath + "/functions.php",
		'\r\n\r\n\r\n/**\r\n *Theme customizer\r\n */ \r\n require get_stylesheet_directory() . "/inc/stegaru-customizer.php";',
		cb
	);
});

// Copying js
gulp.task("copyapp", function () {
	return gulp
		.src("app/**/*.js")
		.pipe(gulp.dest(assetsFolder))
		.pipe(gulpIf(isWordpress, gulp.dest(wordpressLocalAssetsPath)));
});

// Clean task
gulp.task("clean", function () {
	return del([
		assetsFolder + "/**/*",
		"!" + assetsFolder + "/images",
		"!" + assetsFolder + "/images/**/*",
	]);
});

// Watchers
gulp.task("watch", function () {
	gulp.watch("app/scss/**/*.scss", gulp.series("sass"));
	gulp.watch("app/*.html", gulp.series("html"));
	gulp.watch("app/js/**/*.js", gulp.series("javascript"));
});

// Build
// -----
gulp.task(
	"build",
	gulp.series(
		"clean",
		"sass",
		"copyapp",
		"html",
		"compressJS",
		"compressCSS",
		"images"
	)
);

// The Default task
// -----
gulp.task(
	"default",
	gulp.parallel(gulp.series("build", "watch"), "browserSync")
);

// Setup Customizer
gulp.task("customizer", gulp.series("copycustomizer", "includecustomizer"));

// Deploy to FTP
// -------------------------
gulp.task("deploy", function () {
	if (isTheme) {
		console.log("Deploying to Wordpress");
		return gulp.src(wordpressLocalThemePath + "/**").pipe(
			rsync({
				root: wordpressLocalThemePath + "/",
				hostname: "",
				username: "root",
				destination: wordpressRemoteThemePath,
			})
		);
	} else {
		return gulp.src(assetsFolder + "/**").pipe(
			rsync({
				root: assetsFolder + "/",
				hostname: "stegaru-dev.com",
				username: "root",
				destination: remoteStaticHTMLPath,
			})
		);
	}
});

# Static to WordPress templates front-end build env.

(needs update...)

Run `npm install` within the html/ folder.

## How to use:

* run  `gulp` to start the project in DEV mode (w/ watchers, browsersync, etc.. Make sure you have Gulp installed globally: `sudo npm install gulp-cli -g` )
* run  `gulp build` to build the project for production (w/ compressed assets, etc..). If used with the `--wordpress` argument, it will also create the build folder within the WordPress theme.
* run  `gulp deploy` moves the dist content to a server via FTP, into `remoteStaticHTMLPath`. Uses rsync. If used with the `--theme` argument, it will copy the entire WordPress theme folder from local WordPress to the remote WordPress instance (overrides it).

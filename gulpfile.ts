import * as del from 'del';
import * as gulp from 'gulp';
import * as loadPlugins from 'gulp-load-plugins';
import * as util from 'gulp-util';
import * as browserify from 'browserify';
import * as tsify from 'tsify';
import * as source from 'vinyl-source-stream';
import * as buffer from 'vinyl-buffer';

import {DIST_DIR, APP_DIR, TEST_DIST, OUTPUT_FILE, INPUT_FILE, OUTPUT_FILE_DTS, APP_NAME} from './config';
import {join} from 'path';
import {PassThrough} from 'stream';

let plugins: any = loadPlugins();
let isRelease: boolean = process.argv.indexOf('--release') > -1;

function nope(): PassThrough {
  'use strict';
  return new PassThrough({ objectMode: true });
}

// create the d.ts bundle
function createDTS(done: Function): void {
  let tsProject: any = plugins.typescript.createProject('tsconfig.json');
  gulp.src([join(APP_DIR, '**/*.ts'), '!' + join(APP_DIR, '**/*.spec.ts')])
    .pipe(tsProject())
    .dts
    .pipe(plugins.concat(OUTPUT_FILE_DTS))
    .pipe(plugins.replace(/import.*?[\n]/g, '')) // it's concatenated, no need the import syntax
    .pipe(gulp.dest(DIST_DIR))
    .on('end', done);
}

// create the bundle with dependencies
function createBundle(done: Function): void {
  browserify({
    basedir: '.',
    standalone: APP_NAME,
    debug: !isRelease,
    entries: [join(APP_DIR, INPUT_FILE)],
    cache: {},
    packageCache: {}
  }).plugin(tsify).bundle()
    .pipe(source(OUTPUT_FILE))
    .pipe(buffer())
    .pipe(plugins.replace('<<VERSION>>', require('./package.json').version))
    .pipe(isRelease ? nope() : plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(DIST_DIR))
    .pipe(isRelease ? plugins.uglify() : nope())
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DIST_DIR))
    .on('end', done);
}

// delete everything used in our test cycle here
function clean(): any {
  'use strict';

  return del([DIST_DIR + '**/*', '!' + TEST_DIST]).then((paths: Array<any>) => {
    util.log('Deleted \x1b[33m', paths && paths.join(', ') || '-', '\x1b[0m');
  });
}

// run tslint against all typescript
function lint(): any {
  'use strict';

  return gulp.src(join(APP_DIR, '**/*.ts'))
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report(plugins.tslintStylish, {
      emitError: false,
      sort: true,
      bell: true
    }));
}

gulp.task('build.sdk', createBundle);
gulp.task('build.d.ts', createDTS);
gulp.task('clean', clean);
gulp.task('test.lint', lint);

gulp.task('build',
  gulp.series('clean', gulp.parallel('build.sdk', 'build.d.ts'), done => done()));

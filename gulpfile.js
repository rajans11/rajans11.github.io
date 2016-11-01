const gulp = require('gulp'),
      handlebars = require('gulp-compile-handlebars'),
      rename = require('gulp-rename'),
      yaml = require('js-yaml'),
      fs   = require('fs');

const templateData = Object.assign({}, ...[
    './data/data.yaml',
    './data/employment.yaml',
    './data/personal-details.yaml',
    './data/academics.yaml',
    './data/technical-skills.yaml',
    './data/summary.yaml'
  ].map((file) => yaml.safeLoad(fs.readFileSync(file, 'utf8')))
);


gulp.task('handlebars', () => {
  gulp.src('templates/index.hbs')
    .pipe(handlebars(templateData, {
      helpers: require('./templates/helpers.js'),
      batch: ['./templates'],
      compile: { noEscape: true }
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['handlebars']);

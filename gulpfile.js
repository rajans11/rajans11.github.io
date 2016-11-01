const gulp = require('gulp');
const handlebars = require('handlebars');
const rename = require('gulp-rename');
const yaml = require('js-yaml');
const fs = require('fs');
const through2 = require('through2');
const path = require('path');

const templateData = Object.assign(
  {},
  ...[
    './data/data.yaml',
    './data/employment.yaml',
    './data/personal-details.yaml',
    './data/academics.yaml',
    './data/technical-skills.yaml',
    './data/summary.yaml'
  ].map((file) => yaml.safeLoad(fs.readFileSync(file, 'utf8')))
);

const registerPartials = (partialsDir) => {
  const partialFiles = fs.readdirSync(partialsDir);
  partialFiles.forEach((file) => {
    const filePath = path.join(partialsDir, file);
    const partialName = path.basename(file, path.extname(file));
    const partialContent = fs.readFileSync(filePath, 'utf-8');
    handlebars.registerPartial(partialName, partialContent);
  });
};

const registerSections = (sectionsDir) => {
  const sectionFiles = fs.readdirSync(sectionsDir);
  sectionFiles.forEach((file) => {
    // Ensure we only load .hbs files
    if (path.extname(file) === '.hbs') {
      const filePath = path.join(sectionsDir, file);
      const sectionName = path.basename(file, path.extname(file)); // Get the name without extension
      const sectionContent = fs.readFileSync(filePath, 'utf-8');
      handlebars.registerPartial(sectionName, sectionContent); // Register as a partial
    }
  });
};

registerPartials('./templates/partials');
registerSections('./templates/sections');

const compileHandlebars = () => {
  return gulp.src('templates/index.hbs')  // Path to your Handlebars template
    .pipe(through2.obj((file, _, cb) => {
      const template = handlebars.compile(file.contents.toString());  // No need for { noEscape: true }
      const result = template(templateData);

      file.contents = Buffer.from(result);  // Modify the file's contents
      cb(null, file);  // `cb` pushes the file to the next stream
    }))
    .pipe(rename('index.html'))  // Rename the file to index.html
    .pipe(gulp.dest('./'));  // Save the result to the current directory
};

gulp.task('default', compileHandlebars);

module.exports = { compileHandlebars };

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const yaml = require('js-yaml');

// Load template data from YAML files
const templateData = Object.assign(
  {},
  ...[
    './data/data.yaml',
    './data/employment.yaml',
    './data/personal-details.yaml',
    './data/qualifications.yaml',
    './data/technical-skills.yaml',
    './data/summary.yaml',
  ].map((file) => yaml.load(fs.readFileSync(file, 'utf8')))
);

const registerTemplates = (directory) => {
  const templateFiles = fs.readdirSync(directory).filter((file) => path.extname(file) === '.hbs');

  if (templateFiles.length === 0) {
    throw new Error(`No .hbs files found in directory: ${directory}`);
  }

  templateFiles.forEach((file) => {
    const filePath = path.join(directory, file);
    const templateName = path.basename(file, '.hbs'); // Extract name without .hbs extension
    const templateContent = fs.readFileSync(filePath, 'utf-8');

    handlebars.registerPartial(templateName, templateContent);
  });
};

// Register partials from specific directories
registerTemplates('./templates/partials');
registerTemplates('./templates/sections');

// Compile the Handlebars template
const compileHandlebars = () => {
  const inputFilePath = path.resolve('templates/index.hbs');
  const outputFilePath = path.resolve('index.html');

  // Read and compile the Handlebars template
  const templateContent = fs.readFileSync(inputFilePath, 'utf-8');
  const template = handlebars.compile(templateContent);
  const result = template(templateData);

  // Write the rendered template to index.html
  fs.writeFileSync(outputFilePath, result, 'utf-8');
  console.log(`File compiled and saved to ${outputFilePath}`);
};

// Run the compile function
compileHandlebars();

module.exports = { compileHandlebars };

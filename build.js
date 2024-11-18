const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const yaml = require('js-yaml');
const encoding = 'utf8'

const loadYamlFiles = (role = 'developer') => {
  const baseYamlFiles = [
    './data/data.yaml',
    './data/personal-details.yaml',
    './data/qualifications.yaml',
    './data/technical-skills.yaml',
    './data/summary.yaml',
  ];

  const roleYamlFile = role === 'manager'
    ? './data/employment-engineering-manager.yaml'
    : './data/employment.yaml';

  const allYamlFiles = [...baseYamlFiles, roleYamlFile];

  return Object.assign(
    {},
    ...allYamlFiles.map((file) => yaml.load(fs.readFileSync(file, encoding)))
  );
};

const registerTemplates = (directory) => {
  const templateFiles = fs.readdirSync(directory).filter((file) => path.extname(file) === '.hbs');

  if (templateFiles.length === 0) {
    throw new Error(`No .hbs files found in directory: ${directory}`);
  }

  templateFiles.forEach((file) => {
    const filePath = path.join(directory, file);
    const templateName = path.basename(file, '.hbs'); // Extract name without .hbs extension
    const templateContent = fs.readFileSync(filePath, encoding);

    handlebars.registerPartial(templateName, templateContent);
  });
};

const compileHandlebars = (role = 'developer') => {
  const templateData = loadYamlFiles(role);
  const inputFilePath = path.resolve('templates/index.hbs');
  const outputFilePath = path.resolve('index.html');
  const templateContent = fs.readFileSync(inputFilePath, encoding);
  const template = handlebars.compile(templateContent);
  const result = template(templateData);

  fs.writeFileSync(outputFilePath, result, encoding);
  console.log(`File compiled and saved to \x1b]8;;file://${outputFilePath}\x1b\\index.html\x1b]8;;\x1b\\ for profile: ${role}`);
};

const role = process.argv[2] || 'developer';
registerTemplates('./templates/partials');
registerTemplates('./templates/sections');

compileHandlebars(role);

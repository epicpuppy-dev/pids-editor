import { validate } from 'schema-utils';
import { Schema } from 'webpack-dev-server';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const schema = {
  type: 'object',
  properties: {
    langFile: {
      type: 'string',
    },
  },
} as Schema;

export default function (source) {
  const options = this.getOptions();

  validate(schema, options, {
    name: 'Localization Loader',
    baseDataPath: 'options',
  });

  if (!options.langFile) return source;
  const langFile = path.resolve(options.langFile);
  this.addDependency(langFile);

  const lang = JSON.parse(fs.readFileSync(langFile, 'utf8'));

  if (!/{{.+}}/.test(source)) return source;

  // Apply some transformations to the source...
  for (const key in lang) {
    source = source.replace(new RegExp(`{{${key}}}`, 'g'), `${lang[key]}`);
  }

  if (/\.html$/.test(this.resourcePath)) {
    const template = _.template(source, { interpolate: /<%=([\s\S]+?)%>/g, variable: 'data', ...options });
    // Use `eval("require")("lodash")` to enforce using the native nodejs require
    // during template execution
    return 'var _ = eval("require")(' + JSON.stringify(require.resolve('lodash')) + ');' +
      'module.exports = function (templateParams) { with(templateParams) {' +
        // Execute the lodash template
        'return (' + template.source + ')();' +
      '}}';
  }

  return source;
}
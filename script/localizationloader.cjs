"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var schema_utils_1 = require("schema-utils");
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var schema = {
    type: 'object',
    properties: {
        langFile: {
            type: 'string',
        },
    },
};
function default_1(source) {
    var options = this.getOptions();
    (0, schema_utils_1.validate)(schema, options, {
        name: 'Localization Loader',
        baseDataPath: 'options',
    });
    if (!options.langFile)
        return source;
    var langFile = path.resolve(options.langFile);
    this.addDependency(langFile);
    var lang = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    if (!/{{.+}}/.test(source))
        return source;
    // Apply some transformations to the source...
    for (var key in lang) {
        source = source.replace(new RegExp("{{".concat(key, "}}"), 'g'), "".concat(lang[key]));
    }
    return source;
}

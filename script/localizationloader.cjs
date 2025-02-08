"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    if (/\.html$/.test(this.resourcePath)) {
        var template = _.template(source, __assign({ interpolate: /<%=([\s\S]+?)%>/g, variable: 'data' }, options));
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

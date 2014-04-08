/*
 * inline-angular-templates
 * https://github.com/molant/grunt-inline-angular-template
 *
 * Copyright (c) 2014 molant
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('inline_angular_templates', 'Takes the content of templateUrl and puts it into template', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        var templateUrlRegex = new RegExp("templateUrl: (?:'|\")(.*)(?:'|\")");
        var templatesFolder = this.files[0].templates;

        grunt.log.writeln(JSON.stringify(this.files, null, 2));

        // Iterate over all specified file groups.
        this.files.forEach(function (file) {
            // Concat specified files.
            var src = file.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                var code = grunt.file.read(filepath);

                var results = templateUrlRegex.exec(code);

                if (results) {
                    var split = results[1].split('/');
                    var fileName =  split[split.length - 1];
                    var template = grunt.file.read(path.join(templatesFolder[0], fileName));
                    code = code.replace(results[0], 'template: \'' + template.replace(/'/g,"\\'").replace(/\n/g,'').replace(/\r/g,'') + '\'');
                    var newFile = 'output.js';

                    grunt.file.write(newFile, code);

                    grunt.log.writeln('File "' + newFile + '" created.');
                }
                return code;
            });
        });
    });

};

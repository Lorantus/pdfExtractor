const fs = require('fs'),
    parsePdf = require('./pdfParser'),
    {promisify} = require('util'),
    path = require('path');

const readdirAsync = promisify(fs.readdir);

const extactor = (rootPath, i18nRegex) => {
    const parseFile = fileName =>
        parsePdf(fileName)
            .then((pdfParser, pdfData) =>
                pdfParser.getAllFieldsTypes()
                    .filter(field => field.id.match(i18nRegex))
                    .map(field => ({ ...({ id, value } = field), ...{ fileName } }))
            );

    return readdirAsync(rootPath)
        .then(files => files.map(file => parseFile(path.join(rootPath, file))))
        .then(p => Promise.all(p))
        .then(fieldFiles => {
            const errors = [];
            const fields = fieldFiles.reduce((acc, fieldsFile) => {
                fieldsFile.map(fieldFile => {
                    const { id, value, fileName } = fieldFile;
                    if (acc[id]) {
                        acc[id].fileNames.push(fileName);
                    } else {
                        acc[id] = {
                            msgctxt: id,
                            msgid: value,
                            fileNames: [fileName]
                        }
                    }
                })
                return acc;
            }, {});
            if (errors.length) {
                throw new Error(errors);
            }
            return Object.values(fields);
        })
}

module.exports = extactor;
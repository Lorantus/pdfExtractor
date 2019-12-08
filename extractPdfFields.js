const fs = require('fs'),
    promisify = require('./promisify'),
    parsePdf = require('./pdfParser');

const extactor = (rootPath, i18nRegex) => {
    const parseFile = fileName =>
        parsePdf(fileName)
            .then((pdfParser, pdfData) =>
                pdfParser.getAllFieldsTypes()
                    .filter(field => field.id.match(i18nRegex))
                    .map(field => ({ ...({ id, value } = field), ...{ fileName } }))
            );

    return promisify(fs.readdir)(rootPath)
        .then(files => files.map(file => parseFile(rootPath + '/' + file)))
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
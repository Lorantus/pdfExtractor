const extractPdfFields = require('./extractPdfFields');

extractPdfFields('./pdf', /^I18N_.*/ig)
    .then(messages => {
        if(messages.length) {
            messages.map(message => {
                message.fileNames
                    .map(fileName => console.log(`#: ${fileName}`));
                console.log(`msgctxt \"${message.msgctxt}\"`);
                console.log(`msgid \"${message.msgid}\"`);
                console.log(`msgstr \"\"`);
                console.log("");
            })
        } else {
            console.log("Pas de traduction à extraire");
        }
    })
    .catch(err => {
        console.log(err);
    });
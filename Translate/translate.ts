import Translators = require('./translators');

module Translate {

    if (process.argv.length < 4) {
        console.log('Supply a (valid) language-name and code.\nE.g.: node translate.js Dutch nl');
        process.exit();
    }

    var langName, langCode, inputFile;
    if (process.argv.length >= 4) {
        langName = process.argv[2];
        langCode = process.argv[3];
    }
    if (process.argv.length >= 5) {
        inputFile = process.argv[4];
    }

    if (!langName || !langName.length || langName.length < 3) {
        console.log('Supply a (valid) language-name.');
        process.exit();
    }
    if (!langCode || !langCode.length || langCode.length < 2) {
        console.log('Supply a (valid) language-code to translate to.');
        process.exit();
    }
    if (!inputFile) {
        console.log('No input resource file provided. Translating locale-en...');
    }

    // Set the source language to english
    var sourceLang = 'en';
    console.log(`Translating from '${sourceLang}' to '${langCode}'...`)
    
    if (inputFile) {
        var rt = new Translators.Translators.ResourceTypeTranslator(sourceLang, langCode);
        rt.translate(inputFile);
    } else {
        var lt = new Translators.Translators.LocaleTranslator(sourceLang, langCode, langName);
        lt.translate();
    }
}
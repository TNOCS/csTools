import request = require('request');
import fs = require('fs');
import path = require('path');
import en = require('./locale-en');

var langName, langCode;
if (process.argv.length >= 4) {
    langName = process.argv[2];
    langCode = process.argv[3];
} else {
    console.log('Supply a (valid) language-name and code.\nE.g.: node translate.js Dutch nl');
    process.exit();
}

if (!langName || !langName.length || langName.length < 3) {
    console.log('Supply a (valid) language-name.');
    process.exit();
}
if (!langCode || !langCode.length || langCode.length < 2) {
    console.log('Supply a (valid) language-code to translate to.');
    process.exit();
}

// Set the source language to english
var sourceLang = 'en';
console.log(`Translating from '${sourceLang}' to '${langCode}'...`)

var locale_en = en.Translations.English.locale;
var newLocale = {};

var count = 0;
Object.keys(locale_en).forEach((i) => {
    if (locale_en.hasOwnProperty(i)) {
        newLocale[i] = translateRecursively(locale_en[i], (value) => {
            newLocale[i] = value;
            count += 1;
            if (count === Object.keys(locale_en).length - 1) {
                saveFile();
            }
        });
    }
});

// Parse data that is returned in a parsed string array (e.g., "[[[translation, original],,,], language]")
function parseResult(data: any): string {
    var result;
    if (!data) {
        console.log('No translation found: ' + data);
    } else {
        data = data.replace(/(,+)/g, ',');
        try {
            result = JSON.parse(data);
        } catch (error) {
            console.log('Error parsing data ' + data + ' - ' + error);
        }
        if (result) {
            return result[0][0][0];
        }
    }
    return result;
}

/**
 * Contact the translation service with the query we want to translate
 */
function translateString(sourceText: string, cb: Function) {
    if (!sourceText) return;
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
        + sourceLang + "&tl=" + langCode + "&dt=t&q=" + encodeURI(sourceText);

    // console.log(url);
    request(url, (error, response, data) => {
        if (!error && data != undefined) {
            var res = parseResult(data);
            if (!res || res.length === 0) {
                cb(sourceText);
            } else {
                cb(decodeURI(res));
            }
        }
    });
}

/**
 * Translate a nested key-value object
 */
function translateRecursively(subDict: any, cb: Function) {
    var result = {};
    if (typeof subDict === 'string') {
        translateString(subDict, (value) => {
            cb(value);
        });
    } else if (typeof subDict === 'object') {
        var count = 0;
        var keys = Object.keys(subDict);
        keys.forEach((d, index) => {
            translateRecursively(subDict[d], (value) => {
                result[d] = value;
                count += 1;
                if (count === keys.length - 1) {
                    cb(result);
                }
            });
        });
    }
}


/**
 * Creates an angular-translate locale file from the translated texts, and saves 
 * a file to './out/locale-CODE.ts' which can be placed in the languages folder of csWeb
 */
function saveFile() {
    var filePath = path.join(__dirname, 'out', `locale-${langCode}.ts`);
    var output = ['module Translations {', `    export class ${langName} {`,
        'public static locale: ng.translate.ITranslationTable = '];
    output.push(JSON.stringify(newLocale, null, 4));
    output.push('    }');
    output.push('}');
    
    var text = output.join('\n');
    text = text.replace(/(\\\")/g, '`'); // Replace \" with `
    
    fs.writeFile(filePath, text, (err) => {
        if (!err) {
            console.log('File saved successfully');
        } else {
            console.log('Error saving file');
        }
    });
}

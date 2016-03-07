import fs = require('fs');
import path = require('path');
import TranslateConnection = require('./translateConnection');
import en = require('./locale-en');
import _ = require('underscore');

export module Translators {

    export class LocaleTranslator {
        private locale_en = en.Translations.English.locale;
        private newLocale = {};
        private sourceLang = 'en';
        private langCode = 'nl';
        private langName = 'Dutch';

        public constructor(sourceLang, langCode, langName) {
            this.sourceLang = sourceLang;
            this.langCode = langCode;
            this.langName = langName;
        }

        public translate() {

            var count = 0;
            Object.keys(this.locale_en).forEach((i) => {
                if (this.locale_en.hasOwnProperty(i)) {
                    this.newLocale[i] = LocaleTranslator.translateRecursively(this.locale_en[i], this.sourceLang, this.langCode, (value) => {
                        this.newLocale[i] = value;
                        count += 1;
                        if (count === Object.keys(this.locale_en).length - 1) {
                            this.saveFile();
                        }
                    });
                }
            });
        }

        /**
         * Translate a nested key-value object
         */
        private static translateRecursively(subDict: any, sourceLang, langCode, cb: Function) {
            var result = {};
            if (typeof subDict === 'string') {
                TranslateConnection.TranslateConnection.translateString(subDict, sourceLang, langCode, (value) => {
                    cb(value);
                });
            } else if (typeof subDict === 'object') {
                var count = 0;
                var keys = Object.keys(subDict);
                keys.forEach((d, index) => {
                    LocaleTranslator.translateRecursively(subDict[d], sourceLang, langCode, (value) => {
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
        private saveFile() {
            var filePath = path.join(__dirname, 'out', `locale-${this.langCode}.ts`);
            var output = ['module Translations {', `    export class ${this.langName} {`,
                'public static locale: ng.translate.ITranslationTable = '];
            output.push(JSON.stringify(this.newLocale, null, 4));
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
    }



    export class ResourceTypeTranslator {
        private newLocale = {};
        private sourceLang = 'en';
        private langCode = 'nl';
        private resourceType = {};

        public constructor(sourceLang, langCode) {
            this.sourceLang = sourceLang;
            this.langCode = langCode;
        }

        public translate(filePath: string) {
            this.resourceType = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (this.resourceType.hasOwnProperty('featureTypes')) {
                var fTypes = this.resourceType['featureTypes'];
                var keys = Object.keys(this.resourceType['featureTypes']);
                keys.forEach((k) => {
                    this.translateFeatureType(fTypes[k]);
                });
            }
        }

        private translateFeatureType(fType) {
            var props = Object.keys(fType);
            props.forEach((p) => {
                if (p === 'languages') {
                    this.addLanguage(fType[p], (newLangs) => {
                        fType['languages'] = newLangs;
                        this.saveFileDebounced();
                    });
                }
                if (p === 'name') {
                    fType['languages'] = {};
                    fType['languages']['en'] = {};
                    fType['languages']['en']['name'] = fType['name'];
                    delete fType['name'];
                    this.addLanguage(fType['languages'], (newLangs) => {
                        fType['languages'] = newLangs;
                        this.saveFileDebounced();
                    });
                }
            });
        }

        private addLanguage(language: any, cb: Function) {
            if (language.hasOwnProperty(this.sourceLang)) {
                TranslateConnection.TranslateConnection.translateString(language[this.sourceLang]['name'], this.sourceLang, this.langCode, (value) => {
                    language[this.langCode] = {};
                    language[this.langCode]['name'] = value;                    
                    cb(language);
                });
            }
        }
        
        private saveFileDebounced = _.throttle(this.saveFile, 1000, {trailing: true, leading: false});
        private saveFile() {
            console.log('Saving file');
            fs.writeFile('translated_resource.json', JSON.stringify(this.resourceType), (err) => {
                if (!err) {
                    console.log('File saved successfully');
                } else {
                    console.log('Error saving file');
                }
            });
        }
    }
}
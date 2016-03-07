import request = require('request');

export class TranslateConnection {

    /**
     * Contact the translation service with the query we want to translate
     */
    public static translateString(sourceText: string, sourceLang: string, langCode: string, cb: Function) {
        if (!sourceText) return;
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            + sourceLang + "&tl=" + langCode + "&dt=t&q=" + encodeURI(sourceText);

        // console.log(url);
        request(url, (error, response, data) => {
            if (!error && data != undefined) {
                var res = TranslateConnection.parseResult(data);
                if (!res || res.length === 0) {
                    cb(sourceText);
                } else {
                    cb(decodeURI(res));
                }
            }
        });
    }
        
        
    // Parse data that is returned in a parsed string array (e.g., "[[[translation, original],,,], language]")
    public static parseResult(data: any): string {
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
}
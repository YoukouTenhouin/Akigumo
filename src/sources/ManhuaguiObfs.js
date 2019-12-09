import LZString from 'lz-string'

function obfuscated(p, a, c, k, e, d) {
    e = function (c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) d[e(c)] = k[c] || e(c);
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1;
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p;
}

export function constructChapterInfo(str) {
    const re = /'([^']+)',(\d+),(\d+),'([A-Za-z0-9+=\/]+)'\['\\x73\\x70\\x6c\\x69\\x63'\]/
    var matches = re.exec(str)
    var p = matches[1]
    var a = matches[2]
    var c = matches[3]
    var k = matches[4]
    return obfuscated(p, parseInt(a), parseInt(c), LZString.decompressFromBase64(k).split('|'), 0, {})
}
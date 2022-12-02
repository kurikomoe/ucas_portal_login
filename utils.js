const md5 = require("md5");
const sha1 = require("sha1");

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

// Copy from https://github.com/shaonianruntu/iHDU-Auto-Login-Script/blob/0e509c324e22ad97d6ffaf51d14dab682232657b/login.hdu.edu.cn/ready.js
$.base64 = (function($) {
    var _PADCHAR = "=",
        _ALPHA = "LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA",
        _VERSION = "1.0";

    function _getbyte64(s, i) {
        var idx = _ALPHA.indexOf(s.charAt(i));
        if (idx === -1) {
            throw "Cannot decode base64";
        }
        return idx;
    }

    function _setAlpha(s) {
        _ALPHA = s;
    }

    function _decode(s) {
        var pads = 0,
            i,
            b10,
            imax = s.length,
            x = [];
        s = String(s);
        if (imax === 0) {
            return s;
        }
        if (imax % 4 !== 0) {
            throw "Cannot decode base64";
        }
        if (s.charAt(imax - 1) === _PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === _PADCHAR) {
                pads = 2;
            }
            imax -= 4;
        }
        for (i = 0; i < imax; i += 4) {
            b10 =
                (_getbyte64(s, i) << 18) |
                (_getbyte64(s, i + 1) << 12) |
                (_getbyte64(s, i + 2) << 6) |
                _getbyte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
        }
        switch (pads) {
            case 1:
                b10 =
                    (_getbyte64(s, i) << 18) |
                    (_getbyte64(s, i + 1) << 12) |
                    (_getbyte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                break;
            case 2:
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }
        return x.join("");
    }

    function _getbyte(s, i) {
        var x = s.charCodeAt(i);
        if (x > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        }
        return x;
    }

    function _encode(s) {
        if (arguments.length !== 1) {
            throw "SyntaxError: exactly one argument required";
        }
        s = String(s);
        var i,
            b10,
            x = [],
            imax = s.length - (s.length % 3);
        if (s.length === 0) {
            return s;
        }
        for (i = 0; i < imax; i += 3) {
            b10 =
                (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
            x.push(_ALPHA.charAt(b10 >> 18));
            x.push(_ALPHA.charAt((b10 >> 12) & 63));
            x.push(_ALPHA.charAt((b10 >> 6) & 63));
            x.push(_ALPHA.charAt(b10 & 63));
        }
        switch (s.length - imax) {
            case 1:
                b10 = _getbyte(s, i) << 16;
                x.push(
                    _ALPHA.charAt(b10 >> 18) +
                    _ALPHA.charAt((b10 >> 12) & 63) +
                    _PADCHAR +
                    _PADCHAR
                );
                break;
            case 2:
                b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8);
                x.push(
                    _ALPHA.charAt(b10 >> 18) +
                    _ALPHA.charAt((b10 >> 12) & 63) +
                    _ALPHA.charAt((b10 >> 6) & 63) +
                    _PADCHAR
                );
                break;
        }
        return x.join("");
    }
    return {
        decode: _decode,
        encode: _encode,
        setAlpha: _setAlpha,
        VERSION: _VERSION,
    };
})($);

module.exports = {
  $, md5, sha1,
}

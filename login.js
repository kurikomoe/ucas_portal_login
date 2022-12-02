const axios = require("axios");

const {
    $,
    md5,
    sha1
} = require("./utils.js");

username = "KurikoMoe";
password = "kurikosocute";

_this = {
    challenge: null,
    userInfo: {
        domain: "",
        ip: null,
        password,
        username,
    },
    portalInfo: {
        acid: "1",
        doub: false,
        flowMode: 1000,
        ipv4: null,
        ipv6: "",
        lang: "zh-CN",
        noticeType: "list",
        nowType: "ipv4",
        selfServiceIp: "https://portal.ucas.ac.cn:8800",
        userDevice: {
            device: "Linux",
            platform: "Linux",
        }
    },
}

APIs = {
    agreeProtocol: "/v1/srun_portal_agree_bind",
    auth: "/cgi-bin/srun_portal",
    authSMSAccount: "/v1/srun_portal_sms",
    authSMSPhone: "/cgi-bin/srunmobile_portal",
    authWechat: "/v1/srun_wechat_code",
    authWework: "/v1/srun_portal_wework",
    info: "/cgi-bin/rad_user_info",
    log: "/v1/srun_portal_log",
    loginDM: "/cgi-bin/rad_user_dm",
    notice: "/v2/srun_portal_message",
    protocol: "/v1/srun_portal_agree_new",
    sign: "/v1/srun_portal_sign",
    sso: "/v1/srun_portal_sso",
    ssoWechat: "/v1/srun_wechat_barcode",
    token: "/cgi-bin/get_challenge",
    userAgreed: "/v1/srun_portal_agrees",
    vcodeAccount: "/v1/srun_portal_sms_code",
    vcodePhone: "/cgi-bin/srunmobile_vcode",
}

async function getToken() {
    url = `http://portal.ucas.ac.cn${APIs.token}`;
    let ret = await axios
        .get(url, {
            url: APIs.token,
            params: {
                username: _this.userInfo.username + _this.userInfo.domain,
                ip: _this.userInfo.ip
            }
        });
    return ret.data;
}

function encodeUserInfo(info, token) {
    const base64 = $.base64;
    base64.setAlpha('LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA');
    info = JSON.stringify(info);

    function encode(str, key) {
        if (str === '') return '';
        var v = s(str, true);
        var k = s(key, false);
        if (k.length < 4) k.length = 4;
        var n = v.length - 1,
            z = v[n],
            y = v[0],
            c = 2248228889 | 406206880,
            m,
            e,
            p,
            q = Math.floor(6 + 52 / (n + 1)),
            d = 0;
        while (0 < q--) {
            d = d + c & (2363546047 | 1931421248);
            e = d >>> 2 & 3;
            for (p = 0; p < n; p++) {
                y = v[p + 1];
                m = z >>> 5 ^ y << 2;
                m += y >>> 3 ^ z << 4 ^ (d ^ y);
                m += k[p & 3 ^ e] ^ z;
                z = v[p] = v[p] + m & (4021866800 | 273100495)
            }
            y = v[0];
            m = z >>> 5 ^ y << 2;
            m += y >>> 3 ^ z << 4 ^ (d ^ y);
            m += k[p & 3 ^ e] ^ z;
            z = v[n] = v[n] + m & (3141076802 | 1153890493)
        }
        return l(v, false)
    }

    function s(a, b) {
        var c = a.length;
        var v = [];
        for (var i = 0; i < c; i += 4) {
            v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 | a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24
        }
        if (b) v[v.length] = c;
        return v
    }

    function l(a, b) {
        var d = a.length;
        var c = d - 1 << 2;
        if (b) {
            var m = a[d - 1];
            if (m < c - 3 || m > c) return null;
            c = m
        }
        for (var i = 0; i < d; i++) {
            a[i] = String.fromCharCode(a[i] & 255, a[i] >>> 8 & 255, a[i] >>> 16 & 255, a[i] >>> 24 & 255)
        }
        return b ? a.join('').substring(0, c) : a.join('')
    }
    return '{SRBX1}' + base64.encode(encode(info, token))
}

async function login(obj) {
    var type = 1;
    var n = 200;
    var enc = 'srun_bx1';
    var username = _this.userInfo.username + _this.userInfo.domain;
    var password = _this.userInfo.password;
    var ac_id = _this.portalInfo.acid;
    var ip = obj.host ? '' : _this.userInfo.ip;
    let _login = async function(token) {
        var hmd5 = md5(password, token);
        var i = encodeUserInfo({
            username: username,
            password: password,
            ip: ip,
            acid: ac_id,
            enc_ver: enc
        }, token);
        var str = token + username;
        str += token + hmd5;
        str += token + ac_id;
        str += token + ip;
        str += token + n;
        str += token + type;
        str += token + i;

        const url = `http://portal.ucas.ac.cn${APIs.auth}`;
        // console.log(`Sending req to ${url}`);
        let ret = await axios.get(url, {
            // host: obj.host,
            params: {
                // ugly hard coded  parameter for jsonp emulation
                callback: "callback",
                action: 'login',
                username: username,
                password: _this.userInfo.otp ? '{OTP}' + password : '{MD5}' + hmd5,
                os: _this.portalInfo.userDevice.device,
                name: _this.portalInfo.userDevice.platform,
                double_stack: _this.portalInfo.doub && !obj.host ? 1 : 0,
                chksum: sha1(str),
                info: i,
                ac_id: ac_id,
                ip: ip,
                n: n,
                type: type
            },
        });

        function callback(data) {
            if (!data.suc_msg) {
                console.error(data);
            } else {
                console.log("succ msg:", data.suc_msg);
            }
        }
        ret = eval(ret.data);
    }
    await _login(_this.challenge)
}

(async () => {
    let ret = await getToken();
    _this.challenge = ret.challenge;
    if (!ret.challenge) {
        console.log("Cannot get challenge");
        return -1;
    }
    _this.userInfo.ip = ret.online_ip;
    _this.portalInfo.ipv4 = ret.online_ip;
    // console.log(_this);

    fake_obj = {}
    await login(fake_obj)
})()

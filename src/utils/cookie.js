/* eslint-disable */
export const setCookie = function (name, value, exdays = 0) {
    const cvalue = encodeURIComponent(JSON.stringify(value))
    if (exdays > 0) {
        const d = new Date().getTime() + exdays * 24 * 3600 * 1000
        // var d = new Date().getTime() + exdays * 24 * 3600 * 1000 + 8 * 3600 * 1000;
        const expires = 'expires=' + new Date(d).toUTCString()
        document.cookie = name + '=' + cvalue + ';' + expires + ';path=/'
    } else {
        const d = new Date().getTime() + 1000 * 60 * 60 * 2
        const expires = 'expires=' + new Date(d).toUTCString()
        document.cookie = name + '=' + cvalue + ';' + expires + ';path=/'
    }
}

export const getCookie = function (name) {
    name = name + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            const d = c.substring(name.length, c.length)
            return JSON.parse(decodeURIComponent(d))
        }
    }
    return null
}

export const deleteCookie = function (name) {
    var date = new Date()
    date.setTime(date.getTime() - 1)
    var delValue = getCookie(name)
    if (delValue) {
        document.cookie = name + '=' + delValue + ';expires=' + date.toGMTString()
    }
}
export const clearCookie = function (name) {
    setCookie(name, '', 0)
}

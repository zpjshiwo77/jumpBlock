class API {
    /**
     * Ajax方法
     * @param method
     * @param data
     */
    static iAjax(method, data = {}) {
        data.OpenId = WxStorage.openid;
        if (Laya.Browser.onMiniGame) {
            return API.WxAjax(method, data);
        }
        else {
            return new Promise((resolve, reject) => {
                API.normalAjax(method, data)
                    .then((res) => {
                    res = eval('(' + res + ')');
                    if (iMath.dataType(res) == "array" || res.errcode == 0)
                        resolve(res);
                    else
                        reject(res);
                });
            });
        }
    }
    /**
     * wx的ajax方法
     * @param method
     * @param data
     */
    static WxAjax(method, data) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    /**
     * 普通的ajax方法
     * @param method
     * @param data
     */
    static normalAjax(method, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('post', API.DominUrl + method);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let idata = "";
            for (let key in data) {
                idata += key + "=" + data[key] + "&";
            }
            idata = idata.substring(0, idata.length - 1);
            xhr.send(idata);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(xhr.responseText);
                }
            };
        });
    }
}
API.DominUrl = "";
//# sourceMappingURL=API.js.map
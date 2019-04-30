class WxStorage {
    /**
     * 初始化
     * @param env 数据库名称
     * @param callback 回调函数
     */
    static init(env, callback) {
        if (Laya.Browser.onMiniGame) {
            WxGame.wx.cloud.init({
                env: env,
                traceUser: true
            });
            WxStorage.db = WxGame.wx.cloud.database({
                env: env
            });
            WxGame.wx.cloud.callFunction({
                name: 'getopenid',
                complete: res => {
                    WxStorage.openid = res.result.OPENID;
                    callback.run();
                }
            });
        }
    }
    /**
     * 获取表
     * @param name 表名称
     */
    static getSheet(name) {
        return WxStorage.db.collection(name);
    }
    /**
     * 添加数据进入表
     * @param sheet 表
     * @param data 数据
     */
    static addDataToSheet(sheet, data) {
        sheet.add({
            data: data
        }).then(res => {
            console.log("addSocre success:" + res);
        });
    }
}
WxStorage.openid = "ofWGW5KjCA9L5cWT9toGq-sud0I4";
//# sourceMappingURL=WxStorage.js.map
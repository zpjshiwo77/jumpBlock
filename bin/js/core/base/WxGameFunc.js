class WxGame {
    /**
     * 初始化
     */
    static init() {
        if (Laya.Browser.onMiniGame) {
            WxGame.isWx = true;
            WxGame.wx = Laya.Browser.window.wx;
            WxGame.wxCreateUserInfo();
        }
    }
    /**
     * 初始化wx的授权按钮 暂时全屏显示 点一下就会授权成功
     */
    static wxCreateUserInfo() {
        if (this.wx.createUserInfoButton) {
            var systemInfo = this.wx.getSystemInfoSync();
            var button = this.wx.createUserInfoButton({
                type: 'image',
                image: 'common/blank.png',
                // text: 'test',
                style: {
                    // backgroundColor:"#ffffff",
                    left: 0,
                    top: 0,
                    width: systemInfo.screenWidth,
                    height: systemInfo.screenHeight
                }
            });
            button.onTap((res) => {
                if (res.errMsg == 'getUserInfo:fail auth deny') {
                    this.wx.showModal({
                        title: '提示',
                        content: '请同意授权才能继续游戏哦',
                        showCancel: false
                    });
                }
                else {
                    WxGame.userInfo = res.userInfo;
                    WxGame.auth = true;
                    button.destroy();
                }
            });
        }
    }
    /**
     * 检查更新
     */
    static checkUpdateGame() {
        if (Laya.Browser.onMiniGame) {
            if (WxGame.wx.getUpdateManager) {
                let updateManager = WxGame.wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {
                    if (res.hasUpdate) {
                        WxGame.wx.showLoading({
                            title: '升级中',
                            mask: true
                        });
                        updateManager.onUpdateReady(function (res) {
                            WxGame.wx.hideLoading();
                            WxGame.wx.showModal({
                                title: '升级提示',
                                content: '新版本已经准备好，是否重启应用？',
                                success: function (res) {
                                    if (res.confirm) {
                                        updateManager.applyUpdate();
                                    }
                                }
                            });
                        });
                        updateManager.onUpdateFailed(function () {
                            WxGame.wx.hideLoading();
                            WxGame.wx.showModal({
                                title: '升级失败',
                                content: '新版本下载失败，请检查网络！',
                                showCancel: false
                            });
                        });
                    }
                });
            }
        }
    }
    /**
     * 创建广告位
     * @param adId 广告位id
     */
    static craetADbaner(adId) {
        if (Laya.Browser.onMiniGame) {
            WxGame.bannerAd = WxGame.wx.createBannerAd({
                adUnitId: adId,
                style: {
                    left: (Laya.Browser.clientWidth - 300) / 2,
                    top: Laya.Browser.clientHeight - 100,
                    width: 1,
                }
            });
        }
    }
    /**
     * 设置微信存储
     * @param name key
     * @param val 值
     */
    static SetWxStorage(name, val) {
        if (Laya.Browser.onMiniGame) {
            WxGame.wx.setStorage({ key: name, data: val });
        }
    }
    /**
     * 读取微信存储
     * @param name key
     * @param success 成功的回调 返回参数res
     * @param fail 失败的回调 返回参数res
     */
    static GetWxStorage(name, success = null, fail = null) {
        if (Laya.Browser.onMiniGame) {
            WxGame.wx.getStorage({
                key: name,
                success: function (res) {
                    if (success)
                        success.runWith(res);
                },
                fail: function (res) {
                    if (fail)
                        fail.runWith(res);
                }
            });
        }
    }
    /**
     * 分享初始化
     * @param word 分享文案
     */
    static shareInit(word) {
        if (Laya.Browser.onMiniGame) {
            WxGame.wx.onShareAppMessage(function () {
                return { title: word, imageUrl: "share.jpg" };
            });
            WxGame.wx.showShareMenu();
        }
    } //end func
    /**
     * 分享游戏
     * @param word 分享文案
     */
    static shareTheGame(word) {
        if (Laya.Browser.onMiniGame) {
            WxGame.wx.shareAppMessage({
                title: word,
                imageUrl: "share.jpg"
            });
        }
    } //end func
    /**
     * 发送用户数据到公共域
     * @param name key
     * @param val 值
     */
    static setUserCloudStorage(name, val) {
        if (Laya.Browser.onMiniGame) {
            if (WxGame.wx.setUserCloudStorage) {
                WxGame.wx.setUserCloudStorage({
                    KVDataList: [
                        { key: name, value: val + "" }
                    ],
                    success: (res) => {
                        console.log('success:', res);
                    },
                    fail: (res) => {
                        console.log('fail:', res);
                    }
                });
            }
        }
    }
}
WxGame.auth = false;
WxGame.isWx = false;
//# sourceMappingURL=WxGameFunc.js.map
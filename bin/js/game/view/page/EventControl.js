class EventControl extends BaseView {
    constructor() {
        super();
        this.pressFlag = false;
        this.recordFlag = false;
        this.pressTime = 0;
        this.view = new ui.controlUI();
        this.AddToStage();
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        this.eventInit();
    }
    /**
     * 事件初始化
     */
    eventInit() {
        this.view.startbtn.on(Laya.Event.MOUSE_DOWN, this, this.startGame);
        this.view.control.on(Laya.Event.MOUSE_DOWN, this, this.press);
        this.view.control.on(Laya.Event.MOUSE_UP, this, this.release);
        Message.on("canPress", this, this.canPress);
    }
    /**
     * 可以按压
     */
    canPress() {
        this.pressFlag = true;
    }
    /**
     * 开始游戏
     */
    startGame() {
        this.view.score.visible = true;
        this.view.start.visible = false;
        Message.event("startGame");
    }
    /**
     * 按压
     */
    press() {
        if (this.pressFlag) {
            this.recordFlag = true;
            this.pressTime = 0;
            this.recordTime();
            Message.event("press");
        }
    }
    /**
     * 记录时间
     */
    recordTime() {
        this.pressTime += 17;
        if (this.recordFlag) {
            requestAnimationFrame(() => {
                this.recordTime();
            });
        }
    }
    /**
     * 释放
     */
    release() {
        if (this.recordFlag && this.pressFlag) {
            this.recordFlag = false;
            this.pressFlag = false;
            let time = this.pressTime > GameData.PRESS_TIME ? GameData.PRESS_TIME : this.pressTime;
            Message.event("release", [time]);
            this.pressTime = 0;
            this.pressFlag = false;
        }
    }
}
//# sourceMappingURL=EventControl.js.map
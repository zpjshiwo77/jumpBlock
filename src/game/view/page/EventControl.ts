class EventControl extends BaseView{
    private sprite: Laya.Sprite;
    private pressFlag: boolean = false;
    private recordFlag: boolean = false;
    private pressTime: number = 0;
    private score: number = 0;

    constructor() {
        super();
        this.view = new ui.controlUI();
        this.AddToStage();
        this.init();
    }

    /**
     * 初始化
     */
    private init():void{
       this.eventInit();
    }

    /**
     * 事件初始化
     */
    private eventInit():void{
        this.view.startbtn.on(Laya.Event.MOUSE_DOWN,this,this.startGame);
        this.view.againBtn.on(Laya.Event.MOUSE_DOWN,this,this.resetGame);

        this.view.control.on(Laya.Event.MOUSE_DOWN,this,this.press);
        this.view.control.on(Laya.Event.MOUSE_UP,this,this.release);

        Message.on("canPress",this,this.canPress);
        Message.on("addScore",this,this.addScore);
        Message.on("GameEnd",this,this.GameEnd);
    }

    /**
     * 重置游戏
     */
    private resetGame():void{
        this.view.score.text = this.score;
        this.view.endBox.visible = false;
        Message.event("resetGame");
    }

    /**
     * 游戏结束
     */
    private GameEnd():void{
        this.score = 0;
        this.pressTime = 0;
        this.pressFlag = false;
        this.recordFlag = false;
        this.view.endBox.visible = true;
    }

    /**
     * 加分
     */
    private addScore(score):void{
        this.score += score[0];
        this.view.score.text = this.score;
    }

    /**
     * 可以按压
     */
    private canPress():void{
        this.pressFlag = true;
    }

    /**
     * 开始游戏
     */
    private startGame():void{
        this.view.score.visible = true;
        this.view.start.visible = false;
        Message.event("startGame");
    }

    /**
     * 按压
     */
    private press():void{
        if(this.pressFlag){
            this.recordFlag = true;
            this.pressTime = 0;
            this.recordTime();
            Message.event("press")
        }
    }

    /**
     * 记录时间
     */
    private recordTime():void{
        this.pressTime += 17;
        if(this.recordFlag){
            requestAnimationFrame(()=>{
                this.recordTime();
            });
        }
    }

    /**
     * 释放
     */
    private release():void{
        if(this.recordFlag && this.pressFlag){
            this.recordFlag = false;
            this.pressFlag = false;
            let time = this.pressTime > GameData.PRESS_TIME ? GameData.PRESS_TIME : this.pressTime;
            Message.event("release",[time]);
            this.pressTime = 0
        }
    }
}
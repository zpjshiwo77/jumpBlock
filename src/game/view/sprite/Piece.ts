class Piece {
    private sprite: Laya.Sprite3D;
    private action: Laya.Animator;
    private pos: pos = {x:0,y:0,z:0};
    private rotateAnime: Sp_anime;
    private changeFlag = false;
    private change: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    private pressAnime: any = {
        p1:null,
        p2:null
    };

    constructor(sprite: Laya.Sprite3D,action: Laya.Animator) {
        this.sprite = sprite;
        this.action = action;
        this.init();
    }

    /**
     * 初始化
     */
    private init():void{
        this.action.paused = true;
        this.transform({x:0,y:0.2,z:0});
        this.pressAnimeInit();
        Message.on("piece_release2AnimeEnd",this,this.ReleaseEnd);
    }

    /**
     * 入场动画
     */
    public entering():void{
        let enterA = [];
        enterA[0] = Animeing.creatAnime(this.sprite,{y:-0.2,time:400},"piece_enter0");
        for (let i = 1; i < 6; i+=2) {
            let j = 6 - i;
            enterA[i] = Animeing.creatAnime(this.sprite,{y:0.003 * j,time:30*j},"piece_enter"+i);
            enterA[i+1] = Animeing.creatAnime(this.sprite,{y:-0.003 * j,time:40*j},"piece_enter"+(i+1));
        }
        for (let i = 1; i < enterA.length; i++) {
            let ele = enterA[i];
            Message.on("piece_enter"+(i-1)+"AnimeEnd",this,()=>{
                Animeing.destory("piece_enter"+(i-1));
                ele.play();
            });
        }
        enterA[0].play();
        Message.on("piece_enter"+(enterA.length-1)+"AnimeEnd",this,()=>{
            Animeing.destory("piece_enter"+(enterA.length-1));
            this.pos.y = 0;
            Message.event("canPress");
        });
    }

    /**
     * 按压动画初始化
     */
    private pressAnimeInit():void{
        this.pressAnime.p1 = Animeing.creatAnime(this.sprite,{sy:-0.5,time:GameData.PRESS_TIME},"piece_press1");
        this.pressAnime.p2 = Animeing.creatAnime(this.sprite,{y:-0.007,time:GameData.PRESS_TIME},"piece_press2");
        Message.on("piece_press1AnimeEnd",this,this.recordChangeVal1);
        Message.on("piece_press2AnimeEnd",this,this.recordChangeVal2);
    }

    /**
     * 记录改变的值
     */
    private recordChangeVal1(val):void{
        let change = val[0];
        this.change.sy = change.sy;
        this.changeFlag = true;
    }

    /**
     * 记录改变的值
     */
    private recordChangeVal2(val):void{
        let change = val[0];
        this.change.y = change.y;
        this.changeFlag = true;
    }

    /**
     * 按压棋子
     */
    public Press():void{
        this.changeFlag = false;
        this.pressAnime.p1.play();
        this.pressAnime.p2.play();
    }

    /**
     * 释放棋子
     */
    public Release():void{
        if(!this.changeFlag) {
            this.pressAnime.p1.stop();
            this.pressAnime.p2.stop();
        }
        let anime1 = Animeing.creatAnime(this.sprite,{sy:-this.change.sy,time:60},"piece_release1");
        let anime2 = Animeing.creatAnime(this.sprite,{y:-this.change.y,time:60},"piece_release2");
        anime1.play();
        anime2.play();
        
    }

    /**
     * 释放结束
     */
    public ReleaseEnd(){
        Animeing.destory("piece_release1");
        Animeing.destory("piece_release2");
        Message.event("canPress");
    }

    /**
     * 旋转
     */
    public rotating():void{
        if(this.rotateAnime){
            this.rotateAnime.play();
        }
        else{
            let opts = {
                rx:360,
                time:1000
            }
            this.rotateAnime = Animeing.creatAnime(this.sprite,opts,"piece_rotate");
            this.rotateAnime.play();
        }
    }

    /**
     * 修改位置
     */
    public transform(pos:pos):void{
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        let translate = new Laya.Vector3()
        let opos = this.sprite.transform.localPosition;
        translate.x = opos.x + pos.x;
        translate.y = opos.y + pos.y;
        translate.z = opos.z + pos.z;
        this.sprite.transform.localPosition = translate;
    }
}
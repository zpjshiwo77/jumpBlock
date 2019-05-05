class Piece {
    private sprite: Laya.Sprite3D;
    private action: Laya.Animator;
    public pos: pos = {x:0,y:0,z:0};
    private rotate: pos = {x:0,y:0,z:0};
    private rotateAnime: Sp_anime;
    private changeFlag = false;
    private change: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    private pressAnime: any = {
        p1:null,
        p2:null
    };
    private DieAnime: any[] = [];

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
        this.transform({x:0,y:GameData.Y_POS,z:0});
        this.pressAnimeInit();
        this.rotateAnimeInit();
        this.dieAnimeInit();
        Message.on("piece_release2AnimeEnd",this,this.ReleaseEnd);
    }

    /**
     * 失败动画初始化
     */
    private dieAnimeInit():void{
        this.DieAnime[0] = Animeing.creatAnime(this.sprite,{rx:90,time:500},"piece_die0");
        this.DieAnime[1] = Animeing.creatAnime(this.sprite,{rx:-90,time:500},"piece_die1");
        this.DieAnime[2] = Animeing.creatAnime(this.sprite,{y:-0.01,time:500},"piece_die2");
        Message.on("piece_die2AnimeEnd",this,()=>{
            Message.event("GameEnd");
        });
    }

    /**
     * 播放失败的动画
     * @param type 失败类型
     */
    public dieAnime(type:number = 0):void{
        if(type == 1) {
            this.rotate.x += 90;
            this.DieAnime[0].play();
            
        }
        else if(type == 2) {
            this.rotate.x += -90;
            this.DieAnime[1].play();
        }
        this.pos.y += -0.01;
        this.DieAnime[2].play();
    }

    /**
     * 入场动画
     */
    public entering():void{
        let enterA = [];
        enterA[0] = Animeing.creatAnime(this.sprite,{y:-GameData.Y_POS,time:400},"piece_enter0");
        for (let i = 1; i < 6; i+=2) {
            let j = 6 - i;
            enterA[i] = Animeing.creatAnime(this.sprite,{y:0.003 * j,time:30*j},"piece_enter"+i);
            enterA[i+1] = Animeing.creatAnime(this.sprite,{y:-0.003 * j,time:40*j},"piece_enter"+(i+1));
        }
        for (let i = 1; i < enterA.length; i++) {
            let ele = enterA[i];
            Message.once("piece_enter"+(i-1)+"AnimeEnd",this,()=>{
                Animeing.destory("piece_enter"+(i-1));
                ele.play();
            });
        }
        enterA[0].play();
        Message.once("piece_enter"+(enterA.length-1)+"AnimeEnd",this,()=>{
            Animeing.destory("piece_enter"+(enterA.length-1));
            this.pos.y = 0;
            Message.event("canPress");
        });
    }

    /**
     * 重置位置
     */
    public resetPos():void{
        this.transform({x:-this.pos.x,y:-this.pos.y,z:-this.pos.z});
        this.rotatePos({x:-this.rotate.x,y:-this.rotate.y,z:-this.rotate.z});
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
    public ReleaseEnd():void{
        Animeing.destory("piece_release1");
        Animeing.destory("piece_release2");
        Message.event("pieceJump");
    }

    /**
     * 移动棋子
     * @param pos 棋子的位置
     */
    public MoveAnime(pos:pos,time:number,callback?:Function):void{
        let animeOpts:animeOpts = {time:time};
        animeOpts.x = pos.x;
        animeOpts.y = pos.y;
        animeOpts.z = pos.z;
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        let anime = Animeing.creatAnime(this.sprite,animeOpts,"PieceMoveAnime");
        anime.play();
        Message.once("PieceMoveAnimeAnimeEnd",this,()=>{
            Animeing.destory("PieceMoveAnime");
            if(callback) callback();
        });
    }
    
    /**
     * 来回移动棋子
     * @param pos 棋子的位置
     */
    public CycleMoveAnime(pos:pos,time:number):void{
        let animeOpts:animeOpts = {time:time/5*2};
        animeOpts.x = pos.x;
        animeOpts.y = pos.y;
        animeOpts.z = pos.z;
        let anime = Animeing.creatAnime(this.sprite,animeOpts,"PieceCycle1");
        anime.play();
        Message.once("PieceCycle1AnimeEnd",this,()=>{
            animeOpts.time = time/5*3;
            animeOpts.x = -animeOpts.x;
            animeOpts.y = -animeOpts.y;
            animeOpts.z = -animeOpts.z;
            let anime = Animeing.creatAnime(this.sprite,animeOpts,"PieceCycle2");
            anime.play();
        });
        Message.once("PieceCycle2AnimeEnd",this,()=>{
            Animeing.destory("PieceCycle1");
            Animeing.destory("PieceCycle2");
        });
    }

    /**
     * 旋转动画初始化
     */
    public rotateAnimeInit():void{
        let opts = {
            rx:360,
            time:GameData.JUMP_TIME
        }
        this.rotateAnime = Animeing.creatAnime(this.sprite,opts,"piece_rotate");
    }

    /**
     * 旋转
     */
    public rotating():void{
        this.rotateAnime.play();
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

    /**
     * 修改旋转位置
     */
    public rotatePos(pos:pos):void{
        this.sprite.transform.rotate(new Laya.Vector3(pos.x,pos.y,pos.z),false,false);
        this.rotate.x += pos.x;
        this.rotate.y += pos.y;
        this.rotate.z += pos.z;
    }
}
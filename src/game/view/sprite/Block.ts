class Block {
    private ID: number = iMath.randomRange(1,100000);
    private sprite: Laya.Sprite3D;
    private pos: pos = {x:0,y:0,z:0};
    private changeFlag = false;
    private change: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    private pressAnime: Sp_anime;
    

    constructor(sprite: Laya.Sprite3D) {
        this.sprite = sprite;
        this.init();
    }

    /**
     * 初始化
     */
    private init():void{
        this.pressAnimeInit();
    }

    /**
     * 按压动画初始化
     */
    private pressAnimeInit():void{
        this.pressAnime = Animeing.creatAnime(this.sprite,{sy:-0.2,time:GameData.PRESS_TIME},"block_press"+this.ID);
        Message.on("block_press"+this.ID+"AnimeEnd",this,this.recordChangeVal);
    }

    /**
     * 记录改变的值
     */
    private recordChangeVal(val):void{
        this.change = val[0];
        this.changeFlag = true;
    }

    /**
     * 按压方块
     */
    public Press():void{
        this.changeFlag = false;
        this.pressAnime.play();
    }

    /**
     * 入场动画
     */
    public entering(callback?:Function):void{
        let enterA = [];
        enterA[0] = Animeing.creatAnime(this.sprite,{y:-GameData.Y_POS,time:400},"block"+this.ID+"_enter0");
        for (let i = 1; i < 6; i+=2) {
            let j = 6 - i;
            enterA[i] = Animeing.creatAnime(this.sprite,{y:0.003 * j,time:30*j},"block"+this.ID+"_enter"+i);
            enterA[i+1] = Animeing.creatAnime(this.sprite,{y:-0.003 * j,time:40*j},"block"+this.ID+"_enter"+(i+1));
        }
        for (let i = 1; i < enterA.length; i++) {
            let ele = enterA[i];
            Message.once("block"+this.ID+"_enter"+(i-1)+"AnimeEnd",this,()=>{
                Animeing.destory("block"+this.ID+"_enter"+(i-1));
                ele.play();
            });
        }
        enterA[0].play();
        Message.once("block"+this.ID+"_enter"+(enterA.length-1)+"AnimeEnd",this,()=>{
            this.pos.y = 0;
            if(callback) callback();
            Animeing.destory("block"+this.ID+"_enter"+(enterA.length-1));
        });
    }

    /**
     * 重置位置
     */
    public resetPos():void{
        this.transform({x:-this.pos.x,y:-this.pos.y,z:-this.pos.z});
    }

    /**
     * 移动
     * @param pos 移动的距离
     */
    public MoveAnime(pos:pos,time:number,callback?:Function):void{
        let animeOpts:animeOpts = {time:time};
        animeOpts.x = pos.x;
        animeOpts.y = pos.y;
        animeOpts.z = pos.z;
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        let anime = Animeing.creatAnime(this.sprite,animeOpts,"BlockMoveAnime"+this.ID);
        anime.play();
        Message.once("BlockMoveAnime"+this.ID+"AnimeEnd",this,()=>{
            Animeing.destory("BlockMoveAnime"+this.ID);
            if(callback) callback();
        });
    }

    /**
     * 释放方块
     */
    public Release():void{
        let Anime_name = "block_release"+this.ID;
        if(!this.changeFlag) this.pressAnime.stop();
        let anime = Animeing.creatAnime(this.sprite,{sy:-this.change.sy,time:60},Anime_name);
        anime.play();
        Message.on(Anime_name+"AnimeEnd",this,()=>{
            Animeing.destory(Anime_name);
        });
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
class SpritItem {
    protected ID:number = iMath.randomRange(1,100000);
    protected sprite: Laya.Sprite3D;
    public o_pos: Laya.Vector3;
    public pos: pos = {x:0,y:0,z:0};
    private changeFlag = false;
    private change: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    private pressAnime: Sp_anime;
    private pressOpts: any = {time:GameData.PRESS_TIME};

    constructor(sprite: Laya.Sprite3D) {
        this.sprite = sprite;
        this.o_pos = this.sprite.transform.localPosition;
    }

    /**
     * 按压动画初始化
     */
    protected pressAnimeInit(sy:number,y?:number):void{
        if(y) this.pressOpts.y = y;
        if(sy) this.pressOpts.sy = sy;
        this.pressAnime = Animeing.creatAnime(this.sprite,this.pressOpts,"press"+this.ID);
        Message.on("press"+this.ID+"AnimeEnd",this,this.recordChangeVal);
    }

    /**
     * 记录改变的值
     */
    private recordChangeVal(val):void{
        this.change = val[0];
        this.changeFlag = true;
    }

    /**
     * 按压
     */
    public Press():void{
        this.changeFlag = false;
        this.pressAnime.play();
    }

    /**
     * 释放
     */
    public Release(callback?:Function):void{
        let Anime_name = "release"+this.ID;
        if(!this.changeFlag) this.pressAnime.stop();
        let anime = Animeing.creatAnime(this.sprite,{y:-this.change.y,sy:-this.change.sy,time:68},Anime_name);
        anime.play();
        Message.once(Anime_name+"AnimeEnd",this,()=>{
            Animeing.destory(Anime_name);
            if(callback) callback();
        });
    }

    /**
     * 入场动画
     */
    public entering(callback?:Function):void{
        let enterA = [];
        enterA[0] = Animeing.creatAnime(this.sprite,{y:-GameData.Y_POS,time:400},"Sprite"+this.ID+"_enter0");
        for (let i = 1; i < 6; i+=2) {
            let j = 6 - i;
            enterA[i] = Animeing.creatAnime(this.sprite,{y:0.003 * j,time:30*j},"Sprite"+this.ID+"_enter"+i);
            enterA[i+1] = Animeing.creatAnime(this.sprite,{y:-0.003 * j,time:40*j},"Sprite"+this.ID+"_enter"+(i+1));
        }
        for (let i = 1; i < enterA.length; i++) {
            let ele = enterA[i];
            Message.once("Sprite"+this.ID+"_enter"+(i-1)+"AnimeEnd",this,()=>{
                Animeing.destory("Sprite"+this.ID+"_enter"+(i-1));
                ele.play();
            });
        }
        enterA[0].play();
        Message.once("Sprite"+this.ID+"_enter"+(enterA.length-1)+"AnimeEnd",this,()=>{
            this.pos.y = 0;
            if(callback) callback();
            Animeing.destory("Sprite"+this.ID+"_enter"+(enterA.length-1));
        });
    }

    /**
     * 重置位置
     */
    public resetPos():void{
        this.sprite.transform.localPosition = this.o_pos;
        this.pos = {x:0,y:0,z:0};
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
        let anime = Animeing.creatAnime(this.sprite,animeOpts,"MoveAnime"+this.ID);
        anime.play();
        Message.once("MoveAnime"+this.ID+"AnimeEnd",this,()=>{
            Animeing.destory("MoveAnime"+this.ID);
            if(callback) callback();
        });
    }
}
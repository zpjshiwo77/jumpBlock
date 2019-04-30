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
     * 释放方块
     */
    public Release():void{
        let Anime_name = "block_release"+this.ID;
        if(!this.changeFlag) this.pressAnime.stop();
        let anime = Animeing.creatAnime(this.sprite,{sy:-this.change.sy,time:60},Anime_name);
        anime.play();
        Message.on(Anime_name+"AnimeEnd",this,()=>{
            Animeing.destory(Anime_name+"AnimeEnd");
        });
    }

    /**
     * 修改位置
     */
    public transform(pos:pos):void{
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        this.sprite.transform.translate(new Laya.Vector3(pos.x,pos.y,pos.z),false);
    }
}
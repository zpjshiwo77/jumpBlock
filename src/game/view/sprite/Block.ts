class Block extends SpritItem{
    public RTIGHT_POS:pos = {x:-0.04,y:0,z:0.02};

    constructor(sprite: Laya.Sprite3D) {
        super(sprite);
        this.init();
    }

    /**
     * 初始化
     */
    private init():void{
        this.pressAnimeInit(-0.2);
    }
}
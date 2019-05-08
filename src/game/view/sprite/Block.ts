class Block extends SpritItem{
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
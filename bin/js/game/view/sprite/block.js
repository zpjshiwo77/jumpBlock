class Block {
    constructor(sprite) {
        this.ID = iMath.randomRange(1, 100000);
        this.pos = { x: 0, y: 0, z: 0 };
        this.changeFlag = false;
        this.change = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 0, sy: 0, sz: 0 };
        this.sprite = sprite;
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        this.pressAnimeInit();
    }
    /**
     * 按压动画初始化
     */
    pressAnimeInit() {
        this.pressAnime = Animeing.creatAnime(this.sprite, { sy: -0.2, time: GameData.PRESS_TIME }, "block_press" + this.ID);
        Message.on("block_press" + this.ID + "AnimeEnd", this, this.recordChangeVal);
    }
    /**
     * 记录改变的值
     */
    recordChangeVal(val) {
        this.change = val[0];
        this.changeFlag = true;
    }
    /**
     * 按压方块
     */
    Press() {
        this.changeFlag = false;
        this.pressAnime.play();
    }
    /**
     * 入场动画
     */
    entering(callback) {
        let enterA = [];
        enterA[0] = Animeing.creatAnime(this.sprite, { y: -GameData.Y_POS, time: 400 }, "block" + this.ID + "_enter0");
        for (let i = 1; i < 6; i += 2) {
            let j = 6 - i;
            enterA[i] = Animeing.creatAnime(this.sprite, { y: 0.003 * j, time: 30 * j }, "block" + this.ID + "_enter" + i);
            enterA[i + 1] = Animeing.creatAnime(this.sprite, { y: -0.003 * j, time: 40 * j }, "block" + this.ID + "_enter" + (i + 1));
        }
        for (let i = 1; i < enterA.length; i++) {
            let ele = enterA[i];
            Message.once("block" + this.ID + "_enter" + (i - 1) + "AnimeEnd", this, () => {
                Animeing.destory("block" + this.ID + "_enter" + (i - 1));
                ele.play();
            });
        }
        enterA[0].play();
        Message.once("block" + this.ID + "_enter" + (enterA.length - 1) + "AnimeEnd", this, () => {
            this.pos.y = 0;
            if (callback)
                callback();
            Animeing.destory("block" + this.ID + "_enter" + (enterA.length - 1));
        });
    }
    /**
     * 重置位置
     */
    resetPos() {
        this.transform({ x: -this.pos.x, y: -this.pos.y, z: -this.pos.z });
    }
    /**
     * 移动
     * @param pos 移动的距离
     */
    MoveAnime(pos, time, callback) {
        let animeOpts = { time: time };
        animeOpts.x = pos.x;
        animeOpts.y = pos.y;
        animeOpts.z = pos.z;
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        let anime = Animeing.creatAnime(this.sprite, animeOpts, "BlockMoveAnime" + this.ID);
        anime.play();
        Message.once("BlockMoveAnime" + this.ID + "AnimeEnd", this, () => {
            Animeing.destory("BlockMoveAnime" + this.ID);
            if (callback)
                callback();
        });
    }
    /**
     * 释放方块
     */
    Release() {
        let Anime_name = "block_release" + this.ID;
        if (!this.changeFlag)
            this.pressAnime.stop();
        let anime = Animeing.creatAnime(this.sprite, { sy: -this.change.sy, time: 60 }, Anime_name);
        anime.play();
        Message.on(Anime_name + "AnimeEnd", this, () => {
            Animeing.destory(Anime_name);
        });
    }
    /**
     * 修改位置
     */
    transform(pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        this.pos.z += pos.z;
        let translate = new Laya.Vector3();
        let opos = this.sprite.transform.localPosition;
        translate.x = opos.x + pos.x;
        translate.y = opos.y + pos.y;
        translate.z = opos.z + pos.z;
        this.sprite.transform.localPosition = translate;
    }
}
//# sourceMappingURL=Block.js.map
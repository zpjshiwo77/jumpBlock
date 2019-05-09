class Piece extends SpritItem {
    constructor(sprite, action) {
        super(sprite);
        this.rotateAnime = [];
        this.DieAnime = [];
        this.action = action;
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        this.action.paused = true;
        this.transform({ x: 0, y: GameData.Y_POS, z: 0 });
        this.pressAnimeInit(-0.5, -0.007);
        this.rotateAnimeInit();
        this.dieAnimeInit();
        this.o_rotate = this.sprite.transform.localRotationEuler;
    }
    /**
     * 失败动画初始化
     */
    dieAnimeInit() {
        this.DieAnime[0] = Animeing.creatAnime(this.sprite, { rx: 90, time: 500 }, "piece_die0");
        this.DieAnime[1] = Animeing.creatAnime(this.sprite, { rx: -90, time: 500 }, "piece_die1");
        this.DieAnime[2] = Animeing.creatAnime(this.sprite, { rz: 90, time: 500 }, "piece_die2");
        this.DieAnime[3] = Animeing.creatAnime(this.sprite, { rz: -90, time: 500 }, "piece_die3");
        this.DieAnime[4] = Animeing.creatAnime(this.sprite, { y: -0.01, time: 500 }, "piece_die4");
        Message.on("piece_die4AnimeEnd", this, () => {
            Message.event("GameEnd");
        });
    }
    /**
     * 播放失败的动画
     * @param type 失败类型
     */
    dieAnime(type = 0, dir) {
        if (type == 1 && dir == 0)
            this.DieAnime[0].play();
        else if (type == 2 && dir == 0)
            this.DieAnime[1].play();
        else if (type == 1 && dir == 1)
            this.DieAnime[3].play();
        else if (type == 2 && dir == 1)
            this.DieAnime[2].play();
        this.pos.y += -0.01;
        this.DieAnime[4].play();
    }
    /**
     * 重置位置
     */
    resetPos() {
        this.sprite.transform.localPosition = this.o_pos;
        this.pos = { x: 0, y: 0, z: 0 };
        this.sprite.transform.localRotationEuler = this.o_rotate;
    }
    /**
     * 来回移动棋子
     * @param pos 棋子的位置
     */
    CycleMoveAnime(pos, time) {
        let O_pos = this.sprite.transform.localPosition;
        Laya.Tween.to(O_pos, {
            y: O_pos.y + pos.y,
            update: new Laya.Handler(this, () => {
                this.sprite.transform.localPosition.y = O_pos.y;
            })
        }, time / 2, Laya.Ease.sineOut, new Laya.Handler(this, () => {
            Laya.Tween.to(O_pos, {
                y: O_pos.y - pos.y,
                update: new Laya.Handler(this, () => {
                    this.sprite.transform.localPosition.y = O_pos.y;
                })
            }, time / 2, Laya.Ease.sineIn);
        }));
    }
    /**
     * 旋转动画初始化
     */
    rotateAnimeInit() {
        this.rotateAnime[0] = Animeing.creatAnime(this.sprite, { rx: 360, time: GameData.JUMP_TIME }, "piece_rotate0");
        this.rotateAnime[1] = Animeing.creatAnime(this.sprite, { rz: -360, time: GameData.JUMP_TIME }, "piece_rotate1");
    }
    /**
     * 旋转
     */
    rotating(dir) {
        this.rotateAnime[dir].play();
    }
}
//# sourceMappingURL=Piece.js.map
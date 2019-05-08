class Piece extends SpritItem {
    constructor(sprite, action) {
        super(sprite);
        this.rotate = { x: 0, y: 0, z: 0 };
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
    }
    /**
     * 失败动画初始化
     */
    dieAnimeInit() {
        this.DieAnime[0] = Animeing.creatAnime(this.sprite, { rx: 90, time: 500 }, "piece_die0");
        this.DieAnime[1] = Animeing.creatAnime(this.sprite, { rx: -90, time: 500 }, "piece_die1");
        this.DieAnime[2] = Animeing.creatAnime(this.sprite, { y: -0.01, time: 500 }, "piece_die2");
        Message.on("piece_die2AnimeEnd", this, () => {
            Message.event("GameEnd");
        });
    }
    /**
     * 播放失败的动画
     * @param type 失败类型
     */
    dieAnime(type = 0) {
        if (type == 1) {
            this.rotate.x += 90;
            this.DieAnime[0].play();
        }
        else if (type == 2) {
            this.rotate.x += -90;
            this.DieAnime[1].play();
        }
        this.pos.y += -0.01;
        this.DieAnime[2].play();
    }
    /**
     * 重置位置
     */
    resetPos() {
        this.transform({ x: -this.pos.x, y: -this.pos.y, z: -this.pos.z });
        this.rotatePos({ x: -this.rotate.x, y: -this.rotate.y, z: -this.rotate.z });
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
        let opts = {
            rx: 360,
            time: GameData.JUMP_TIME
        };
        this.rotateAnime = Animeing.creatAnime(this.sprite, opts, "piece_rotate");
    }
    /**
     * 旋转
     */
    rotating() {
        this.rotateAnime.play();
    }
    /**
     * 修改旋转位置
     */
    rotatePos(pos) {
        this.sprite.transform.rotate(new Laya.Vector3(pos.x, pos.y, pos.z), false, false);
        this.rotate.x += pos.x;
        this.rotate.y += pos.y;
        this.rotate.z += pos.z;
    }
}
//# sourceMappingURL=Piece.js.map
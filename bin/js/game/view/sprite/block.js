class Block extends SpritItem {
    constructor(sprite) {
        super(sprite);
        this.RTIGHT_POS = { x: -0.04, y: 0, z: 0.02 };
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        this.pressAnimeInit(-0.2);
    }
}
//# sourceMappingURL=Block.js.map
class GameMain {
    constructor() {
        this.Blocks = [];
        this.init();
    }
    init() {
        this.senceInit();
        this.eventInit();
        Animeing.run();
    }
    /**
     * 事件初始化
     */
    eventInit() {
        new EventControl();
        Message.on("press", this, this.piecePress);
        Message.on("release", this, this.pieceRelease);
        Message.on("startGame", this, this.startGame);
    }
    /**
     * 开始游戏
     */
    startGame() {
        this.Piece.entering();
    }
    /**
     * 按压棋子
     */
    piecePress() {
        this.Piece.Press();
        this.Blocks[0].Press();
    }
    /**
     * 棋子释放
     */
    pieceRelease(time) {
        this.Piece.Release();
        this.Blocks[0].Release();
    }
    /**
     * 棋子跳起来
     */
    pieceJump() {
    }
    /**
     * sence初始化
     */
    senceInit() {
        this.scene = Laya.loader.getRes("sprite_block/jumpBlock.ls");
        Laya.stage.addChild(this.scene);
        this.Father = this.scene.getChildByName("moxing");
        this.creatCamera();
        this.creatBlock();
        this.creatPiece();
    }
    /**
     * 创建棋子
     */
    creatPiece() {
        this.Piece = new Piece(this.Father.getChildByName("boy"), this.Father.getComponentByType(Laya.Animator));
    }
    /**
     * 创建块
     */
    creatBlock() {
        let box = this.Father.getChildByName("aa:polySurface1");
        let block = box.getChildByName("box");
        this.Blocks.push(new Block(block));
        for (let i = 0; i < GameData.BLOCK_NUM - 1; i++) {
            let item = block.clone();
            let blockItem = new Block(item);
            box.addChild(item);
            if (i == 0)
                blockItem.transform({ x: 0, y: 0, z: 0.15 });
            else
                blockItem.transform({ x: 0, y: 0.5, z: 0 });
            this.Blocks.push(blockItem);
        }
    }
    /**
     * 创建相机
     */
    creatCamera() {
        this.camera = this.scene.getChildByName("Camera");
    }
}
//# sourceMappingURL=GameMain.js.map
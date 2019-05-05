class GameMain {
    constructor() {
        this.Blocks = [];
        this.Block_dis = GameData.BLOCK_POS_Z;
        this.Now_Block_id = 0;
        this.Press_time = 0;
        this.Piece_move_dis = 0;
        this.Offset_dis = 0;
        this.Sence_blocks = [];
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
        Message.on("pieceJump", this, this.pieceJump);
        Message.on("resetGame", this, this.resetGame);
    }
    /**
     * 开始游戏
     */
    startGame() {
        this.Piece.entering();
    }
    /**
     * 重置游戏
     */
    resetGame() {
        this.Block_dis = GameData.BLOCK_POS_Z;
        this.Now_Block_id = 0;
        this.Press_time = 0;
        this.Piece_move_dis = 0;
        this.Offset_dis = 0;
        for (let i = 0; i < this.Blocks.length; i++) {
            let block = this.Blocks[i];
            block.resetPos();
        }
        this.resetBlockPos();
        this.Piece.resetPos();
        this.Piece.transform({ x: 0, y: GameData.Y_POS, z: 0 });
        this.startGame();
    }
    /**
     * 按压棋子
     */
    piecePress() {
        this.Piece.Press();
        this.Blocks[this.Now_Block_id].Press();
    }
    /**
     * 棋子释放
     */
    pieceRelease(time) {
        this.Piece.Release();
        this.Blocks[this.Now_Block_id].Release();
        this.Press_time = time;
    }
    /**
     * 棋子跳起来
     */
    pieceJump() {
        this.Piece.rotating();
        let dis = 0.00015 * this.Press_time;
        dis = dis > 0.1 ? 0.1 : dis;
        dis = dis < 0.05 ? 0.05 : dis;
        this.Piece_move_dis = 0.0001 * this.Press_time;
        // this.Piece_move_dis = 0.016
        this.Piece.CycleMoveAnime({ x: 0, y: dis, z: 0 }, GameData.JUMP_TIME);
        this.Piece.MoveAnime({ x: 0, y: 0, z: this.Piece_move_dis }, GameData.JUMP_TIME, () => {
            this.EndStatesJudge();
        });
    }
    /**
     * 结束状态判断
     */
    EndStatesJudge() {
        let move_dis = this.Piece_move_dis + this.Offset_dis;
        // Log.echo(this.Piece_move_dis,this.Offset_dis);
        if (move_dis < 0.015) {
            this.Offset_dis += this.Piece_move_dis;
            Message.event("canPress");
        }
        else if (move_dis >= 0.015 && move_dis < 0.02) {
            this.Piece.dieAnime(1);
        }
        else if (move_dis >= 0.02 && move_dis < this.Block_dis - 0.02) {
            this.Piece.dieAnime();
        }
        else if (move_dis >= this.Block_dis - 0.02 && move_dis <= this.Block_dis - 0.015) {
            this.Piece.dieAnime(2);
        }
        else if (move_dis > this.Block_dis - 0.015 && move_dis < this.Block_dis + 0.015) {
            this.SenceMove();
            Message.event("addScore", [1]);
        }
        else if (move_dis >= this.Block_dis + 0.015 && move_dis < this.Block_dis + 0.02) {
            this.Piece.dieAnime(1);
        }
        else if (move_dis >= this.Block_dis + 0.02) {
            this.Piece.dieAnime();
        }
    }
    /**
     * 场景移动
     */
    SenceMove() {
        let move_dis = -this.Block_dis;
        this.Piece.MoveAnime({ x: 0, y: 0, z: move_dis }, 500, () => {
            this.Offset_dis = this.Piece.pos.z;
            this.addBlockToSence();
        });
        for (let i = 0; i < this.Sence_blocks.length; i++) {
            let block = this.Sence_blocks[i];
            block.MoveAnime({ x: 0, y: 0, z: move_dis }, 500);
        }
    }
    /**
     * 新增一个块到场景
     */
    addBlockToSence() {
        this.Now_Block_id++;
        this.Now_Block_id = this.Now_Block_id > GameData.BLOCK_NUM - 1 ? 0 : this.Now_Block_id;
        let nextID = this.Now_Block_id + 1;
        nextID = nextID > GameData.BLOCK_NUM - 1 ? 0 : nextID;
        let NextBlock = this.Blocks[nextID];
        this.Block_dis = iMath.randomRange(4, 8) / 100;
        NextBlock.transform({ x: 0, y: 0, z: this.Block_dis });
        NextBlock.entering(() => {
            this.Sence_blocks.push(NextBlock);
            this.checkSenceBlocks();
            this.Press_time = 0;
            this.Piece_move_dis = 0;
            Message.event("canPress");
        });
    }
    /**
     * 检查场景里面盒子的数量
     */
    checkSenceBlocks() {
        if (this.Sence_blocks.length > 4) {
            let block = this.Sence_blocks.shift();
            block.resetPos();
            block.transform({ x: 0, y: GameData.Y_POS, z: 0 });
        }
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
        let first = new Block(block);
        this.Blocks.push(first);
        for (let i = 0; i < GameData.BLOCK_NUM - 1; i++) {
            let item = block.clone();
            let blockItem = new Block(item);
            box.addChild(item);
            this.Blocks.push(blockItem);
        }
        this.resetBlockPos();
    }
    /**
     * 重置块的位置
     */
    resetBlockPos() {
        this.Sence_blocks = [];
        for (let i = 0; i < this.Blocks.length; i++) {
            let item = this.Blocks[i];
            if (i == 0) {
                this.Sence_blocks.push(item);
            }
            else if (i == 1) {
                item.transform({ x: 0, y: 0, z: this.Block_dis });
                this.Sence_blocks.push(item);
            }
            else
                item.transform({ x: 0, y: GameData.Y_POS, z: 0 });
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
class GameMain{
    private scene: Laya.Scene;
    private camera: Laya.Camera;
    private Father: Laya.Sprite3D;

    private Piece: Piece;
    private Blocks: Block[] = [];
    private Sence_blocks: Block[] = [];

    private Now_Block_id: number = 0;

    private Block_dis:number = GameData.BLOCK_POS_Z;
    private Offset_dis: number = 0;
    private Move_dir: number = 0;
    private Change_dir: boolean = false;

    private Press_time: number = 0;
    private Piece_move_dis: number = 0;
    
    constructor(){
        this.init();
    }

    public init():void{
        this.senceInit();
        this.eventInit();
        Animeing.run();
    }

    /**
     * 事件初始化
     */
    public eventInit():void{
        new EventControl();
        Message.on("press",this,this.piecePress);
        Message.on("release",this,this.pieceRelease);
        Message.on("startGame",this,this.startGame);
        Message.on("resetGame",this,this.resetGame);
    }

    /**
     * 开始游戏
     */
    private startGame():void{
        this.Piece.entering(()=>{
            Message.event("canPress");
        });
    }

    /**
     * 重置游戏
     */
    private resetGame():void{
        this.Block_dis = GameData.BLOCK_POS_Z;
        this.Now_Block_id = 0;
        this.Press_time = 0;
        this.Piece_move_dis = 0;
        this.Offset_dis = 0;
        this.Move_dir = 0;
        this.Change_dir = false;

        for (let i = 0; i < this.Blocks.length; i++) {
            let block = this.Blocks[i];
            block.resetPos();
        }
        this.resetBlockPos();

        this.Piece.resetPos();
        this.Piece.transform({x:0,y:GameData.Y_POS,z:0});
        this.startGame();
    }

    /**
     * 按压棋子
     */
    private piecePress():void{
        this.Piece.Press();
        this.Blocks[this.Now_Block_id].Press();
    }

    /**
     * 棋子释放
     */
    private pieceRelease(time): void{
        this.Piece.Release(()=>{
            this.pieceJump();
        });
        this.Blocks[this.Now_Block_id].Release();
        this.Press_time = time;
    }

    /**
     * 棋子跳起来
     */
    private pieceJump(): void{
        let dis = 0.00015 * this.Press_time;
        dis = dis > 0.1 ? 0.1 : dis; 
        dis = dis < 0.05 ? 0.05 : dis;
        this.Piece_move_dis = 0.0001 * this.Press_time;
        let opts = this.Move_dir == 1 ? {x:this.Piece_move_dis,y:0,z:0} : {x:0,y:0,z:this.Piece_move_dis};
        if(this.Change_dir) this.Move_dir == 1 ? opts.z = -this.Offset_dis : opts.x = -this.Offset_dis;
        // this.Piece_move_dis = 0.016
        
        this.Piece.rotating(this.Move_dir);
        this.Piece.CycleMoveAnime({x:0,y:dis,z:0},GameData.JUMP_TIME);
        this.Piece.MoveAnime(opts,GameData.JUMP_TIME,()=>{
            this.EndStatesJudge();
        });
    }

    /**
     * 结束状态判断
     */
    private EndStatesJudge(): void{
        let move_dis = this.Change_dir ? this.Piece_move_dis : this.Piece_move_dis + this.Offset_dis;
        if(move_dis < 0.015){
            this.Offset_dis += this.Piece_move_dis;
            Message.event("canPress");
        }
        else if(move_dis >= 0.015 && move_dis < 0.02){
            this.Piece.dieAnime(1,this.Move_dir);
        }
        else if(move_dis >= 0.02 && move_dis < this.Block_dis - 0.02){
            this.Piece.dieAnime();
        }
        else if(move_dis >= this.Block_dis - 0.02 && move_dis <= this.Block_dis - 0.015){
            this.Piece.dieAnime(2,this.Move_dir);
        }
        else if(move_dis > this.Block_dis - 0.015 && move_dis < this.Block_dis + 0.015){
            this.SenceMove();
            Message.event("addScore",[1]);
        }
        else if(move_dis >= this.Block_dis + 0.015 && move_dis < this.Block_dis + 0.02){
            this.Piece.dieAnime(1,this.Move_dir);
        }
        else if(move_dis >= this.Block_dis + 0.02){
            this.Piece.dieAnime();
        }
    }

    /**
     * 场景移动
     */
    private SenceMove():void{
        let move_dis = -this.Block_dis;
        let move_dir = iMath.randomRange(0,1);

        let NextBlock = this.getNextBlock();
        this.Offset_dis = this.Move_dir == 1 ? this.Piece.pos.x - NextBlock.pos.x : this.Piece.pos.z - NextBlock.pos.z;

        this.Change_dir = !(move_dir == this.Move_dir);
        this.SpritItemMove(move_dis,move_dir);
    }

    /**
     * 场景内的元素移动
     */
    private SpritItemMove(move_dis:number,move_dir:number):void{
        let opts:pos;
        if(this.Change_dir) {
            let NextBlock = this.getNextBlock();
            opts = move_dir == 1 ? {x:NextBlock.RTIGHT_POS.x - NextBlock.pos.x,y:0,z:NextBlock.RTIGHT_POS.z - NextBlock.pos.z} : {x:NextBlock.o_pos.x - NextBlock.pos.x,y:0,z:NextBlock.o_pos.z - NextBlock.pos.z};
            this.Move_dir = move_dir;
        }
        else opts = move_dir == 1 ? {x:move_dis,y:0,z:0} : {x:0,y:0,z:move_dis};
        this.Piece.MoveAnime(opts,500,()=>{
            this.addBlockToSence();
        });
        for (let i = 0; i < this.Sence_blocks.length; i++) {
            let block = this.Sence_blocks[i];
            block.MoveAnime(opts,500);
        }
    }

    /**
     * 新增一个块到场景
     */
    private addBlockToSence():void{
        this.Now_Block_id++;
        this.Now_Block_id = this.Now_Block_id > GameData.BLOCK_NUM - 1 ? 0 : this.Now_Block_id;
        let NowBlock = this.Blocks[this.Now_Block_id];
        let NextBlock = this.getNextBlock();
        this.Block_dis = iMath.randomRange(4,7) / 100;
        let opts = this.Move_dir == 1 ? {x:NowBlock.pos.x + this.Block_dis,y:0,z:NowBlock.pos.z} : {x:NowBlock.pos.x,y:0,z:NowBlock.pos.z + this.Block_dis};
        NextBlock.transform(opts);
        NextBlock.entering(()=>{
            this.Sence_blocks.push(NextBlock);
            this.checkSenceBlocks();
            this.Press_time = 0;
            this.Piece_move_dis = 0;
            Message.event("canPress");
        });
    }

    /**
     * 返回下一个盒子
     */
    private getNextBlock():Block{
        let nextID = this.Now_Block_id + 1;
        nextID = nextID > GameData.BLOCK_NUM - 1 ? 0 : nextID;
        let NextBlock = this.Blocks[nextID];
        return NextBlock;
    }

    /**
     * 检查场景里面盒子的数量
     */
    private checkSenceBlocks():void{
        if(this.Sence_blocks.length > 4){
            let block = this.Sence_blocks.shift();
            block.resetPos();
            block.transform({x:0,y:GameData.Y_POS,z:0});
        }
    }

    /**
     * sence初始化
     */
    private senceInit():void{
        this.scene = Laya.loader.getRes("sprite_block/jumpBlock.ls");
        Laya.stage.addChild(this.scene);
        this.Father = this.scene.getChildByName("moxing") as Laya.Sprite3D;

        this.creatCamera();
        this.creatBlock();
        this.creatPiece();
    }

    /**
     * 创建棋子
     */
    private creatPiece():void{
        this.Piece = new Piece(this.Father.getChildByName("boy") as Laya.Sprite3D, this.Father.getComponentByType(Laya.Animator) as Laya.Animator);
    }

    /**
     * 创建块
     */
    private creatBlock():void{
        let box = this.Father.getChildByName("aa:polySurface1") as Laya.Sprite3D;
        let block = box.getChildByName("box") as Laya.Sprite3D;
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
    private resetBlockPos():void{
        this.Sence_blocks = [];
        for (let i = 0; i < this.Blocks.length; i++) {
            let item = this.Blocks[i];
            if(i == 0){
                this.Sence_blocks.push(item);
            }
            else if(i == 1) {
                item.transform({x:0,y:0,z:this.Block_dis});
                this.Sence_blocks.push(item);
            }
            else item.transform({x:0,y:GameData.Y_POS,z:0});
        }
    }

    /**
     * 创建相机
     */
    private creatCamera():void{
        this.camera = this.scene.getChildByName("Camera") as Laya.Camera;
    }
}
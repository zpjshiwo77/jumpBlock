class GameMain{
    private scene: Laya.Scene;
    private camera: Laya.Camera;
    private Father: Laya.Sprite3D;
    private Blocks: Block[] = [];
    private Piece: Piece;
    private antAction;

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
        Message.on("startGame",this,this.startGame)
        
    }

    /**
     * 开始游戏
     */
    private startGame():void{
        this.Piece.entering();
    }

    /**
     * 按压棋子
     */
    private piecePress():void{
        this.Piece.Press();
        this.Blocks[0].Press();
    }

    /**
     * 棋子释放
     */
    private pieceRelease(time): void{
        this.Piece.Release();
        this.Blocks[0].Release();
    }

    /**
     * 棋子跳起来
     */
    private pieceJump(): void{

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

        this.Blocks.push(new Block(block));

        for (let i = 0; i < GameData.BLOCK_NUM - 1; i++) {
            let item = block.clone();
            let blockItem = new Block(item);
            box.addChild(item);
            if(i == 0) blockItem.transform({x:0,y:0,z:0.15});
            else blockItem.transform({x:0,y:0.5,z:0});
            this.Blocks.push(blockItem);
        }
    } 

    /**
     * 创建相机
     */
    private creatCamera():void{
        this.camera = this.scene.getChildByName("Camera") as Laya.Camera;
    }
}
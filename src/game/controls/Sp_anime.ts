class Sp_anime {
    public name: string;
    private sp: Laya.Sprite3D;
    private opts: animeOpts;
    private unitTime: number = 17;
    private playFlag: Boolean = false;
    private updateFlag: any = {translate:false,rotate: false,scale: false};
    private TIMES: number;
    private times: number;
    private unit: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    private change: any = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};

    constructor(sp: Laya.Sprite3D,opts: animeOpts,name:string) {
        this.sp = sp;
        this.opts = opts;
        this.name = name;
        this.countParam();
    }

    /**
     * 更新
     */
    public update(): void{
        if(this.playFlag){
            this.translateing();
            this.rotating();
            this.scaleing();
            this.times--;
            if (this.times <= 0) {
                this.stop();
            }
        }
    }

    /**
     * 播放
     */
    public play(): void{
        this.playFlag = true;
        this.times = this.TIMES;
        this.change = {x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:0,sy:0,sz:0};
    }

    /**
     * 停止
     */
    public stop(): void{
        this.playFlag = false;
        Message.event(this.name+"AnimeEnd",[this.change]);
    }

    /**
     * 计算参数
     */
    private countParam(): void{
        this.TIMES = Math.floor(this.opts.time / this.unitTime);
        this.times = this.TIMES;

        if (this.opts.hasOwnProperty('x') || this.opts.hasOwnProperty('y') || this.opts.hasOwnProperty('z')) {
            this.updateFlag.translate = true;
            if (this.opts.hasOwnProperty('x')) this.unit.x = this.opts.x / this.TIMES;
            if (this.opts.hasOwnProperty('y')) this.unit.y = this.opts.y / this.TIMES;
            if (this.opts.hasOwnProperty('z')) this.unit.z = this.opts.z / this.TIMES;
        }
        if (this.opts.hasOwnProperty('rx') || this.opts.hasOwnProperty('ry') || this.opts.hasOwnProperty('rz')) {
            this.updateFlag.rotate = true;
            if (this.opts.hasOwnProperty('rx')) this.unit.rx = this.opts.rx / this.TIMES;
            if (this.opts.hasOwnProperty('ry')) this.unit.ry = this.opts.ry / this.TIMES;
            if (this.opts.hasOwnProperty('rz')) this.unit.rz = this.opts.rz / this.TIMES;
        }
        if (this.opts.hasOwnProperty('sx') || this.opts.hasOwnProperty('sy') || this.opts.hasOwnProperty('sz')) {
            this.updateFlag.scale = true;
            if (this.opts.hasOwnProperty('sx')) this.unit.sx = this.opts.sx / this.TIMES;
            if (this.opts.hasOwnProperty('sy')) this.unit.sy = this.opts.sy / this.TIMES;
            if (this.opts.hasOwnProperty('sz')) this.unit.sz = this.opts.sz / this.TIMES;
        }
    }

    /**
     * 位移
     */
    private translateing():void{
        if (this.updateFlag.translate) {
            let translate = new Laya.Vector3()
            let pos = this.sp.transform.localPosition;
            translate.x = pos.x + this.unit.x;
            translate.y = pos.y + this.unit.y;
            translate.z = pos.z + this.unit.z;
            this.sp.transform.localPosition = translate;
            this.change.x += this.unit.x;
            this.change.y += this.unit.y;
            this.change.z += this.unit.z;
        }
    }

    /**
     * 旋转
     */
    private rotating():void{
        if (this.updateFlag.rotate) {
            this.sp.transform.rotate(new Laya.Vector3(this.unit.rx,this.unit.ry,this.unit.rz),false,false);
            this.change.rx += this.unit.rx;
            this.change.ry += this.unit.ry;
            this.change.rz += this.unit.rz;
        }
    }

    /**
     * 旋转
     */
    private scaleing():void{
        if (this.updateFlag.scale) {
            let scale = new Laya.Vector3()
            let pre = this.sp.transform.localScale;
            scale.x = pre.x + this.unit.sx;
            scale.y = pre.y + this.unit.sy;
            scale.z = pre.z + this.unit.sz;
            this.sp.transform.localScale = scale;
            this.change.sx += this.unit.sx;
            this.change.sy += this.unit.sy;
            this.change.sz += this.unit.sz;
        }
    }
}
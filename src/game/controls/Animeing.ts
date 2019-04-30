class Animeing {
    private static animes: any = {};

    /**
     * 运行
     */
    public static run(): void{
        requestAnimationFrame(() => {
            for (let i in this.animes) {
                if(this.animes[i]) this.animes[i].update();
            }
            this.run();
        })
    }

    /**
     * 添加动画
     */
    public static creatAnime(sp: Laya.Sprite3D,opts: animeOpts,name: string): Sp_anime{
        let anime = new Sp_anime(sp,opts,name);
        this.animes[name] = anime;
        return anime;
    }

    /**
     * 销毁对象
     */
    public static destory(name:string): void{
        delete this.animes[name];
        this.animes[name] = null;
    }
}
class Animeing {
    /**
     * 运行
     */
    static run() {
        requestAnimationFrame(() => {
            for (let i in this.animes) {
                if (this.animes[i])
                    this.animes[i].update();
            }
            this.run();
        });
    }
    /**
     * 添加动画
     */
    static creatAnime(sp, opts, name) {
        let anime = new Sp_anime(sp, opts, name);
        this.animes[name] = anime;
        return anime;
    }
    /**
     * 销毁对象
     */
    static destory(name) {
        delete this.animes[name];
        this.animes[name] = null;
    }
}
Animeing.animes = {};
//# sourceMappingURL=Animeing.js.map
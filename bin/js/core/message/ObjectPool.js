/**
 * 对象池类
 * ObjectPool
 */
class ObjectPool {
    /**
     * 构造函数
     */
    constructor() {
    }
    /**
     * 清除缓存对象
     * @params sign {string} 注册时的标识
     */
    static clearBySign(sign) {
        Laya.Pool.clearBySign(sign);
    }
    /**
     * 根据标识符 返回对象 如果为空 则返回null
     * @params sign {string} 注册时的标识
     */
    static getItem(sign) {
        return Laya.Pool.getItem(sign);
    }
    /**
     * 将对象放到对应类型标识的对象池中。
     * @params sign {string} 注册时的标识
     * @params item {Object} 类名
     */
    static recover(sign, item) {
        Laya.Pool.recover(sign, item);
    }
}
//# sourceMappingURL=ObjectPool.js.map
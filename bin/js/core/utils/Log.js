class Log {
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    static echo(...optionalParams) {
        console.log.apply(console, optionalParams);
    }
    static warn(...optionalParams) {
        console.warn.apply(console, optionalParams);
    }
}
//# sourceMappingURL=Log.js.map
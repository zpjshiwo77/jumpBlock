class BaseDialog {
    constructor() {
        this.onClose = null;
    }
    /**
     * 显示
     */
    show() {
        this.view.popup();
    }
    /**
     * 隐藏
     */
    hide() {
        this.view.close();
        if (this.onClose)
            this.onClose.run();
    }
}
//# sourceMappingURL=BaseDialog.js.map
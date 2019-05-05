var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    class controlUI extends View {
        constructor() { super(); }
        createChildren() {
            View.regComponent("Text", laya.display.Text);
            super.createChildren();
            this.createView(ui.controlUI.uiView);
        }
    }
    controlUI.uiView = { "type": "View", "props": { "width": 750, "height": 1624 }, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "control", "height": 1624 }, "child": [{ "type": "Text", "props": { "y": 50, "x": 0, "width": 750, "visible": false, "var": "score", "text": "0", "height": 150, "fontSize": 120, "font": "Microsoft YaHei", "color": "#111111", "bold": true, "align": "center" } }] }, { "type": "Sprite", "props": { "width": 750, "var": "start", "height": 1624, "alpha": 1 }, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "alpha": 0.5 }, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 750, "lineWidth": 1, "height": 1624, "fillColor": "#000000" } }] }, { "type": "Text", "props": { "y": 100, "x": 0, "width": 750, "text": "跳一跳", "height": 200, "fontSize": 120, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" } }, { "type": "Text", "props": { "y": 500, "x": 0, "width": 750, "var": "startbtn", "text": "开  始", "height": 150, "fontSize": 70, "font": "Microsoft YaHei", "color": "#e8d923", "align": "center" } }] }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "visible": false, "var": "endBox", "height": 1624, "alpha": 1 }, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "alpha": 0.5 }, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 750, "lineWidth": 1, "height": 1624, "fillColor": "#000000" } }] }, { "type": "Text", "props": { "y": 100, "x": 0, "width": 750, "text": "游戏结束", "height": 200, "fontSize": 120, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" } }, { "type": "Text", "props": { "y": 500, "x": 0, "width": 750, "var": "againBtn", "text": "在玩一次", "height": 150, "fontSize": 70, "font": "Microsoft YaHei", "color": "#e8d923", "align": "center" } }] }] };
    ui.controlUI = controlUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map
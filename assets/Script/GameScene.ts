import { GameBoard } from "./GameBoard";


const { ccclass, property } = cc._decorator;

@ccclass
export class GameScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Prefab)
    whiteChess: cc.Prefab = null;
    @property(cc.Prefab)
    blackChess: cc.Prefab = null;
    private board: GameBoard = null;

    onLoad() {
        
    }

    start() {

    }

    update() {

    }

    onDestroy() {

    }

    //按钮触发事件
    private clickToStart(): void {
        this.button.node.active = false;
    }
}

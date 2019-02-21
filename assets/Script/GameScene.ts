import { GameBoard } from "./GameBoard";
import { BLACKCHESS, WHITECHESS, NONE } from "./Piece";
import { AI } from "./AI";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameScene extends cc.Component {

    @property(cc.Button)
    restart: cc.Button = null;
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Button)
    buttonAI: cc.Button = null;
    @property(cc.Sprite)
    mask: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Prefab)
    whiteChess: cc.Prefab = null;
    @property(cc.Prefab)
    blackChess: cc.Prefab = null;
    @property(GameBoard)
    private board: GameBoard = null;
    private overTips: string = "";
    public AIMODE: boolean = false;

    public onLoad (): void {
        this.board.init(this);
    }


    /**
     * 落子
     * @param x 
     * @param y 
     */
    public MoveInChess (x: number, y: number, state: number): void {
        let chess;
        if (state == BLACKCHESS) {
            chess = cc.instantiate(this.blackChess);
        } else {
            chess = cc.instantiate(this.whiteChess);
        }
        chess.x = x;
        chess.y = y;
        this.node.addChild(chess);
        if (this.board.win != -1) {
            this.gameOver();
        }
        // if (this.board.win == 0) {
        //     this.gameOver();
        // }
    }

    /**
     * 游戏结束
     */
    public gameOver (): void {
        this.board.removeListennner();
        if (this.board.win == 1) {
            this.overTips = "白棋胜利!";
        } else if (this.board.win == 2) {
            this.overTips = "黑棋胜利!";
        } else {
            this.overTips = "平局";
        }
        // if (this.board.win == 0) {
        //     this.overTips = "平局";
        // }
        this.gameEnd();
    }

    public gameEnd (): void {
        this.mask.node.active = true;
        this.label.string = this.overTips;
        this.label.enabled = true;
        this.restart.node.active = true;
    }

    /**
     * 按钮触发事件
     */
    private clickToStart (event, flag): void {
        if (flag == "false") {
            this.AIMODE = false;
        } else {
            this.AIMODE = true;
        }
        console.log(this.AIMODE);
        this.button.node.active = false;
        this.buttonAI.node.active = false;
    }

    private reset (): void {
        cc.director.loadScene("Game");
    }
}

import { GameBoard } from "./GameBoard";
import { BLACKCHESS, WHITECHESS, NONE } from "./Piece";


const {ccclass, property} = cc._decorator;

@ccclass
export class AI extends cc.Component {

    @property(GameBoard)
    private board: GameBoard = null;

    public onLoad (): void {
        this.board.initAI(this);
    }

    public AIPosition (x: number, y: number): cc.Vec2 {


        return cc.v2(x + this.board.block, y);
    }
}

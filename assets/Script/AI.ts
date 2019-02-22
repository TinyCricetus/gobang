import { GameBoard } from "./GameBoard";
import { BLACKCHESS, WHITECHESS, NONE } from "./Piece";


const { ccclass, property } = cc._decorator;

@ccclass
export class AI extends cc.Component {

    @property(GameBoard)
    private board: GameBoard = null;

    //优势记分棋盘
    private mazeScore: number[][] = [];


    public onLoad(): void {
        this.init();
        this.board.initAI(this);
    }

    public init(): void {
        //初始化记分棋盘
        for (let i = 0; i < this.board.judgeSize; i++) {
            this.mazeScore[i] = [];
            for (let j = 0; j < this.board.judgeSize; j++) {
                this.mazeScore[i][j] = 0;
            }
        }
    }

    /**
     * 坐标结果计算返回
     * @param x 上一次用户落子X轴坐标(需要转换)
     * @param y 上一次用户落子Y轴坐标(需要转换)
     */
    public AIPosition(x: number, y: number): cc.Vec2 {
        x = (x / this.board.block) + 8;
        y = (y / this.board.block) + 8
        this.figureScore(x, y);

        let figurePos: cc.Vec2 = this.figureOut();
        x = figurePos.x;
        y = figurePos.y;
        return cc.v2((x - 8) * this.board.block, (y - 8) * this.board.block);
    }

    /**
     * 扫描棋盘
     */
    private figureScore(tx: number, ty: number): void {
        
        let sum: number = 0;

        let length: number = this.board.judgeSize;

        //纵向正判断
        let temp: number[] = [];
        for (let i = 1; i < length; i++) {
            temp[i] = this.board.maze[tx][i];
        }
        for (let i = 1; i < length; i++) {
            if (temp[i] == -1) {
                if (temp[i - 1] < 0) {
                    temp[i] += temp[i - 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i - 1] < 0) {
                    this.mazeScore[tx][i] += temp[i - 1];
                }
            }
        }
        //纵向负判断
        for (let i = 1; i < length; i++) {
            temp[i] = this.board.maze[tx][i];
        }
        for (let i = length - 1; i > 0; i--) {
            if (temp[i] == -1) {
                if (temp[i + 1] < 0) {
                    temp[i] += temp[i + 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i + 1] < 0) {
                    this.mazeScore[tx][i] += temp[i + 1];
                }
            }
        }

        //横向正判断
        for (let i = 1; i < length; i++) {
            temp[i] = this.board.maze[i][ty];
        }
        for (let i = 1; i < length; i++) {
            if (temp[i] == -1) {
                if (temp[i - 1] < 0) {
                    temp[i] += temp[i - 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i - 1] < 0) {
                    this.mazeScore[i][ty] += temp[i - 1];
                }
            }
        }
        //横向负判断
        for (let i = 1; i < length; i++) {
            temp[i] = this.board.maze[i][ty];
        }
        for (let i = length - 1; i > 0; i--) {
            if (temp[i] == -1) {
                if (temp[i + 1] < 0) {
                    temp[i] += temp[i + 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i + 1] < 0) {
                    this.mazeScore[i][ty] += temp[i + 1];
                }
            }
        }

        let index: number = 1;
        let endX: number = 0;
        let endY: number = 0;
        let beginX: number = 0;
        let beginY: number = 0;
        //顺斜角正判断
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                if ((tx + ty) == (i + j)) {
                    temp[index++] = this.board.maze[i][j];
                    endX = i;
                    endY = j;
                }
            }
        }
        beginX = endX - (index - 2);
        beginY = endY + (index - 2);
        for (let i = 1; i < index; i++) {
            if (temp[i] == -1) {
                if (temp[i - 1] < 0) {
                    temp[i] += temp[i - 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i - 1] < 0) {
                    this.mazeScore[beginX + (i - 1)][beginY - (i - 1)] += temp[i - 1];
                }
            }
        }
        //顺斜角负判断
        index = 1;
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                if ((tx + ty) == (i + j)) {
                    temp[index++] = this.board.maze[i][j];
                    endX = i;
                    endY = j;
                }
            }
        }
        beginX = endX;
        beginY = endY;
        let it: number = 1;
        for (let i = index - 1; i > 0; i--, it++) {
            if (temp[i] == -1) {
                if (temp[i + 1] < 0) {
                    temp[i] += temp[i + 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i + 1] < 0) {
                    this.mazeScore[beginX - (it - 1)][beginY + (it - 1)] += temp[i + 1];
                }
            }
        }

        //逆斜角正判断
        index = 1;
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                if ((tx - ty) == (i - j)) {
                    temp[index++] = this.board.maze[i][j];
                    endX = i;
                    endY = j;
                }
            }
        }
        beginX = endX - (index - 2);
        beginY = endY - (index - 2);
        for (let i = 1; i < index; i++) {
            if (temp[i] == -1) {
                if (temp[i - 1] < 0) {
                    temp[i] += temp[i - 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i - 1] < 0) {
                    this.mazeScore[beginX + (i - 1)][beginY + (i - 1)] += temp[i - 1];
                }
            }
        }
        //逆斜角负判断
        index = 1;
        it = 1;
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                if ((tx - ty) == (i - j)) {
                    temp[index++] = this.board.maze[i][j];
                    endX = i;
                    endY = j;
                }
            }
        }
        beginX = endX;
        beginY = endY;
        for (let i = index - 1; i > 0; i--, it++) {
            if (temp[i] == -1) {
                if (temp[i + 1] < 0) {
                    temp[i] += temp[i + 1];
                }
            }
            if (temp[i] == 0) {
                if (temp[i + 1] < 0) {
                    this.mazeScore[beginX - (it - 1)][beginY - (it - 1)] += temp[i + 1];
                }
            }
        }

    }

    private figureOut (): cc.Vec2 {
        let length: number = this.board.judgeSize;
        let score: number = 0;
        let x: number = 0;
        let y: number = 0;
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                if (this.board.maze[i][j] == 0) {
                    if (score > this.mazeScore[i][j] ) {
                        x = i;
                        y = j;
                        score = this.mazeScore[i][j];
                    }
                }
            }
        }
        return cc.v2(x, y);
    }
}



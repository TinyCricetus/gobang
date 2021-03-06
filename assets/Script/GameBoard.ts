import { GameScene } from "./GameScene";
import { BLACKCHESS, WHITECHESS, NONE } from "./Piece";
import { AI } from "./AI";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameBoard extends cc.Component {

    //判定棋盘大小
    public judgeSize: number = 16;
    //判定棋盘
    public maze: number[][] = [];
    //下一个棋子颜色（-1为黑）
    public state: number = BLACKCHESS;
    //胜利方，-1未结束,0平局，1黑胜，2白胜
    public win: number = -1;
    public sum: number = 0;
    //一格长度
    public block: number = 50;

    private gameScene: GameScene = null;
    private AITurn: AI = null;
    //AI模式下的全局回合判定
    private myTurn: boolean = true;

    /**
     * 初始化
     * @param scene 游戏场景
     */
    public init(scene: GameScene): void {
        this.gameScene = scene;
        for (let i = 0; i < this.judgeSize; i++) {
            this.maze[i] = [];
            for (let j = 0; j < this.judgeSize; j++) {
                //console.log(i + "," + j);
                this.maze[i][j] = 0;
            }
        }
        this.addListenner();
    }

    public initAI(ai: AI): void {
        this.AITurn = ai;
    }

    /**
     * 处理触控事件
     * @param event 触控事件
     */
    private onTouched(event: cc.Event.EventTouch) {
        // let localPosition = this.node.convertToNodeSpaceAR(event.getLocation());
        // let pos = this.getPosByInt(localPosition);
        let localPosition = event.getLocation();
        let posX = localPosition.x - 350;
        let posY = localPosition.y - 350;
        posX = this.getPosByInt(posX);
        posY = this.getPosByInt(posY);
        this.changeToJudgeBoard(posX, posY);

        //如果AI模式启动，电脑走下一轮 
        if (this.gameScene.AIMODE && this.win == -1 && !this.myTurn) {
            let AIPOS: cc.Vec2 = this.AITurn.AIPosition(posX, posY);
            //console.log(AIPOS);
            this.scheduleOnce(function () {
                this.changeToJudgeBoard(AIPOS.x, AIPOS.y);
            }, 0.2);
        }

        //this.printBoard();
    }

    /**
     * 世界坐标转换,并且取整（四舍五入）
     * @param num X或者Y轴坐标
     */
    private getPosByInt(num: number): number {
        //负坐标处理标记，使得处理出来的数据保持原符号不变
        let flag = 1;
        if (num < 0) {
            num = -num;
            flag = -1;
        } else {
            flag = 1;
        }
        let remain = num % this.block;
        num = Math.floor(num / this.block) * this.block;
        if (remain - this.block / 2 >= 0) {
            num += this.block;
        }
        num *= flag;
        return num;
    }

    /**
     * 转换坐标后置入判定棋盘,并且落子
     * @param x 
     * @param y 
     */
    private changeToJudgeBoard(x: number, y: number): void {
        let tx = (x / this.block) + 8;
        let ty = (y / this.block) + 8;
        if (this.maze[tx][ty] != 0) {
            this.myTurn = true;
            return;
        } else {
            this.myTurn = false;
            this.maze[tx][ty] = this.state;
            this.sum += 1;
            this.judge(tx, ty);
            this.gameScene.moveInChess(x, y, this.state);
            this.state *= -1;
        }
    }

    /**
     * 胜负判定
     * @param tx 
     * @param ty 
     */
    public judge(tx: number, ty: number): void {

        //棋子判定累加计数器(5或者-5出现胜负)
        let rowSum = 0;
        let colSum = 0;
        let biasSumB = 0;
        let biasSumA = 0;
        //判断长度限制
        let length = 16;
        //扫描终止符
        let stop = 0;

        //棋盘扫描
        for (let i = 1; i < length; i++) {
            for (let j = 1; j < length; j++) {
                //纵轴判定
                if (this.maze[i][j - 1] == this.maze[i][j]) {
                    colSum += this.maze[i][j];
                } else {
                    colSum = 0;
                    colSum += this.maze[i][j];
                }
                //横轴判定
                if (this.maze[j - 1][i] == this.maze[j][i]) {
                    rowSum += this.maze[j][i];
                } else {
                    rowSum = 0;
                    rowSum += this.maze[j][i];
                }
                //顺斜轴判定
                if ((tx - ty) == (i - j)) {
                    if (this.maze[i - 1][j - 1] == this.maze[i][j]) {
                        biasSumA += this.maze[i][j];
                    } else {
                        biasSumA = 0;
                        biasSumA += this.maze[i][j];
                    }
                }
                //逆斜轴判定
                if ((tx + ty) == (i + j)) {
                    if (this.maze[i - 1][j + 1] == this.maze[i][j]) {
                        biasSumB += this.maze[i][j];
                    } else {
                        biasSumB = 0;
                        biasSumB += this.maze[i][j];
                    }
                }

                if (colSum >= 5 || colSum <= -5 ||
                    rowSum >= 5 || rowSum <= -5 ||
                    biasSumA >= 5 || biasSumA <= -5 ||
                    biasSumB >= 5 || biasSumB <= -5) {
                    stop = 1;
                    break;
                }
            }
            if (1 == stop) {
                break;
            }
        }

        cc.log("rowSum:" + rowSum);
        cc.log("colSum:" + colSum);
        cc.log("biasSum:" + biasSumA + "," + biasSumB);

        //结果判定
        if (rowSum >= 5 || colSum >= 5 ||
            biasSumA >= 5 || biasSumB >= 5) {
            //白胜
            this.win = 1;
            cc.log("白胜！");
            //this.winString = "白棋获胜！";
        } else if (rowSum <= -5 || colSum <= -5
            || biasSumA <= -5 || biasSumB <= -5) {
            //黑胜
            this.win = 2;
            cc.log("黑胜！");
            //this.winString = "黑棋获胜！";
        } else if (this.sum >= 225) {
            //平局
            this.win = 0;
            cc.log("平局！");
        } else {
            this.win = -1;
            cc.log("未结束");
        }

        cc.log("落子数：" + this.sum);

    }

    public addListenner(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    public removeListennner(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    private printBoard(): void {
        for (let i = 1; i < this.judgeSize; i++) {
            for (let j = 1; j < this.judgeSize; j++) {
                cc.log(this.maze[i][j] + " ");
            }
            cc.log("\n");
        }
    }
}

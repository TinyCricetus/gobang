import { GameScene } from "./GameScene";
import { BLACKCHESS, WHITECHESS, NONE } from "./Piece";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameBoard extends cc.Component {

    // private startX: number = 0;
    // private startY: number = 0;

    //判定棋盘大小
    private judgeSize: number = 25;
    //判定棋盘
    private maze: number[][] = [];
    private gameScene: GameScene = null;
    //下一个棋子颜色（-1为黑）
    public state: number = BLACKCHESS;
    //胜利方，-1未结束,0平局，1黑胜，2白胜
    public win: number = -1;
    private sum: number = 0;

    /**
     * 初始化
     * @param scene 
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

    /**
     * 处理触控事件
     * @param event 
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
    }

    /**
     * 世界坐标转换,并且取整（四舍五入）
     * @param num 
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
        let remain = num % 50;
        num = Math.floor(num / 50) * 50;
        if (remain - 25 >= 0) {
            num += 50;
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
        let tx = (x / 50) + 8;
        let ty = (y / 50) + 8;
        if (this.maze[tx][ty] != 0) {
            return;
        } else {
            this.maze[tx][ty] = this.state;
            this.sum += 1;
            this.judge(tx, ty);
            this.gameScene.MoveInChess(x, y, this.state);
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
        } else if (this.sum >= 225){
            //平局
            this.win = 0;
            cc.log("平局！");
        } else {
            this.win = -1;
            cc.log("未结束");
        }

        cc.log(this.sum);

    }

    private addListenner(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    public removeListennner(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }
}

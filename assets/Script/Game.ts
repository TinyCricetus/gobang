const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad () {
        let action1 = cc.rotateBy(2, 180);
        let action2 = cc.scaleBy(2, 0.5);
        let action3 = cc.scaleBy(2, 2)

        let seq = cc.sequence(action1, action2, action3, action1);

        let seqForever = cc.repeatForever(seq);

        this.node.runAction(seqForever);
    }

    start () {
        // init logic
        this.label.string = this.text;
    }




    update (dt) {

    }
}

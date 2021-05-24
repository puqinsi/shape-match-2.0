cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: 0,
            type: cc.Integer
        },
        audio: {
            default: null,
            type: cc.AudioClip
        },
        mask: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvent();
    },

    start() {},

    // update (dt) {},
    addEvent() {
        // 边界值
        let game = this.game.node;
        this.leftX = -game.width / 2 + (this.node.width * this.node.scale) / 2;
        this.rightX = game.width / 2 - (this.node.width * this.node.scale) / 2;
        this.topY = game.height / 2 - (this.node.height * this.node.scale) / 2;
        this.bottomY =
            -game.height / 2 + (this.node.height * this.node.scale) / 2;
        // 监听事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.modeStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.nodeMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.nodeEnd, this);
    },
    modeStart() {
        cc.log("start");
        this.audioEngine.playEffect(this.audio, false, true);
        this.zIndex = this.node.zIndex;
        this.node.zIndex = 10;
        this.flag = false;
    },
    nodeMove(event) {
        let detail = event.getDelta();
        this.node.x += detail.x;
        if (this.node.x < this.leftX) {
            this.node.x = this.leftX;
        } else if (this.node.x > this.rightX) {
            this.node.x = this.rightX;
        }
        this.node.y += detail.y;
        if (this.node.y < this.bottomY) {
            this.node.y = this.bottomY;
        } else if (this.node.y > this.topY) {
            this.node.y = this.topY;
        }
    },
    nodeEnd() {
        cc.log("end");
        this.node.zIndex = this.zIndex;
        // 只有触发TOUCH_END的node才会检测碰撞
        this.flag = true;
    },
    onCollisionEnter(other, self) {
        console.log("on collision enter");
    },
    onCollisionStay(other, self) {
        if (this.flag) {
            this.flag = false;
            if (
                other.node.getComponent("shape").id ==
                self.node.getComponent("shape").id
            ) {
                cc.log("right");
                cc.director.getCollisionManager().enabled = false;
                self.node.off(
                    cc.Node.EventType.TOUCH_START,
                    self.modeStart,
                    self
                );
                self.node.off(
                    cc.Node.EventType.TOUCH_MOVE,
                    self.nodeMove,
                    self
                );
                self.node.off(cc.Node.EventType.TOUCH_END, self.nodeEnd, self);
                other.node.off(
                    cc.Node.EventType.TOUCH_START,
                    other.modeStart,
                    other
                );
                other.node.off(
                    cc.Node.EventType.TOUCH_MOVE,
                    other.nodeMove,
                    other
                );
                other.node.off(
                    cc.Node.EventType.TOUCH_END,
                    other.nodeEnd,
                    other
                );
                // 获取公共部分 Manager 组件的方法
                this.game.manager.getComponent("Manager").rightEffect();
                this.rightAction(other.node, self.node);
            } else {
                cc.log("wrong");
                // 获取公共部分 Manager 组件的方法
                this.game.manager.getComponent("Manager").wrongStar();
            }
        }
    },
    rightAction(other, self) {
        let mask = this.game.mask;
        // TODO 层级最好写一套逻辑管理
        other.zIndex = 20;
        self.zIndex = 20;
        mask.zIndex = 15;
        mask.opacity = 200;
        cc.tween(self)
            .delay(0.3)
            .to(0.5, { x: (-self.width / 3) * 2 * self.scale, y: 0 })
            .start();
        cc.tween(other)
            .delay(0.3)
            .to(0.5, { x: (other.width / 3) * 2 * other.scale, y: 0 })
            .call(() => {
                this.game.manager
                    .getComponent("Manager")
                    .rightStar()
                    .then(() => {
                        cc.tween(this.game.mask)
                            .to(0.5, { opacity: 0 })
                            .start();
                        cc.tween(other)
                            .to(0.5, { opacity: 0 })
                            .call(() => {
                                other.destroy();
                            })
                            .start();
                        cc.tween(self)
                            .to(0.5, { opacity: 0 })
                            .call(() => {
                                self.destroy();
                                cc.director.getCollisionManager().enabled = true;
                            })
                            .start();
                    });
            })
            .start();
    }
});

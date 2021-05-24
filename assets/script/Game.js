const data = require("./data");
cc.Class({
    extends: cc.Component,
    properties: {
        manager: {
            default: null,
            type: cc.Node
        },
        shapePrefab: {
            default: null,
            type: cc.Prefab
        },
        gameHint: {
            default: null,
            type: cc.Node
        },
        gameHintAudio: {
            default: null,
            type: cc.AudioClip
        },
        mask: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.initGame();
        this.gameHint.zIndex = 100;
        this.gameHint.on("touchend", event => {
            this.gameHint.stopAllActions();
            this.audioEngine.playEffect(this.gameHintAudio, false, true);
            cc.tween(this.gameHint)
                .to(0.3, { scale: 0.4 })
                .to(0.3, { scale: 1 / 3 })
                .start();
        });
        // 游戏提示动效
        cc.tween(this.gameHint)
            .repeat(
                3,
                cc.tween().by(0.5, { scale: 0.2 }).by(0.5, { scale: -0.2 })
            )
            .start();
        // 关闭多点触摸
        cc.macro.ENABLE_MULTI_TOUCH = false;
        // 开启碰撞检测系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },
    start() {},
    // update (dt) {},

    initGame() {
        let shapeArr = this.util.randomSort(data.slice(0), []).splice(0, 4);
        let posArr = this.getPos();
        shapeArr.forEach((shape, index) => {
            this.createShape(shape, posArr, index);
        });
    },
    createShape(shapeItem, posArr, index) {
        let shapeOne = cc.instantiate(this.shapePrefab);
        shapeOne.name = shapeItem.name + "01";
        shapeOne.getComponent("shape").game = this;
        shapeOne.getComponent("shape").id = shapeItem.id;
        shapeOne.setPosition(posArr[index * 2]);
        cc.resources.load(shapeItem.one, cc.SpriteFrame, (err, spriteFrame) => {
            shapeOne.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.node.addChild(shapeOne);
        });

        let shapeTwo = cc.instantiate(this.shapePrefab);
        shapeTwo.name = shapeItem.name + "02";
        shapeTwo.getComponent("shape").game = this;
        shapeTwo.getComponent("shape").id = shapeItem.id;
        shapeTwo.setPosition(posArr[index * 2 + 1]);
        cc.resources.load(shapeItem.two, cc.SpriteFrame, (err, spriteFrame) => {
            shapeTwo.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.node.addChild(shapeTwo);
        });
        cc.resources.load(shapeItem.audio, cc.AudioClip, function (err, audio) {
            shapeOne.getComponent("shape").audio = audio;
            shapeTwo.getComponent("shape").audio = audio;
        });
    },
    getPos() {
        let posArr = [
            cc.v2(-300, 100),
            cc.v2(-100, 100),
            cc.v2(100, 100),
            cc.v2(300, 100),
            cc.v2(-300, -100),
            cc.v2(-100, -100),
            cc.v2(300, -100),
            cc.v2(100, -100)
        ];
        return this.util.randomSort(posArr, []);
    }
});

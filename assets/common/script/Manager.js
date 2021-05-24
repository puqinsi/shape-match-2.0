// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let audioEngine = require("./audio");
let util = require("./util");
cc.Component.prototype.audioEngine = audioEngine;
cc.Component.prototype.util = util;
cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            default: null,
            type: cc.Node
        },
        flyStar: {
            default: null,
            type: cc.Node
        },
        lightStar: {
            default: null,
            type: cc.SpriteFrame
        },
        blackStar: {
            default: null,
            type: cc.SpriteFrame
        },
        lightStarPrefab: {
            default: null,
            type: cc.Prefab
        },
        blackStarPrefab: {
            default: null,
            type: cc.Prefab
        },
        resultBg: {
            default: null,
            type: cc.Node
        },
        replayBtn: {
            default: null,
            type: cc.Node
        },
        starNum: {
            default: 0,
            type: cc.Integer
        },
        starAudio: {
            default: null,
            type: cc.AudioClip
        },
        endAudio: {
            default: null,
            type: cc.AudioClip
        },
        buttonAudio: {
            default: null,
            type: cc.AudioClip
        },
        rightAudio: {
            default: null,
            type: cc.AudioClip
        },
        wrongAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // cc.game.addPersistRootNode(this.node);
        // 关闭节点
        this.node.getChildByName("endGroup").active = false;
        // 返回
        this.back.on(
            "touchend",
            function (event) {
                console.log("Back");
            },
            this
        );
        // 重新开始
        this.replayBtn.on(
            "touchend",
            function (event) {
                this.audioEngine.playEffect(this.buttonAudio);
                cc.director.loadScene("Game");
            },
            this
        );
        // 初始化星星
        this.initStar();
    },
    start() {},
    // update (dt) {},

    initStar() {
        this.starIndex = 0;
        this.wrongFlag = true;
        this.starArr = [];
        this.endStarArr = [];
        let resultBg = this.resultBg;
        let num = this.starNum;
        for (let i = 0; i < num; i++) {
            // 顶部星星
            let blackStar = cc.instantiate(this.blackStarPrefab);
            blackStar.x = 333 - 36 * (num - 1 - i);
            this.node.addChild(blackStar);
            this.starArr.push(blackStar);
            // 结束星星
            let lightStar = cc.instantiate(this.lightStarPrefab);
            let startX = -((lightStar.width + 15) * num) / 2;
            lightStar.x = startX + (lightStar.width + 15) * i;
            lightStar.scale = 0;
            resultBg.addChild(lightStar);
            this.endStarArr.push(lightStar);
        }
    },
    rightStar() {
        return new Promise(resolve => {
            let flyStar = this.flyStar;
            flyStar.opacity = 255;
            flyStar.zIndex = 100;
            let startX = (Math.random() - 0.5) * ((this.node.width / 4) * 3);
            let endX = this.starArr[this.starIndex].x;
            let endY = this.starArr[this.starIndex].y;
            flyStar.x = startX;
            let t = cc.tween;
            this.audioEngine.playEffect(this.starAudio);
            t(flyStar)
                .parallel(
                    t().to(
                        1,
                        { position: cc.v2(endX, endY) },
                        { easing: "cubicInOut" }
                    ),
                    t().to(0.6, { scale: 0.3 }).to(0.4, { scale: 0.04 })
                )
                .call(() => {
                    // 飞星隐藏并恢复初始数据
                    flyStar.opacity = 0;
                    flyStar.setPosition(cc.v2(0, -300));
                    flyStar.scale = 0.16;

                    this.starArr[this.starIndex].getComponent(
                        cc.Sprite
                    ).spriteFrame = this.lightStar;
                    resolve();

                    this.starIndex++;
                    if (this.starIndex == this.starNum) {
                        this.scheduleOnce(() => {
                            this.gameEnd();
                        }, 0.5);
                    }
                })
                .start();
        });
    },
    wrongStar() {
        if (this.wrongFlag) {
            this.wrongFlag = false;
            let flyStar = this.flyStar;
            flyStar.opacity = 255;
            let startX = (Math.random() - 0.5) * ((this.node.width / 4) * 3);
            flyStar.x = startX;
            this.audioEngine.playEffect(this.wrongAudio);
            cc.tween(flyStar)
                .by(0.5, { y: 300 }, { easing: "cubicOut" })
                .by(0.5, { y: -300 }, { easing: "cubicIn" })
                .call(() => {
                    this.wrongFlag = true;
                })
                .start();
        }
    },
    endStar(num) {
        this.audioEngine.playEffect(this.buttonAudio);
        cc.tween(this.endStarArr[num])
            .to(0.3, { scale: 1 }, { easing: "cubicOut" })
            .call(() => {
                if (num < this.starNum) {
                    this.endStar(num + 1);
                }
            })
            .start();
    },
    gameEnd() {
        let endGroup = this.node.getChildByName("endGroup");
        endGroup.active = true;
        this.audioEngine.playEffect(this.endAudio);
        cc.tween(endGroup)
            .to(0.3, { opacity: 255 })
            .call(() => {
                this.endStar(0);
            })
            .start();
    },
    rightEffect() {
        this.audioEngine.playEffect(this.rightAudio);
    }
});

// 音频播放处理: loopFlag: 循环播放；onceFlag: 不同时重复播放
module.exports = {
    audioEngine: cc.audioEngine,
    playEffect(audio, loopFlag, onceFlag) {
        let loop = loopFlag ? true : false;
        let name = audio.name;
        if (this.hasOwnProperty(name) && onceFlag) {
            cc.log(name, this[name]);
            this.audioEngine.stopEffect(this[name]);
        }
        this[name] = this.audioEngine.playEffect(audio, loop);
    }
};

// 制作帧动画辅助函数..真的麻烦

// 支持两种方式，传递图片数组和雪碧图

// 雪碧图有部分帧动画([1,2,5])和全部帧动画(支持顺序)()，以及支持start end对象表示法(1, 8)
// 数组表示个别帧,对象表示连续帧

// TODO: 反复的动画，现在只是一个方向的动画，以后添加往复的动画效果.
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default class AnimationManager {
    constructor(sprite) {
        this.sprite = sprite;
        // 默认传入雪碧图
        this.isSingleFileWithFrame = false;
        // 所有帧
        this.frames = [];
        // 当前帧数
        this.currentFrame = 0;
        // 目标帧顺序
        this.cacheFrames = [];
        this.isStop = true;
        this.fps = 8;
        this.now = Date.now();
        this.animations = {};
        // 是否循环往复播放
        this.loopDirection = true;
    }

    getFrames(){
        return this.frames
    }

    getCurentFrameId(){
        return this.currentFrame
    }

    getCurentFrame(){
        return this.frames[this.currentFrame];
    }

    getFPS(){
        return this.fps;
    }

    setFPS(fps) {
        this.fps = fps;
    }

    _loadFramesFromResource(textures, special, rowCount = 1, colCount = 1) {
        let width, height, texture, _textures, frame;
        let frames = [];
        const type = toString.call(textures).slice(8, -1);
        // 一级texture Texture数组
        if (type === 'Array') {
            frames = [...textures];
        } else {
            // 3级textures 这个对象为Resource对象
            if (special) {
                _textures = _.cloneDeep(textures);
                texture = _textures.textures[special];
                frame = _textures.data.frames[special];
                height = texture.height / rowCount;
                width = texture.width / colCount;
                // 从左到右，从上到下
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        let rectangle = new PIXI.Rectangle(frame.frame.x + j * width, frame.frame.y + i * height, width, height);
                        let distTexture = _.cloneDeep(texture);
                        distTexture.frame = rectangle;
                        frames.push(distTexture);
                    }
                }
            } else {
                // 二级texture Texture对象
                texture = textures;
                // 单个一级图
                if (rowCount === 1 && colCount === 1) {
                    frames.push(_.cloneDeep(texture));
                } else {
                    // 二级图
                    height = texture.height / rowCount;
                    width = texture.width / colCount;
                    for (let i = 0; i < rowCount; i++) {
                        for (let j = 0; j < colCount; j++) {
                            let rectangle = new PIXI.Rectangle(j * width, i * height, width, height);
                            let distTexture = _.cloneDeep(texture);
                            distTexture.frame = rectangle;
                            frames.push(distTexture);
                        }
                    }
                }
            }
        }
        this.frames = [...this.frames, ...frames];
        return frames;
    }

    _loadFramesFromIMG(frames, rowCount = 1, colCount = 1) {
        let rawTexture;
        const type = toString.call(frames).slice(8, -1);
        // 一系列图片
        if (type === 'Array') {
            this.isSingleFileWithFrame = true;
            const rawTextures = frames.map((frame) => {
                return PIXI.Texture.fromImage(frame);
            });
            return this._loadFramesFromResource(rawTextures, null, rowCount, colCount);
        }
        // 一张雪碧图
        if (width && height) {
            rawTexture = PIXI.Texture.fromImage(frames);
            // 从左到右，从上到下
            return this._loadFramesFromResource(rawTexture, null, rowCount, colCount);
        }
        // 一张单图
        return this._loadFramesFromResource(PIXI.Texture.fromImage(frames))
    }

    _loadFramesFromJSON(resource, special, rowCount = 1, colCount = 1) {
        return this._loadFramesFromResource(resource, special, rowCount, colCount);
    }

    loadFrames(frames, rowCount, colCount, special) {
        const rt = this.frames.length;
        const type = toString.call(frames).slice(8, -1);
        // 一级小texture
        if (type === 'Array') {
            this.isSingleFileWithFrame = true;
            this._loadFramesFromIMG(frames, rowCount, colCount);
        }

        if (type === 'Object') {
            this._loadFramesFromJSON(frames, special, rowCount,colCount);
        }

        if (type === 'String') {
            const pix = frames.split('.')[1];
            // 判断条件
            // 加载
            this._loadFramesFromIMG(frames, rowCount, colCount);
        }
        // 二级png
        return rt;
    }

    // 分配帧给某个特定行为
    dispatchAnimation(actionType, ...sequence) {
        this.animations[actionType] ? this.animations[actionType] : this.getSequenceFrames(sequence);
    }

    // 直接运行分配帧
    directAnimationFrames(...sequence) {
        this.animate(this.getSequenceFrames(sequence));
    }


    directAnimationFramesOnce(...sequence) {
        this.animateOnce(this.getSequenceFrames(sequence));
    }

    // 根据参数获取指定帧
    getSequenceFrames(sequence, base = 0) {
        let sequenceFrames = [];
        sequence.length
            ? sequence.forEach((val) => {
                let type = toString.call(val).slice(8, -1)
                if (type === 'Array') {
                    sequenceFrames = [...sequenceFrames, ...val.map(v => this.frames[v+base])];
                }
                if (type === 'Object') {
                    if (typeof val.start !== 'undefined') {
                        const end = val.end ? val.end : this.frames.length - 1;
                        const arr = Array.from({ length: end - val.start + 1 }, (v, k) => { return k + val.start });
                        sequenceFrames = [...sequenceFrames, ...arr.map(v => this.frames[v+base])];
                    } else {
                        console.error('对象必须包含start属性');
                    }
                }
                if (type === 'Number') {
                    sequenceFrames.push(this.frames[val+base]);
                }
                if (type === 'String') {
                    sequenceFrames.push(this.frames[+val+base]);
                }
            })
            : sequenceFrames;
        return sequenceFrames;
    }

    // 根据传入帧产生动画
    _animate = (frames, callback, once) => {
        // 重置帧状态
        this.currentFrame = 0;
        this.isStop = false;
        // 设置缓存帧
        this.cacheFrames = frames;
        // 帧循环控制
        this.loop(() => {
            this.sprite.texture = this.cacheFrames[this.currentFrame];
            this.currentFrame = (this.currentFrame + 1) % this.cacheFrames.length;
            callback.call(this.owner, this.owner);
        }, once);
    }

    changeFrame(frame) {
        this.sprite.texture = frame;
    }

    // 逆向帧动画
    _animateReverse(frames, callback, once) {

    }

    // 只动画一次
    animateOnce(frames, callback) {
        this._animate(frames, callback, true);
    }

    // frames and action
    animate(frames, callback) {
        this._animate(frames, callback);
    }

    pause() {
        this.isStop = true;
    }

    resume() {
        this.isStop = false;
        this.currentFrame = (this.currentFrame + 1) % this.cacheFrames.length;
        // 控制程序
        this.loop(() => {
            this.sprite.texture = this.cacheFrames[this.currentFrame];
            this.currentFrame = (this.currentFrame + 1) % this.cacheFrames.length;
        })
    }

    stop() {
        this.isStop = true;
        window.cancelRequestAnimFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })();
        window.cancelRequestAnimFrame(this.timer);
    }

    loop = (callback, once) => {
        const interval = 1000 / this.fps;
        let delta;
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (this.isStop) {
            this.stop();
            return;
        }

        // 简单的通过最后帧和是否once参数来决定是否继续循环

        if (once && this.currentFrame === this.sequenceFrame.length - 1) {
            this.stop();
            return;
        }
        // 请求动画帧
        if (window.requestAnimationFrame) {
            let now = Date.now();
            delta = now - this.now;
            if (delta > interval) {
                this.now = now - (delta % interval);
                callback();
            }
            this.timer = window.requestAnimationFrame(this.loop.bind(this, callback, once));
        }
    }


}
// 制作帧动画辅助函数..真的麻烦

// 支持两种方式，传递图片数组和雪碧图

// 雪碧图有部分帧动画([1,2,5])和全部帧动画(支持顺序)()，以及支持start end对象表示法(1, 8)
// 数组表示个别帧,对象表示连续帧
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default class AnimationManager{
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
        this.fps = 2;
        this.now = Date.now();
        this.animations = {};
    }
    

    setFPS(fps) {
        this.fps = fps;
    }

    loadFrames(frames, width, height, special, textures) {
        let rowCount, colCount, rawTexture;
        const type = toString.call(frames).slice(8, -1);
        if (type === 'Array') {
            this.isSingleFileWithFrame = true;
            for (let i=0;i<frames.length;i++) {
                let texture = PIXI.Texture.fromImage(frames[i]);
                this.frames.push(texture);
            }
            return;
        }

        if (width && height) {
            const pix = frames.split('.')[1];
            if (pix === 'png') {
                rawTexture = PIXI.Texture.fromImage(frames);
                rowCount = Math.ceil(rawTexture.height/height);
                colCount = Math.ceil(rawTexture.width/width);
                // 从左到右，从上到下
                for (let i=0;i<rowCount;i++) {
                    for (let j=0;j<colCount;j++) {
                        let rectangle = new PIXI.Rectangle(i*height,j*width,width,height);
                        let distTexture = _.cloneDeep(rawTexture);
                        distTexture.frame = rectangle;
                        this.frames.push(distTexture);
                    }
                }
                return;
            } else if (pix === 'json') {
                if (special && textures) {
                    const _textures = _.cloneDeep(textures);
                    const texture = _textures.textures[special];
                    const frame = _textures.data.frames[special];
                    // 必须传入texture，不能自己生成texture
                    rowCount = Math.ceil(texture.height/height);
                    colCount = Math.ceil(texture.width/width);
                    // 从左到右，从上到下
                    for (let i=0;i<rowCount;i++) {
                        for (let j=0;j<colCount;j++) {
                            let rectangle = new PIXI.Rectangle(frame.frame.x + j*width, frame.frame.y + i*height, width, height);
                            let distTexture = _.cloneDeep(texture);
                            distTexture.frame = rectangle;
                            this.frames.push(distTexture);
                        }
                    }
                    return;
                }
                return;
            } else {
                console.log('other function later');
            }
            return;
        }
    }

    // 分配帧给某个特定行为
    dispatchAnimation(actionType, ...sequence) {
        this.animations[actionType]?this.animations[actionType]:this._getSequenceFrames(sequence);
    }

    // 直接运行分配帧
    directAnimationFrames(...sequence) {
        this.animate(this._getSequenceFrames(sequence));
    }


    directAnimationFramesOnce(...sequence) {
        this.animateOnce(this._getSequenceFrames(sequence));
    }

    // 根据参数获取指定帧
    _getSequenceFrames(sequence) {
        let sequenceFrames = [];
        sequence.length
        ?sequence.forEach((val) => {
            let type = toString.call(val).slice(8, -1)
            if (type === 'Array') {
                sequenceFrames = [...sequenceFrames, ...val.map(v=>this.frames[v])];
            } 
            if (type === 'Object') {
                if (val.start) {
                    const end = val.end ? val.end: this.frames.length-1;
                    const arr = Array.from({length: end - val.start + 1}, (v, k) => {return k+val.start});
                    sequenceFrames = [...sequenceFrames, ...arr.map(v=>this.frames[v])];
                } else {
                    console.error('对象必须包含start属性');
                }
            }
            if (type === 'Number') {
                sequenceFrames.push(this.frames[val]);
            }
            if (type === 'String') {
                sequenceFrames.push(this.frames[+val]);
            }
        })
        :sequenceFrames;
        return sequenceFrames;
    }

    // 根据传入帧产生动画
    _animate(frames, once){
        // 重置帧状态
        this.currentFrame = 0;
        this.isStop = false;
        // 设置缓存帧
        this.cacheFrames = frames;
        // 帧循环控制
        this.loop(()=> {
            this.sprite.texture = this.cacheFrames[this.currentFrame];
            this.currentFrame = (this.currentFrame+1)%this.cacheFrames.length;
        }, once);
    }


    animateOnce(frames) {
        this._animate(frames, true);
    }

    animate(frames) {
        this._animate(frames);
    }

    pause(){
        this.isStop = true;
    }

    resume() {
        this.isStop = false;
        this.currentFrame = (this.currentFrame+1)%this.cacheFrames.length;
        // 控制程序
        this.loop( ()=> {
            this.sprite.texture = this.cacheFrames[this.currentFrame];
            this.currentFrame = (this.currentFrame+1)%this.cacheFrames.length;
        })
    }

    stop() {
        this.isStop = true;
        window.cancelRequestAnimFrame = ( function() {
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
        const interval = 1000/this.fps;
        let delta;
        window.requestAnimationFrame  = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (this.isStop) {
            this.stop();
            return;
        }

        // 简单的通过最后帧和是否once参数来决定是否继续循环

        if (once && this.currentFrame === this.sequenceFrame.length-1) {
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
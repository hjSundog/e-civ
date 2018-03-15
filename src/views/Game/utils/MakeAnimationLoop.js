// 制作帧动画辅助函数..真的麻烦

// 支持两种方式，传递图片数组和雪碧图

// 雪碧图有部分帧动画([1,2,5])和全部帧动画(支持顺序)()，以及支持from to(1, 8)
// 数组表示个别帧,对象表示连续帧
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default class AnimationManager{
    constructor(sprite) {
        this.sprite = sprite;
        // 默认传入雪碧图
        this.isSingleFileWithFrame = false;
        this.frames = [];
        this.currentFrame = 0;
        this.isStop = true;
        this.fps = 2;
        this.now = Date.now();
    }

    loadFrames(frames, width, height, special, texture) {
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
                if (special && texture) {
                    // 必须传入texture，不能自己生成texture
                    rowCount = Math.ceil(texture.height/height);
                    colCount = Math.ceil(texture.width/width);
                    // 从左到右，从上到下
                    for (let i=0;i<rowCount;i++) {
                        for (let j=0;j<colCount;j++) {
                            let rectangle = new PIXI.Rectangle(i*height,j*width,width,height);
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

    animate() {
        this.isStop = false;
        this.loop(()=> {
            //console.log('ha');
            this.sprite.texture = this.frames[this.currentFrame];
            this.currentFrame = (this.currentFrame+1)%this.frames.length;
        });
    }

    pause(){
        this.isStop = true;
    }

    resume() {
        this.isStop = false;
    }

    stop() {
        this.isStop = true;
        window.cancelRequestAnimationFrame(this.timer);
    }

    loop = (callback) => {
        const interval = 1000/this.fps;
        let delta;
        window.requestAnimationFrame  = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (this.isStop) {
            return;
        }

        if (window.requestAnimationFrame) {
            let now = Date.now();
            delta = now - this.now;
            if (delta > interval) {
                this.now = now - (delta % interval);
                callback();
            }
            this.timer = window.requestAnimationFrame(this.loop.bind(this, callback));
        }
    }


}
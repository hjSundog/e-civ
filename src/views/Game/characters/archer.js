import Soldier from './Soldier'
import * as PIXI from 'pixi.js'

export default class Archer extends Soldier {
    static primarity = 0;

    constructor(cache) {
        super(cache);
        this.init('Archer');
        // this.loadFrames(rowCount, colCount,[]) // 没有传frames组,cache为undefined时直接从指定文件夹加载
        // 以4*4加载帧图形
        this.loadFrames('MOVE', 4 , 4, null, 'Archer.png'); // 已经传入了frames组
        this.loadFrames('DEAD', 4, 3, null, 'Archer_dead.png');
        //this.initActionState()
        this.setState((frames, state)=>{
            return {
                'MOVE' : {
                    'UP':[12, 15],
                    'DOWN': [0, 3],
                    'LEFT': [4, 7],
                    'RIGHT': [8, 11]
                },
                'DEAD': [0, 2]
            }
        })
    }

}
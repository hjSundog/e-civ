import Soldier from './Soldier'
import * as PIXI from 'pixi.js'
import noop from '@/utils/noop.js';
import { arch } from 'os';
export default class Archer extends Soldier {
    constructor(cache, blood) {
        super(cache, blood);
        this.primarity = 0;
        this.attackArea = 6;
        this.ATK = 5;
        this.SoldierType = "Archer";
        this.isShotType = true;
        this.init(Math.floor(Math.random()*800), Math.floor(Math.random()*600),true,()=>{
            console.log('Archer');
        });
        // this.loadFrames(rowCount, colCount,[]) // 没有传frames组,cache为undefined时直接从指定文件夹加载
        // 以4*4加载帧图形
        this.loadFrames('INIT.MOVE.TURN', 4 , 4, null, 'Archer.png'); // 已经传入了frames组
        this.loadFrames('DEAD', 4, 4, null, 'Archer_dead.png');
        this.loadFrames('ATTACK', 4, 4, null, 'Archer_melee.png');
        this.loadFrames('SHOT', 4, 4, null, 'Archer_shot.png');
        //this.initActionState()
        this.setState((archer)=>{
            return {
                'INIT': 8, // 该字段必须
                'TURN': {
                    'UP': 12,
                    'DOWN': 0,
                    'LEFT': 4,
                    'RIGHT': 8
                },
                'MOVE' : {
                    'UP':[12, 15],
                    'DOWN': [0, 3],
                    'LEFT': [4, 7],
                    'RIGHT': [8, 11]
                },
                'ATTACK': {
                    'UP':[12, 15],
                    'DOWN': [0, 3],
                    'LEFT': [4, 7],
                    'RIGHT': [8, 11]       
                },
                'DEAD': [0, 2],
                'SHOT': {
                    'UP': 12,
                    'DOWN': 0,
                    'LEFT': 4,
                    'RIGHT': 8
                }
            }
        });
    }

}
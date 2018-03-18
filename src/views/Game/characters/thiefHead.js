import Soldier from './Soldier';

export default class ThiefHead extends Soldier {
    constructor(cache) {
        super(cache);
        this.primarity = 3;
        this.SoldierType = "ThiefHead";
        this.init(Math.floor(Math.random()*800), Math.floor(Math.random()*600), true,()=>{
            console.log('ThiefHead');
        });
        this.loadFrames('INIT.TURN.MOVE', 4 , 4, null, 'ThiefHead.png'); // 已经传入了frames组
        this.loadFrames('DEAD', 4, 3, null, 'ThiefHead_dead.png');
        //this.initActionState()
        this.setState((frames, state)=>{
            return {
                'INIT': 8,
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
                'DEAD': [0, 2]
            }
        })
        // 改变帧
        this.changeFrame('TURN@DOWN')

        this.setAction('MOVE@UP', (archer)=>{
            typeof archer.moveUP === 'function'?archer.moveUP(3):console.log('不是一个方法');
            //archer.moveUp();
        })


        this.setAction({
            name: ['MOVE@DOWN'],
            callback: (archer) => {
                archer.moveDown(3);
            }
        })

        this.setAction([{
            name: 'MOVE@LEFT',
            callback: (archer) => {
                archer.moveLeft(3);
            }
        },{
            name: 'MOVE@RIGHT',
            callback: (archer) => {
                archer.moveRight(3);
            }
        }])
    }

}
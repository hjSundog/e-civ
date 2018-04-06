import Soldier from './Soldier';

export default class ThiefHead extends Soldier {
    constructor(cache, blood) {
        super(cache, blood);
        this.primarity = 3;
        this.SoldierType = "ThiefHead";
        this.init(Math.floor(Math.random()*800), Math.floor(Math.random()*600), true,()=>{
            console.log('ThiefHead');
        });
        this.loadFrames('INIT.TURN.MOVE', 4 , 4, null, 'ThiefHead.png'); // 已经传入了frames组
        this.loadFrames('DEAD', 4, 4, null, 'ThiefHead_dead.png');
        this.loadFrames('ATTACK', 4, 4, null, 'ThiefHead_melee.png')
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
                'ATTACK': {
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
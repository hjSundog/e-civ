import Soldier from './Soldier';

export default class ThiefHead extends Soldier {
    static primarity = 3;
    static SoldierName = "ThiefHead";

    constructor(cache) {
        super(cache);
        this.init('ThiefHead');
        this.loadFrames('MOVE', 4 , 4, null, 'ThiefHead.png'); // 已经传入了frames组
        this.loadFrames('DEAD', 4, 3, null, 'ThiefHead_dead.png');
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
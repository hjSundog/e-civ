import Soldier from './Soldier';

export default class ThiefHead extends Soldier {
    static primarity = 3;
    static SoldierName = "ThiefHead";

    constructor(cache) {
        super(cache);
        this.SoldierType = 'ThiefHead';
        this.init();
    }

}
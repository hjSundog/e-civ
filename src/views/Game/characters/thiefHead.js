import Solider from './Solider'

export default class ThiefHead extends Solider {
    static primarity = 3;
    static SoldierName = "ThiefHead";

    constructor(cache) {
        super(cache);
        this.SoldierType = 'ThiefHead';
        this.texture = cache['ThiefHead.png'];
        this.init();
    }

}
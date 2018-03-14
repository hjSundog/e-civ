import Solider from './Solider'

export default class ThiefHead extends Solider {
    constructor(cache) {
        super(cache);
        this.SoldierType = 'ThiefHead';
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache['ThiefHead.png']);
    }

    static primarity = 3;
    static SoldierName = "ThiefHead";
}
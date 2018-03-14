import Solider from './Solider'
import * as PIXI from 'pixi.js'

export default class Archer extends Solider {
    constructor(cache) {
        super(cache);
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache['Archer.png']);
        this.SoldierType = 'Archer';
    }
    static primarity = 0;
}
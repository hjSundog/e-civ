import Solider from './Solider'
import * as PIXI from 'pixi.js'

export default class Archer extends Solider {
    static primarity = 0;

    constructor(cache) {
        super(cache);
        this.texture = cache['Archer.png'];
        this.SoldierType = 'Archer';
        this.init();
    }

}
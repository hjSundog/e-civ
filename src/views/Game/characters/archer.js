import Soldier from './Soldier'
import * as PIXI from 'pixi.js'

export default class Archer extends Soldier {
    static primarity = 0;

    constructor(cache) {
        super(cache);
        this.SoldierType = 'Archer';
        this.init();
        //this.initActionState()
    }

}
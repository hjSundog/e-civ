import React from 'react'
import Game from '@/components/Game'

const enemy = [{
    soldierType: 'Archer',
    count: 420
},{
    soldierType: 'ThiefHead',
    count: 350
}];

const my =  [{
    soldierType: 'Archer',
    count: 620
},{
    soldierType: 'ThiefHead',
    count: 130
}];

class GameScene extends React.Component {
    constructor () {
        super()
        this.state = {
            isPlay: true,
            count: 1
        }
    }

    componentDidMount() {

    }

    render () {
        return (
            <div ref={(node)=>this.node = node}>
                <Game enemy={enemy}
                    my = {my}
                />
            </div>
        )
    }
}


export default GameScene
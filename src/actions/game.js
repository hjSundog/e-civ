export const SET_GAME = 'SET_GAME'

export function set_game(data) {
    return {
        type: SET_GAME,
        game: data
    }
}

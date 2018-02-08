import {
    ADD_MESSAGE,
    ADD_INVITATION
} from '../actions/websocket';

const initialState = {
    log: [],
    chatChannels: {

    },
    invitations: []
};

export default function websocket(state = initialState, action = {}) {
    switch (action.type) {
    case ADD_INVITATION: 
        return {
            ...state, 
            invitations: [
                ...state.invitations,
                action.payload.data
            ]
        }
    case ADD_MESSAGE:
        switch(action.payload.data.type) {
        case 'chat-joined':
            return {
                ...state,
                log: [...state.log, action.payload.data],
                chatChannels: {
                    ...state.chatChannels,
                    [action.payload.data.channel]: {
                        ...action.payload.data,
                        messages: [] // TODO: 历史记录
                    }
                }
            }
        // {
        //     channel: 'faE3A',
        //     message: {
        //         sender: {},
        //         content: "很烦、玩蛇"
        //     }
        // }
        case 'chat-message':
            return {
                ...state,
                log: [...state.log, action.payload.data],
                chatChannels: {
                    ...state.chatChannels,
                    [action.payload.data.channel]: {
                        ...state.chatChannels[action.payload.data.channel],
                        messages: [...state.chatChannels[action.payload.data.channel].messages, action.payload.data.message],
                    }
                }
            }
        default:
            return state
        }
    default:
        return state;
    }
}

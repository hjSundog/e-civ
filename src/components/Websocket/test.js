
// 测试发起邀请动作  默认目标是admin用户
const TestWSs = []

export function testStartInvitation() {
    // 这里模拟4个人['吕飞', 'lwio', 'break', 'inferno']发送邀请交易
    let i = 0;
    let names = ['3', '2', '5', '6'];
    let invators = ['吕飞', 'lwio', 'break', 'inferno']
    let payloads = ['约不？', '哈哈', '大大大大', '一如既往的mdzz']
    const tokens = [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhIjp7ImFnZSI6MjEsInNleCI6Im1hbGUifSwibmFtZSI6IjMiLCJwZXJzb25faWQiOm51bGwsInVzZXJuYW1lIjoiMyIsImlhdCI6MTUxODU5OTAyMX0.x2ZvyBdrrddjutzXNYBELkO3Y5wm7FK2jC-1a76u8aM",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhIjp7ImFnZSI6MjEsInNleCI6Im1hbGUifSwibmFtZSI6IjIiLCJwZXJzb25faWQiOm51bGwsInVzZXJuYW1lIjoiMiIsImlhdCI6MTUxODU5OTAyMX0.kx7HBYgh9nobif_wP_4_gqfW1Xjnk3UFAYc-uCyhcAw",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhIjp7ImFnZSI6MjEsInNleCI6Im1hbGUifSwibmFtZSI6IjUiLCJwZXJzb25faWQiOm51bGwsInVzZXJuYW1lIjoiNSIsImlhdCI6MTUxODU5OTAyMX0.DljmEY5favmhF66c_2uuUwDrf-rSfKG09Dfr54qxqjk",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhIjp7ImFnZSI6MjEsInNleCI6Im1hbGUifSwibmFtZSI6IjYiLCJwZXJzb25faWQiOm51bGwsInVzZXJuYW1lIjoiNiIsImlhdCI6MTUxODU5OTAyMX0.YvFRcrXM02kxYBYyUo8ngb5EcYmN8-tHoPUdD0xshs8"
    ]

    invators.forEach((nvt) => {
        let url = 'ws://localhost:8089?token=';
        let token = tokens[i];
        i++;
        const ws = new WebSocket(url+token);
        ws.id = names[i-1];   // 以后使用auth.user.username 代替
        TestWSs.push(ws)
        ws.onopen = (function(i){
            return () => {
                ws.send(JSON.stringify({
                    from: names[i-1], // 以后使用auth.user.username
                    source: {
                        name: nvt,
                        level: 10
                    },
                    type: 'INVITATION',
                    to: 'admin',
                    data: {
                        message: payloads[Math.floor(Math.random() * payloads.length)],
                        operation: 'invite'
                    },
                    created_at: new Date().toLocaleDateString()
                })
                )
            }
        })(i)

        ws.onmessage = (message) => {
            const tMessage = JSON.parse(message.data);
            console.log('mdzz')
            if (tMessage.type === "INVITATION") {
                if(!tMessage.data) {
                    return
                }
                switch(tMessage.data.operation) {
                case 'refuse':
                    // this.props.actions.add_invitation(tMessage);
                    console.log(tMessage.data.message + tMessage.to)
                    break;
                case 'receive': 
                    // this.props.actions.cancle_invitation(tMessage);
                    console.log(tMessage.data.message + tMessage.to)
                    break;
                default:
                    return 
                }
            } else {
                this.props.actions.add_message(tMessage);
            }
        }
    })
}

// 测试发起者取消邀请
export function testCancleInvitation() {
    const randowWSIndex = Math.floor(Math.random()*TestWSs.length)
    const randomWS = TestWSs[randowWSIndex]
    console.log('现在要取消id为'+randomWS.id+'的邀请')
    randomWS.send(JSON.stringify({
        from: randomWS.id,
        type: 'INVITATION',
        to: 'admin',
        data: {
            operation: 'cancle',
            message: '我取消这个请求了哟~~'
        },
        created_at: new Date().toLocaleDateString()
    }))
}

// 测试接受者拒绝邀请
export function testRefuseInvitation() {

}

// 测试接受者接受邀请
export function testReceiveInvitation() {

}

//

export function testStartInvitation() {
    // 这里模拟4个人['吕飞', 'lwio', 'break', 'inferno']发送邀请交易
    let i = 1;
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
        let token = tokens[i-1];
        i++;
        const ws = new WebSocket(url+token);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                id: i++,
                souce: {
                    inviter: nvt,
                    level: 10
                },
                type: 'INVITATION',
                target: 'admin',
                data: {
                    message: payloads[Math.floor(Math.random() * payloads.length)],
                    operation: 'invite'
                },
                created_at: new Date().toLocaleDateString()
            })
            )
        }
    })
}

export function testCancleInvitation() {

}

export function testCloseInvitation() {

}

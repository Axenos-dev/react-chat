const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server, {cors: {origin: "*" }})

const rooms = new Map()

app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

app.get("/rooms/:id", (req, res) => {
    const roomId = req.params.id
    console.log(roomId)

    const obj = rooms.has(roomId) ?{

        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]

    } : 

    {users: [], messages: []}

    res.json(obj)
})

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body

    if(!rooms.has(roomId)) {
        rooms.set(roomId,

        new Map([
            ['users', new Map()],
            ['messages', []],
        ]))
    }
    res.send()
})

io.on('connection', (socket) => {
    socket.on('room:join', ({roomId, userName}) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.broadcast.to(roomId).emit('room:joined', users)
    })

    socket.on('room:new_message', ({roomId, userName, text, date}) => {
        const obj = {
            userName,
            text,
            date
        }

        rooms.get(roomId).get('messages').push(obj)

        socket.broadcast.to(roomId).emit('room:new_message', obj)
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()]
                socket.broadcast.to(roomId).emit('room:disconnected', users)
            }
        })
    })

    console.log('socket connected', socket.id)
})

server.listen(4000, (err) => {
    if (err) throw Error(err)

    console.log("Started")
})
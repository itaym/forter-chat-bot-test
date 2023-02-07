const chatManagement = (io, type, MessageController) => {

    const leaveRoom = (socket, roomName) => {
        const room = io.sockets.adapter.rooms.get(socket.room)

        delete room?.metadata.users[socket.user_id]

        socket.leave(roomName)
    }

    const getNewUsername = (users, user_id, userName) => {
        const [oldName] = userName.split('_')
        let checkAgain = true
        let counter = 0
        let newName = oldName

        while (checkAgain && userName) {
            checkAgain = false
            for (let [key, value] of Object.entries(users)) {
                if (key !== user_id && value === newName) {
                    newName = `${oldName}_${++counter}`
                    checkAgain = true
                    break
                }
            }
        }
        return newName
    }

    const updateRoomUser = (roomName, user_id, userName) => {
        const room = io.sockets.adapter.rooms.get(roomName)
        room.metadata.users[user_id] = getNewUsername(room.metadata.users, user_id, userName)

        return room.metadata
    }

    const onSocketOpen = (socket) => {
        if (socket.type !== type) return

        socket.user_id = socket.request['_query'].user_id
        socket.type = socket.request['_query'].type
        socket.room = socket.request['_query'].room

        socket.messaging = new MessageController()

        if (type === 'bot') {
            socket.room = socket.user_id
        }

        socket.join([socket.room])
        updateRoomUser(socket.room, socket.user_id, '')

        socket.on('disconnect', onSocketClose.bind(socket))
        socket.on('message', onMessage.bind(socket))

        socket.messaging.on('error', onError.bind(socket))
        socket.messaging.on('message', onReplay.bind(socket))
    }

    const onSocketClose = function () {
        const socket = this

        socket.offAny()
        socket.messaging.off('error')
        socket.messaging.off('message')
        delete socket.messaging

        leaveRoom(socket, socket.room)
    }

    const onMessage = function (message) {
        const socket = this

        message.metadata = updateRoomUser(socket.room, socket.user_id, message.name)
        message.name = message.metadata.users[socket.user_id]
        socket.name = message.name

        socket.messaging.message(message)
    }

    const onReplay = function(message) {
        const socket = this
        io.to(socket.room).emit('message', message)
    }

    const onError = function(error) {
        const socket = this
        const message = {
            metadata: updateRoomUser(socket.room, socket.user_id, socket.name),
            name: socket.name,
            text: [error],
        }

        io.to(socket.room).emit('message', message)
    }

    io.of('/').adapter['on']('create-room', (roomName) => {

        const room = io.sockets.adapter.rooms.get(roomName)

        if (!room.metadata)
            room.metadata = {
                users: {}
            }
    })

    io.on('connect', onSocketOpen)
    io.on('disconnect', onSocketClose)
}

export default chatManagement
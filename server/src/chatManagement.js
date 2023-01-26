const chatManagement = (io, type, MessageController) => {
    const sockets = {}

    const leaveRoom = (socket, roomName) => {
        const room = io.sockets.adapter.rooms.get(socket.room)
        if (room)
            delete room.metadata.users[socket.user_id]

        socket.leave(roomName)
    }

    const updateRoomUser = (roomName, user_id, userName) => {
        const room = io.sockets.adapter.rooms.get(roomName)
        let counter = 0
        let oldName = userName.split('_')[0]
        let newName = oldName
        let checkAgain = true

        while (checkAgain && userName && Object.entries(room.metadata.users).length) {
            for (let [key, value] of Object.entries(room.metadata.users)) {
                if (key !== user_id && value === newName) {
                    newName = `${oldName}_${++counter}`
                    checkAgain = true
                    break
                }
                checkAgain = false
            }
        }
        room.metadata.users[user_id] = newName
        return room.metadata
    }

    const onSocketOpen = (socket) => {
        socket.user_id = socket.request['_query'].user_id
        socket.type = socket.request['_query'].type

        if (socket.type !== type) return

        socket.messaging = new MessageController()

        switch (type) {
            case 'bot':
                socket.room  = socket.user_id
                break
            default:
                socket.room  = 'chat'
        }
        socket.join([socket.room])
        updateRoomUser(socket.room, socket.user_id, '')

        sockets[socket.user_id] = socket
        socket.on('disconnect', onSocketClose.bind(socket))
        socket.on('message', onMessage.bind(socket))

        socket.messaging.on('error', onError.bind(socket))
        socket.messaging.on('message', onReplay.bind(socket))
    }

    const onSocketClose = function () {
        const socket = this
        delete sockets[socket.user_id]

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
        io.to(socket.room).emit("message", message)
    }

    const onError = function(error) {
        const socket = this
        const message = {
            metadata: updateRoomUser(socket.room, socket.user_id, socket.name),
            name: socket.name,
            text: [error],
        }

        io.to(socket.room).emit("message", message)
    }

    io.of("/").adapter['on']("create-room", (roomName) => {

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
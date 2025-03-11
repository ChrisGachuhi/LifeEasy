const users = {} //Store connected users {userId: socketId}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user has connected', socket.id)

    //Store user Id once connection is established
    socket.on('registerUser', (userId) => {
      users[userId] = socket.id

      console.log(`User ${userId} has registered with socket ${socket.id}`)
    })

    //Handle disconnect
    socket.on('disconnect', () => {
      Object.keys(users).forEach((userId) => {
        if (users[userId] === socket.id) {
          delete users[userId]
        }
      })

      console.log('A user is disconnected', socket.id)
    })
  })
}

//Send real-time notifications
module.exports.notifyUser = (io, userId, event, message) => {
  const socketId = users[userId]

  if (socketId) {
    io.to(socketId).emit(event, message)
  }
}

//Send real-time notifications to admins
module.exports.notifyAdmins = (io, event, message) => {
  Object.keys(users).forEach((userId) => {
    io.to(users[userId]).emit(event, message)
  })
}

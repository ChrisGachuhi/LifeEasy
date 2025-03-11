const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.connect('mongodb://localhost:27017/LifeEasy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const testUser = new User({
  username: 'DBTestUser',
  email: 'dbtestuser@email.com',
  password: 'hashedpassword',
})

testUser
  .save()
  .then(() => console.log('User inserted successfully'))
  .catch((err) => console.error('Failed to insert user:', err))
  .finally(() => mongoose.connection.close())

import './config'
import { server } from './server'
import { socketServer } from './socket'
import mongoose from 'mongoose'

const runningInstance = server.listen(process.env.PORT, () => console.log('Server running on port: ' + process.env.PORT))
socketServer.attach(runningInstance)
mongoose.connect(
  process.env.MONGODB_URI as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => console.log(`Connected to DB: ${mongoose.connection.name}`))

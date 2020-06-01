import '../test.config'
// eslint-disable-next-line no-unused-vars
import http from 'http'
import { server } from '../../src/server'
import { socketServer } from '../../src/socket'
import socketClient from 'socket.io-client'
import mongoose from 'mongoose'
import supertest from 'supertest'

describe('Server', () => {
  let serverInstance: http.Server
  beforeEach((done) => {
    serverInstance = server.listen(process.env.PORT, () => {
      socketServer.attach(serverInstance)
      mongoose.connect(process.env.MONGODB_URI_TEST as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
        .then(() => done())
        .catch(done)
    })
  })

  afterEach(async () => {
    serverInstance.close()
    socketServer.close()
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  it('Should run', async () => {
    expect.assertions(3)
    expect(serverInstance.listening).toEqual(true)
    expect(mongoose.connection.name).toEqual('test')

    const connected = await new Promise<boolean>((resolve, reject) => {
      const socketClientInstance = socketClient.connect(`http://localhost:${process.env.PORT}`)
      socketClientInstance.on('connect', () => {
        resolve(socketClientInstance.connected)
      })
    })
    expect(connected).toBe(true)
  })
  it('Should receive a response', (done) => {
    supertest(serverInstance)
      .get('/')
      .expect(200, done)
  })
})

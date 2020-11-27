import Emittery from 'emittery'
import { Socket } from 'dgram'
import { Packet } from './packets'

@Emittery.mixin('emittery')
export class Connection {
  constructor(socket: Socket, bound: 'server' | 'client' | 'host') {
    socket.on('message', (buf) => {
      new Packet(bound)
    })
  }
}

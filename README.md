# NodePolus

new evtqueue = room.getGameDataAddQueue(pid)
e
new evt = new QueuedEvent();

evt.action = () => {
  // do thing
}

evtqueue.queue(evt);

// when we add the player's game data instance

room.getGameDataAddQueue(pid).fire();

//

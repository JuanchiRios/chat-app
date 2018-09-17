import Vue from 'vue'

export default {
  receiveAll (state, data) {
    data.threads.forEach((thread, index) => {
      // create new thread if the thread doesn't exist
      var threadMessages = data.messages[index]
      if (!state.threads[thread.id]) {
        createThread(state, thread.id, thread.title)
      }

      // add message
      threadMessages.sort((m1, m2) => m1.timestamp - m2.timestamp).forEach(message => {
        addMessage(state, message, state.threads[thread.id])
      })
    })
    // set initial thread to the one with the latest message
    console.log(state.threads)
    var lastThreadActive = data.threads[0] // state.threads.values().sort((t1, t2) => t1.lastMessage.timestamp - t2.lastMessage.timestamp)[0]
    setCurrentThread(state, lastThreadActive.id)
  },

  receiveMessage (state, message) {
    addMessage(state, message)
  },

  switchThread (state, id) {
    setCurrentThread(state, id)
  },
  addMessagesAndThread (state, payload) {
    if (!state.threads[payload.thread.id]) {
      createThread(state, payload.thread.id, payload.thread.title)
    }
    payload.messages.forEach(message => addMessage(state, message, state.threads[payload.thread.id]))
  }
}

function createThread (state, id, name) {
  Vue.set(state.threads, id, {
    id,
    name,
    messages: [],
    lastMessage: null
  })
}

function addMessage (state, message, thread) {
  if (!thread.messages.some(id => id === message.id)) {
    thread.messages.push(message.id)
    thread.lastMessage = message
  }
  // add it to the messages map
  var newMessage = {
    id: message.id,
    owner: message.owner,
    text: message.text,
    timestamp: message.timestamp
  }
  Vue.set(state.messages, message.id, newMessage)
}

function setCurrentThread (state, id) {
  state.currentThreadID = id
  if (!state.threads[id]) {
    debugger
  }
}

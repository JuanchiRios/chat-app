import * as api from '../api'

export const getAllMessages = ({ commit }) => {
  api.getInitialState().then(data => {
    commit('receiveAll', data)
  })
  // subscribe to new messages
  api.subscribeToDb((messages, thread) => {
    commit('addMessagesAndThread', { messages: messages, thread: thread })
  })
}

export const sendMessage = ({ commit }, payload) => {
  api.createMessage(payload)
}

export const switchThread = ({ commit }, payload) => {
  commit('switchThread', payload)
}

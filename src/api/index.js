import Firebase from 'firebase'
import 'firebase/firestore'
import config from '../config'

Firebase.initializeApp(config)
const db = Firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export async function getInitialState () {
  const DBcurrentUser = await db.doc('users/KIswUTHih1YWvMvLMUZC').get()
  console.log(db)
  const DBthreads = await Promise.all(DBcurrentUser.data().threads.map(ref => ref.get()))
  // [[m1_t1, m2_t1], [m1_t2]]
  const DBmessagesPerThread = await Promise.all(
    DBthreads.map(DBthread => DBthread.data())
      .map(thread => thread.messages
        .map(message => message.get()))
      .map(promiseArray => Promise.all(promiseArray)))
  const DBPublicThreads = await db.collection('threads').where('isPublic', '==', true).get()

  const currentUser = transformFirestoreObject(DBcurrentUser)
  const threads = DBthreads.map(DBthread => transformFirestoreObject(DBthread))
  const messages = DBmessagesPerThread.map(messages => messages.map(message => transformFirestoreObject(message)))
  const publicThreads = DBPublicThreads.docs.map(publicThread => transformFirestoreObject(publicThread))

  const data = { currentUser: currentUser, messages: messages, threads: threads, publicThreads: publicThreads }
  console.log(data)

  return data
}

function transformFirestoreObject (object) {
  var cleanObject = object.data()
  cleanObject.id = object.id
  return cleanObject
}

function transformFirestoreList (list) {
  return list.map(element => transformFirestoreObject(element))
}

export function createMessage ({ text, thread }) {
  const timestamp = Date.now()
  const message = {
    text,
    timestamp,
    owner: 'Juan'
  }

  db.collection('messages').add(message).then(function (docRef) {
    db.collection('threads').doc(thread.id).update({
      'messages': Firebase.firestore.FieldValue.arrayUnion(docRef)
    })
  })
}

export function subscribeToDb (cb) {
  db.doc('users/KIswUTHih1YWvMvLMUZC').get()
    .then(DBcurrentUser => {
      DBcurrentUser.data().threads.forEach(threadRef => {
        threadRef.onSnapshot(snapshot => {
          Promise.all(snapshot.data().messages.map(m => m.get()))
            .then(messages => cb(transformFirestoreList(messages), transformFirestoreObject(snapshot)))
        })
      })
    })
}

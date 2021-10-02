<template>
  <div id="app">
    <appNavigation :user="user" @logout="logout" />
    <router-view
      :user="user"
      :rooms="rooms"
      @logout="logout"
      @checkIn="checkIn"
      @addRoom="addRoom"
      @deleteRoom="deleteRoom"
    />
  </div>
</template>

<script>
import appNavigation from '@/components/Navigation.vue'
import Firebase from 'firebase'
import db from './db'

export default {
  name: 'app',
  components: {
    appNavigation
  },
  data() {
    return {
      user: null,
      rooms: []
    }
  },
  methods: {
    async logout() {
      try {
        await Firebase.auth().signOut()
        this.user = null
        this.$router.push('/login')
      } catch (error) {
        console.log('error >> ', error)
      }
    },
    async checkIn(data) {
      const roomRef = db
        .collection('user')
        .doc(data.hostId)
        .collection('rooms')
        .doc(data.roomId)

      roomRef.get().then((doc) => {
        if (doc.exists) {
          roomRef
            .collection('attendees')
            .doc(this.user.uid)
            .set({
              displayName: data.displayName,
              createdAt: Firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              console.log(`chat/${data.hostId}/${data.roomId}`)
              this.$router.push(`/chat/${data.hostId}/${data.roomId}`)
            })
        }
      })
    },
    async addRoom(roomName) {
      try {
        const create = await db
          .collection('user')
          .doc(this.user.uid)
          .collection('rooms')
          .add({
            name: roomName,
            createdAt: Firebase.firestore.FieldValue.serverTimestamp()
          })

        console.log('create >> ', create)
      } catch (error) {
        console.log('error >> ', error)
      }
    },
    async deleteRoom(roomId) {
      try {
        const create = await db
          .collection('user')
          .doc(this.user.uid)
          .collection('rooms')
          .doc(roomId)
          .delete()

        console.log('create >> ', create)
      } catch (error) {
        console.log('error >> ', error)
      }
    }
  },
  async mounted() {
    try {
      console.log('db >> ', db)
      Firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.user = user
          console.log('user >> ', user)

          db.collection('user')
            .doc(this.user.uid)
            .collection('rooms')
            .onSnapshot((snapShot) => {
              const snap = []
              snapShot.forEach((doc) => {
                snap.push({
                  id: doc.id,
                  name: doc.data().name
                })
              })
              this.rooms = snap.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return -1
                } else {
                  return 1
                }
              })

              // console.log("his.rooms >> ", this.rooms);
            })
          // ...
        } else {
          // User is signed out
          // ...
        }
      })
    } catch (error) {
      console.log('error >> ', error)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

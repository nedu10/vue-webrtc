<template>
  <div>
    <form class="mt-3" @submit.prevent="handleCheckIn">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="card bg-light">
              <div class="card-body" v-if="user">
                <h1 class="font-weight-light mb-0">Check in</h1>
                <p class="font-weight-bold" v-if="roomName">
                  To: <span class="text-primary">{{ roomName }}</span>
                </p>
                <section class="form-group">
                  <label class="form-control-label sr-only" for="displayName"
                    >Name</label
                  >
                  <input
                    required
                    class="form-control"
                    type="text"
                    v-model="displayName"
                  />
                </section>
                <div class="form-group text-right mb-0">
                  <button class="btn btn-primary" type="submit">
                    Check in
                  </button>
                </div>
              </div>
              <div class="card-body card-outline-danger text-center" v-else>
                <h1 class="text-danger card-title">Sorry</h1>
                <p class="card-text lead">
                  Sorry, access to rooms is only available to registered users.
                  Please
                  <router-link to="/login">login</router-link> or
                  <router-link to="/register">register</router-link> and try
                  again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Firebase from 'firebase'
import db from '../db'
export default {
  name: 'checkin',
  data() {
    return {
      displayName: '',
      roomName: ''
    }
  },
  props: ['user'],
  methods: {
      handleCheckIn(){
          
          this.$emit('checkIn', {
              hostId: this.$route.params.host_id,
              roomId: this.$route.params.room_id,
              displayName: this.displayName
          })
      }
  },
  async mounted() {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.displayName = user.displayName
      }
    })
    db.collection('user')
      .doc(this.$route.params.host_id)
      .collection('rooms')
      .doc(this.$route.params.room_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.roomName = doc.data().name
        } else {
          this.$router.replace('/')
        }
      })
  }
}
</script>
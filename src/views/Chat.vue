<template>
  <div class="container-fluid mt-4">
    <div class="mb-3">
      <span class="mb-0 h2 text-primary">{{ roomName }}</span>
      <span class="ml-1" v-if="user && user.uid != hostId">
        Hosted by:
        <strong class="text-danger text-uppercase">{{
          hostDisplayName
        }}</strong>
      </span>
    </div>
    <div class="row" v-if="(user && user.uid == hostId) || approvedAttendee">
      <div class="col-md-8">
        <vue-webrtc
          ref="webrtc"
          width="100%"
          :roomId="roomId"
          @joined-room="doAttendeeJoined"
          @left-room="doAttendeeLeft"
        />
      </div>
      <div class="col-md-4">
        <button
          class="btn btn-primary mr-1"
          v-if="!attendeeJoined && approvedAttendee"
          @click="doJoin"
        >
          Join
        </button>
        <button type="button" class="btn btn-danger mr-1" v-if="attendeeJoined" @click="doLeave">
          Leave
        </button>
        <h4 class="mt-2">Attendees</h4>
        <ul class="list-unstyled">
          <li v-for="attendee in approvedAttendees" :key="attendee.id">
            <span
              v-if="user && user.uid == hostId"
              class="mr-2"
              title="User"
              @click.prevent="toggleAttendee(attendee.id)"
            >
              <font-awesome-icon icon="user"></font-awesome-icon>
            </span>
            <span class="mr-2" title="On Air" :class="[attendee.webRTCID ? 'text-success': 'text-secondary ']">
              <font-awesome-icon icon="podcast"></font-awesome-icon>
            </span>
            <span></span>
            <span
              class="pl-1"
              :class="[
                attendee && attendee.id == user.uid
                  ? 'font-weight-bold text-primary'
                  : 'text-success'
              ]"
            >
              {{ attendee.displayName }}
            </span>
          </li>
        </ul>
        <div v-if="user && user.uid == hostId">
          <h5 class="mt-4">Pending</h5>
          <ul class="list-unstyled">
            <li
              class="mb-1"
              v-for="attendee in pendingAttendees"
              :key="attendee.id"
            >
              <span>
                <a
                  type="button"
                  class="mr-2"
                  title="Approve attendee"
                  @click.prevent="toggleAttendee(attendee.id)"
                >
                  <font-awesome-icon icon="user"></font-awesome-icon>
                </a>
                <a
                  type="button"
                  class="text-secondary pr-1"
                  title="Delete Attendee"
                  @click="deleteAttendee(attendee.id)"
                >
                  <font-awesome-icon icon="trash"></font-awesome-icon>
                </a>
              </span>
              <span
                class="pl-1"
                :class="[
                  attendee && attendee.id == user.uid
                    ? 'font-weight-bold text-primary'
                    : 'text-danger'
                ]"
                >{{ attendee.displayName }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="lead" v-if="user">
        Hi
        <strong class="text-primary font-weight-bold">{{
          user.displayName
        }}</strong
        >, you're currently in the room waiting for the owner of the chat to add
        you to the meeting. Please wait.
      </p>
    </div>
  </div>
</template>
<script>
import db from '../db'
export default {
  name: 'Attendees',
  props: ['user'],
  data() {
    return {
      hostId: this.$route.params.host_id,
      roomId: this.$route.params.room_id,
      roomName: '',
      hostDisplayName: '',
      attendeeJoined: false,
      pendingAttendees: [],
      approvedAttendees: [],
      approvedAttendee: false
    }
  },
  methods: {
    doJoin(){
      this.$refs.webrtc.join()
      this.attendeeJoined = true
    },
    doLeave(){
      this.$refs.webrtc.leave()
      this.attendeeJoined = false
    },
    doAttendeeJoined(join_id){
      const attendeeRef = db
          .collection('user')
          .doc(this.hostId)
          .collection('rooms')
          .doc(this.roomId)
          .collection('attendees')
          .doc(this.user.uid)

        attendeeRef.update({
          webRTCID: join_id
        })          
    },
    doAttendeeLeft(leave_id){
      console.log("leave_id >> ", leave_id);
      const attendeeRef = db
          .collection('user')
          .doc(this.hostId)
          .collection('rooms')
          .doc(this.roomId)
          .collection('attendees')
          .doc(this.user.uid)

        attendeeRef.update({
          webRTCID: null
        })          
    },
    toggleAttendee(attendeeId) {
      if (this.user && this.user.uid == this.hostId) {
        const attendeeRef = db
          .collection('user')
          .doc(this.user.uid)
          .collection('rooms')
          .doc(this.roomId)
          .collection('attendees')
          .doc(attendeeId)

        attendeeRef.get().then((attendeeDoc) => {
          const approved = attendeeDoc.data().approved
          if (approved) {
            attendeeRef.update({
              approved: !approved
            })
          } else {
            attendeeRef.update({
              approved: true
            })
          }
        })
      }
    },
    deleteAttendee(attendeeId) {
      if (this.user && this.user.uid == this.hostId) {
        db.collection('user')
          .doc(this.user.uid)
          .collection('rooms')
          .doc(this.roomId)
          .collection('attendees')
          .doc(attendeeId)
          .delete()
      }
    }
  },
  mounted() {
    const roomRef = db
      .collection('user')
      .doc(this.hostId)
      .collection('rooms')
      .doc(this.roomId)

    roomRef.get().then((roomDocument) => {
      if (roomDocument.exists) {
        this.roomName = roomDocument.data().name
      } else {
        this.$router.replace('/')
      }
    })

    roomRef.collection('attendees').onSnapshot((attendeesSnapShot) => {
      let amCheckedIn = false
      let tempPending = []
      let tempApproved = []

      attendeesSnapShot.forEach((attendeesDocument) => {
        if (this.user.uid == attendeesDocument.id) {
          amCheckedIn = true
        }
        if (this.hostId == attendeesDocument.id) {
          this.hostDisplayName = attendeesDocument.data().displayName
        }

        if (attendeesDocument.data().approved) {
          if (this.user.uid == attendeesDocument.id) {
            this.approvedAttendee = true
          }

          tempApproved.push({
            id: attendeesDocument.id,
            displayName: attendeesDocument.data().displayName,
            approved: attendeesDocument.data().approved,
            webRTCID: attendeesDocument.data().webRTCID
          })
        } else {
          if (this.user.uid == attendeesDocument.id) {
            this.approvedAttendee = false
          }

          tempPending.push({
            id: attendeesDocument.id,
            displayName: attendeesDocument.data().displayName,
            approved: attendeesDocument.data().approved,
            webRTCID: attendeesDocument.data().webRTCID
          })
        }
      })

      this.pendingAttendees = tempPending
      this.approvedAttendees = tempApproved

      if (!amCheckedIn) {
        this.$router.push(`/checkin/${this.hostId}/${this.roomId}`)
      }
    })
  }
}
</script>

<style lang="scss">
.video-list {
  margin-bottom: 10px;
  background: transparent !important;
}
.video-item {
  width: 50%;
  display: inline-block;
  background: transparent !important;
}

.video-item video {
  width: 100%;
  height: auto;
}
</style>
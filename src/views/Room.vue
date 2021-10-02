<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1 class="font-weight-light text-center">Add a Room</h1>

        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
                <input
                  type="text"
                  class="form-control"
                  name="roomName"
                  placeholder="Room name"
                  aria-describedby="buttonAdd"
                  v-model="roomName"
                  ref="roomRef"
                />
                <div class="input-group-append">
                  <button
                    type="submit"
                    class="btn btn-sm btn-info"
                    id="buttonAdd"
                    @click.prevent="handleAdd"
                  >
                    +
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-11 col-md-8 col-lg-6">
        <div class="card border-top-0 rounded-0">
          <div class="card-body py-2">
            <h4 class="card-title m-0 text-center">Your Rooms</h4>
          </div>
          <div class="list-group list-group-flush">
            <div
              class="list-group-item d-flex justify-content-between"
              v-for="(room, index) in rooms"
              :key="index"
            >
              <section
                class="
                  pl-3
                  text-left
                  align-self-center
                  font-weight-bold
                  text-capitalize
                "
              >
                {{ room.name }}
              </section>
              <section
                class="btn-group align-self-center"
                role="group"
                aria-label="Room Options"
              >
                <button
                  class="btn btn-sm btn-outline-secondary"
                  title="Delete Room"
                  @click.prevent="$emit('deleteRoom', room.id)"
                >
                  <font-awesome-icon icon="trash" />
                </button>

                <router-link
                  class="btn btn-sm btn-outline-secondary"
                  title="Check In"
                  :to="`/checkin/${user.uid}/${room.id}`"
                >
                  <font-awesome-icon icon="user" />
                </router-link>

                <router-link
                  class="btn btn-sm btn-outline-secondary"
                  title="Chat"
                  :to="`/chat/${user.uid}/${room.id}`"
                >
                  <font-awesome-icon icon="video" />
                </router-link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data() {
    return {
      roomName: ''
    }
  },
  props: ['rooms', "user"],
  methods: {
    async handleAdd() {
      this.$emit('addRoom', this.roomName)
      this.roomName = ''
      this.$refs.roomRef.focus()
    }
  }
}
</script>
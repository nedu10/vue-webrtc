<template>
  <div>
    <nav class="navbar navbar-expand bg-primary navbar-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/"
          ><span class="h2 pr-1">Video Chat</span>
          <span class="navbar-text small" v-if="user">
            : Hi
            <span class="font-weight-bold text-white text-capitalize">{{ user && user.displayName }}</span></span
          >
        </router-link>
        <div class="navbar-nav ml-auto">
          <router-link class="nav-item nav-link" to="/login" v-if="!user"
            >log in</router-link
          >
          <router-link class="nav-item nav-link" to="/register" v-if="!user"
            >register</router-link
          >
          <router-link class="nav-item nav-link btn btn-link"  v-if="user" to="/room"
            >rooms</router-link
          >
          <a class="nav-item nav-link btn btn-link"  v-if="user" @click.prevent="$emit('logout')"
            >logout</a
          >
        </div>
      </div>
    </nav>
  </div>
</template> 

<script>
export default {
  name: "Navigation",
  props: ['user']
}
</script>
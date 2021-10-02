import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faVideo, faPodcast, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import WebRTC from 'vue-webrtc'
import * as io from 'socket.io-client'

library.add(faUser, faVideo, faTrash, faPodcast)

window.io = io

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(WebRTC)

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

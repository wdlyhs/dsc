<template>
  <div class="con con_main">
      <Default v-if="userInfo" :data="userInfo"></Default>
      <ec-tab-down></ec-tab-down>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import axios from 'axios'

import EcTabDown from '@/components/tab-down/Frontend'
import Login from './Auth/Login'
import Default from './Auth/Default'

export default {
  name: 'user',
  components: {
    EcTabDown,
    Default
  },
  data(){
    return{}
  },
  created(){
    this.$store.dispatch('userProfile')
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
}
</script>
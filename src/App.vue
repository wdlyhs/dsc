<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import qs from 'qs'

import 'swiper/dist/css/swiper.css'

export default {
  name: 'app',
  data(){
  	return{
    }
  },
  mounted(){
	
  },
  computed:{
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import './assets/css/common/common.scss';
@import './assets/css/common/style.scss';
@import './assets/css/common/new.scss';

.el-loading-spinner .path {
  stroke: $color !important;
}

.el-loading-spinner .el-loading-text {
  color: $color !important;
}
</style>

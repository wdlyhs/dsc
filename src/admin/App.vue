<template>
  <div id="app">
      <dashboard></dashboard>
  </div>
</template>

<script>
import Dashboard from '@/pages/Admin/Dashboard'

export default {
  name: 'app',
  components: {
    Dashboard
  }
}
</script>

<style lang="scss">
@import '../assets/style/config';
@import '../assets/style/common/index';
</style>


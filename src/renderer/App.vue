<template>
	<div id="app">
		<div v-if="showTitle" class="title">RedisKit</div>
		<router-view></router-view>
	</div>
</template>

<script>
  import OSUtils from './utils/OSUtils'

  export default {
    name: 'RedisKit',
    computed: {
      showTitle () {
        return OSUtils.getOsInfo().name === 'Mac'
      }
    }
  }
</script>

<style>
</style>

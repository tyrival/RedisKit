<template>
	<div class="value-panel" v-show="showValuePanel()">
		<div class="menu">
			<el-button type="primary"> 保 存</el-button>
			<el-select v-model="dataFormat.current">
				<el-option v-for="(item, i) in dataFormat.list"
				           :key="item"
				           :label="item"
				           :value="item">
				</el-option>
			</el-select>
		</div>
		<div class="content">
			<div class="content-string"></div>
			<div class="content-hash"></div>
			<div class="content-list"></div>
			<div class="content-set"></div>
			<div class="content-zset"></div>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/value-panel.scss'

  export default {
    name: 'ValuePanel',
    props: ['servers'],
    data () {
      return {
        dataFormat: {
          current: 'RAW',
          list: ['RAW', 'JSON']
        }
      }
    },
    methods: {
      showValuePanel () {
        let key = this.servers.storage.index
        if (key !== null && key !== undefined) {
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>

</style>

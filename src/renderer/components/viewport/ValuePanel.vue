<template>
	<div class="value-panel">
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
		<div class="content"></div>
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
    }

  }
</script>

<style scoped>

</style>

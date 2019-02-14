<template>
	<div class="viewport">
		<ServerPanel :config="config"></ServerPanel>
		<KeyPanel :config="config" ref="keyPanel"></KeyPanel>
		<ValuePanel :config="config"></ValuePanel>
		<ServerEditor :config="config"></ServerEditor>
		<DataEditor :config="config"></DataEditor>
		<KeyContextMenu :config="config"></KeyContextMenu>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.scss'
  import ServerPanel from './viewport/ServerPanel'
  import KeyPanel from './viewport/KeyPanel'
  import ValuePanel from './viewport/ValuePanel'
  import ServerEditor from './viewport/ServerEditor'
  import DataEditor from './viewport/DataEditor'
  import KeyContextMenu from './viewport/KeyContextMenu'

  export default {
    name: 'Viewport',
    data () {
      return {
        config: {
          // 当前服务器索引
          index: null,
          // 连接实例
          client: null,
          // 服务器信息编辑窗口
          serverEditor: {
            show: false,
            index: null,
            model: {name: null, host: null, port: null, password: null}
          },
          dataEditor: {
            show: false,
            model: {name: null, type: null, value: null}
          },
          // key右键菜单
          keyContextMenu: {
            index: null,
            style: {top: 0, left: 0}
          },
          // 服务器信息列表
          servers: null
        }
      }
    },
    mounted () {
      this.$db.find({}, (_, docs) => {
        this.config.servers = docs
      })
    },
    components: {
      'ServerPanel': ServerPanel,
      'KeyPanel': KeyPanel,
      'ValuePanel': ValuePanel,
      'ServerEditor': ServerEditor,
      'DataEditor': DataEditor,
      'KeyContextMenu': KeyContextMenu
    }
  }
</script>

<style scoped>

</style>

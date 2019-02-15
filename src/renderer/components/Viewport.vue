<template>
	<div class="viewport">
		<ServerPanel :config="config"></ServerPanel>
		<KeyPanel :config="config" ref="keyPanel"></KeyPanel>
		<ValuePanel :config="config"></ValuePanel>
		<ServerEditor :config="config"></ServerEditor>
		<DataEditor :config="config"></DataEditor>
		<ExpireEditor :config="config"></ExpireEditor>
		<KeyNameEditor :config="config"></KeyNameEditor>
		<KeyDuplicateEditor :config="config"></KeyDuplicateEditor>
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
  import ExpireEditor from './viewport/ExpireEditor'
  import KeyNameEditor from './viewport/KeyNameEditor'
  import KeyDuplicateEditor from './viewport/KeyDuplicateEditor'
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
          // 设置过期时间窗口
          expireEditor: {
            key: null,
            model: {mode: 0, duration: 0, timestamp: 0}
          },
          // 重命名Key窗口
          keyNameEditor: {
            key: null,
            model: {key: null}
          },
          // 重命名Key窗口
          keyDuplicateEditor: {
            key: null,
            model: {key: null}
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
      'ExpireEditor': ExpireEditor,
      'KeyNameEditor': KeyNameEditor,
      'KeyDuplicateEditor': KeyDuplicateEditor,
      'KeyContextMenu': KeyContextMenu
    }
  }
</script>

<style scoped>

</style>

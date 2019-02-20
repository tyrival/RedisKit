<template>
	<div class="viewport"
	     v-loading="config.loadingDb"
	     element-loading-text="连接Redis..."
	     element-loading-spinner="el-icon-loading"
	     element-loading-background="rgba(0, 0, 0, 0.6)">
		<ServerPanel :config="config"></ServerPanel>
		<KeyPanel :config="config" ref="keyPanel"></KeyPanel>
		<ValuePanel :config="config"></ValuePanel>
		<ServerEditor :config="config"></ServerEditor>
		<DataEditor :config="config"></DataEditor>
		<ExpireEditor :config="config"></ExpireEditor>
		<KeyNameEditor :config="config"></KeyNameEditor>
		<KeyDuplicateEditor :config="config"></KeyDuplicateEditor>
		<KeyContextMenu :config="config"></KeyContextMenu>
		<Dashboard :config="config"></Dashboard>
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
  import Dashboard from './viewport/Dashboard'

  export default {
    name: 'Viewport',
    data () {
      return {
        config: {
          // 当前服务器索引
          index: null,
          // 加载数据库动画
          loadingDb: false,
          // 连接实例
          client: null,
          // 服务器信息编辑窗口
          serverEditor: {
            show: false,
            index: null,
            model: {
              singleMode: true,
              nat: false,
              cluster: [{host: null, port: null, password: null}]
            }
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
          // 服务器性能面板
          dashboard: {
            show: false,
            thread: null,
            state: {
              time: [],
              // cpu
              used_cpu_sys: [],
              used_cpu_user: [],
              used_cpu_sys_children: [],
              used_cpu_user_children: [],
              // ram
              used_memory_rss: [],
              used_memory: [],
              used_memory_lua: [],
              // network
              instantaneous_input_kbps: [],
              instantaneous_output_kbps: [],
              instantaneous_ops_per_sec: [],
              // cmd
              keyspace_hits: [],
              keyspace_misses: []
            }
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
      'KeyContextMenu': KeyContextMenu,
      'Dashboard': Dashboard
    }
  }
</script>

<style scoped>

</style>

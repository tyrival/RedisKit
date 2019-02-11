<template>
	<div class="viewport">
		<ServerPanel :servers="servers"></ServerPanel>
		<KeyPanel :servers="servers"></KeyPanel>
		<ServerEditor :servers="servers"></ServerEditor>
		<DataEditor :servers="servers"></DataEditor>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.scss'
  import ServerPanel from './viewport/ServerPanel'
  import KeyPanel from './viewport/KeyPanel'
  import ServerEditor from './viewport/ServerEditor'
  import DataEditor from './viewport/DataEditor'

  export default {
    name: 'Viewport',
    data () {
      return {
        servers: {
          // 当前服务器索引
          index: null,
          // 当前数据库索引
          dbIndex: null,
          // 连接实例
          connection: null,
          // 数据内容
          storage: {
            // 当前key
            index: null,
            // 新增数据编辑窗口
            editor: {
              show: false,
              model: {name: null, type: null, value: null}
            },
            // 数据key、type对象列表 {name, type}
            data: null
          },
          // 服务器信息编辑窗口
          editor: {
            show: false,
            index: null,
            model: {name: null, host: null, port: null, password: null}
          },
          // 服务器信息列表
          list: [
            {
              'name': 'localhost',
              'host': 'localhost',
              'port': 6379,
              'password': '',
              'dbs': []
            }
          ]
        }
      }
    },
    components: {
      'ServerPanel': ServerPanel,
      'KeyPanel': KeyPanel,
      'ServerEditor': ServerEditor,
      'DataEditor': DataEditor
    }
  }
</script>

<style scoped>

</style>

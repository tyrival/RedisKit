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
          connection: null,
          storage: {
            index: null,
            editor: {
              show: false,
              model: {name: null, type: null, value: null}
            },
            data: null
          },
          editor: {
            show: false,
            index: null,
            model: {name: null, host: null, port: null, password: null}
          },
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

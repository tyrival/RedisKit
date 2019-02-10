<template>
	<div class="viewport">
		<ServerPanel :servers="servers"></ServerPanel>
		<KeyPanel :servers="servers"></KeyPanel>
		<ServerEditor :servers="servers"></ServerEditor>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.scss'
  import ServerPanel from './viewport/ServerPanel'
  import KeyPanel from './viewport/KeyPanel'
  import ServerEditor from './viewport/ServerEditor'

  export default {
    name: 'Viewport',
    data () {
      return {
        servers: {
          index: null,
          partitionIndex: null,
          storage: {
            index: null,
            data: [
              {name: 'user', type: 'string', value: '{"abc":1}'},
              {name: 'role', type: 'list', value: '{"abc":2}'},
              {name: 'org', type: 'set', value: '{"abc":4}'},
              {name: 'test', type: 'hash', value: '{"abc":5}'},
              {name: 'auth', type: 'zset', value: '{"abc":3}'}
            ]
          },
          editor: {
            show: false,
            index: null,
            model: {
              name: null,
              host: null,
              port: null,
              password: null
            }
          },
          connections: [null, null, null],
          list: [
            {
              'name': 'localhost',
              'host': '1',
              'port': 6371,
              'password': '1',
              'partitions': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
            },
            {
              'name': 'localhost1',
              'host': '2',
              'port': 6372,
              'password': '2',
              'partitions': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            },
            {
              'name': 'localhost2',
              'host': '3',
              'port': 6373,
              'password': '3',
              'partitions': ['0', '1', '2', '3', '4', '5', '6']
            }
          ]
        }
      }
    },
    components: {
      'ServerPanel': ServerPanel,
      'KeyPanel': KeyPanel,
      'ServerEditor': ServerEditor
    }
  }
</script>

<style scoped>

</style>

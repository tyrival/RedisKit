<template>
	<div class="viewport">
		<ServerPanel :servers="servers"></ServerPanel>
		<ServerEditor :servers="servers"></ServerEditor>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.scss'
  import ServerPanel from './viewport/ServerPanel'
  import ServerEditor from './viewport/ServerEditor'

  export default {
    name: 'Viewport',
    data () {
      return {
        servers: {
          index: null,
          connections: [null, null, null],
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
      'ServerEditor': ServerEditor
    }
  }
</script>

<style scoped>

</style>

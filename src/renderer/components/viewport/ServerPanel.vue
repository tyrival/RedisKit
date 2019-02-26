<template>
	<div class="server-panel">
		<div class="filter">
			<el-input placeholder="请输入筛选条件"
			          suffix-icon="el-icon-search"
			          v-model="filterWord"
			          clearable>
			</el-input>
		</div>
		<div class="server-list">
			<template v-for="(item, i) in this.config.servers">
				<div class="el-row item"
				     v-show="filterServer(item)"
				     :class="config.index === i ? 'is-active' : ''"
				     @mouseover="mouseoverIndex = i"
				     @mouseout="mouseoverIndex = null"
				     @click="selectServer(i, $event)">
					<el-col :span="16">{{item.name}}</el-col>
					<el-col :span="8">
						<el-button type="text"
						           size="mini"
						           v-show="mouseoverIndex === i"
						           @click="editServer(i, $event)">
							<i class="icon iconfont icon-edit"></i>
						</el-button>
						<el-button type="text"
						           size="mini"
						           v-show="mouseoverIndex === i"
						           @click="deleteServer(i, $event)">
							<i class="icon iconfont icon-cross"></i>
						</el-button>
					</el-col>
				</div>
			</template>
		</div>
		<div class="el-row menu">
			<el-button-group>
				<el-button @click="addServer"><i class="icon iconfont icon-plus"></i></el-button>
				<el-button @click="removeServer"><i class="icon iconfont icon-minus"></i></el-button>
				<el-button @click="toggleMonitor"><i class="icon iconfont icon-monitor"></i></el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/server-panel.scss'
  import RedisClient from '../../plugin/RedisClient'
  import _ from 'lodash'

  export default {
    name: 'ServerPanel',
    props: ['config'],
    data () {
      return {
        filterWord: '',
        mouseoverIndex: null
      }
    },
    methods: {
      /**
       * 过滤服务器信息
       * @param item
       * @returns {boolean}
       */
      filterServer (item) {
        if (this.filterWord === null || this.filterWord === undefined) {
          return true
        }
        if (item.name.toLowerCase().indexOf(this.filterWord.toLowerCase()) >= 0) {
          return true
        }
        return false
      },
      /**
       * 删除服务器信息
       */
      deleteServer (i, e) {
        e.stopPropagation()
        this.removeServer(i)
      },
      /**
       * 移除服务器信息
       */
      removeServer (i) {
        let index = i
        if (index === null || index === undefined) {
          index = this.config.index
        }
        if (index === null || index === undefined) {
          this.$message({message: '未选中任何服务器', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.servers.splice(index, 1)
          this.config.index = null
          this.$dbServers(this.config.servers)
        }).catch(() => {
        })
      },
      /**
       * 新增服务器信息
       */
      addServer () {
        this.config.serverEditor.index = null
        this.$set(this.config.serverEditor, 'model', {
          singleMode: true,
          nat: false,
          cluster: [{host: null, port: null, password: null}]
        })
        this.showEditor()
      },
      /**
       * 编辑服务器信息
       * @param index
       * @param e
       */
      editServer (index, e) {
        e.stopPropagation()
        this.config.serverEditor.index = index
        let model = _.cloneDeep(this.config.servers[index])
        this.$set(this.config.serverEditor, 'model', model)
        this.showEditor()
      },
      /**
       * 选中并连接服务器
       * @param index
       */
      selectServer (index, e) {
        if (this.config.index === index) {
          return
        }
        this.config.loadingDb = true
        // 选中服务器
        this.config.index = index
        let server = this.config.servers[index]
        server.events = {
          init: (err, _) => {
            this.config.loadingDb = false
            if (err) {
              this.config.index = null
              this.config.client = null
              let message = err.message || '未知错误。'
              this.$message({message: message, type: 'error', duration: 1000})
            }
          },
          error: (err, _) => {
            this.config.loadingDb = false
            this.config.index = null
            this.config.client = null
            let message = err.message || '未知错误。'
            if (err) {
              this.$message({message: message, type: 'error', duration: 1000})
            }
          }
        }
        this.config.client = new RedisClient(server)
        if (this.config.client.config.singleMode) {
          this.config.client.loadDatabases()
        }
      },
      /**
       * 显示服务器信息编辑窗口
       */
      showEditor () {
        this.config.serverEditor.show = true
      },
      /**
       * 显示性能监控面板
       */
      toggleMonitor () {
        switch (this.config.dashboard.show) {
          case false:
            this.showMonitor()
            break
          case true:
            this.hideMonitor()
            break
        }
      },
      /**
       * 显示监控
       */
      showMonitor () {
        let index = this.config.index
        if (index === null || index === undefined || !this.config.client) {
          this.$message({message: '未选中任何服务器', type: 'error', duration: 1000})
          return
        }
        this.config.dashboard.show = true
        this.config.dashboard.thread = setInterval(() => {
          this.config.client.info((_, result) => {
            let now = new Date()
            let m = now.getMinutes()
            m = m < 10 ? '0' + m : m
            let s = now.getSeconds()
            s = s < 10 ? '0' + s : s
            let time = m + ':' + s
            this.config.dashboard.state.time.push(time)
            if (this.config.dashboard.state.time.length > 10) {
              this.config.dashboard.state.time.shift()
            }
            let arr = result.split('\n')
            for (let i = 0; i < arr.length; i++) {
              let line = arr[i]
              if (line.startsWith('#')) {
                continue
              }
              let kv = line.split(':')
              for (let key in this.config.dashboard.state) {
                if (key !== kv[0]) {
                  continue
                }
                this.config.dashboard.state[key].push(parseInt(kv[1]))
                if (this.config.dashboard.state[key].length > 10) {
                  this.config.dashboard.state[key].shift()
                }
              }
            }
          })
        }, 1000)
      },
      /**
       * 隐藏监控
       */
      hideMonitor () {
        this.config.dashboard.show = false
        this.resetMonitor()
      },
      /**
       * 重置监控数据
       */
      resetMonitor () {
        clearInterval(this.config.dashboard.thread)
        this.$set(this.config.dashboard, 'state', {
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
        })
      }
    }
  }
</script>

<style scoped>

</style>

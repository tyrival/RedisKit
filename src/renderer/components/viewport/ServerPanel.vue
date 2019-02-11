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
			<template v-for="(item, i) in this.servers.list">
				<div class="item"
				     v-show="filterServer(item)"
				     :class="servers.index === i ? 'is-active' : ''"
				     @mouseover="mouseoverIndex = i"
				     @mouseout="mouseoverIndex = null"
				     @click="selectServer(i)">
					<span>{{item.name}}</span>
					<el-button type="text"
					           size="mini"
					           v-show="mouseoverIndex === i"
					           @click="editServer(i, $event)">编辑
					</el-button>
				</div>
			</template>
		</div>
		<div class="el-row menu">
			<el-button-group>
				<el-button @click="addServer"><i class="icon iconfont icon-plus"></i></el-button>
				<el-button @click="removeServer"><i class="icon iconfont icon-minus"></i></el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
  import Redis from 'ioredis'
  import '../../assets/styles/viewport/server-panel.scss'

  export default {
    name: 'ServerPanel',
    props: ['servers'],
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
        if (item.name.indexOf(this.filterWord) >= 0) {
          return true
        }
        return false
      },
      /**
       * 移除服务器信息
       */
      removeServer () {
        let index = this.servers.index
        if (index === null || index === undefined) {
          return
        }
        this.$confirm('是否确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.servers.list.splice(index, 1)
          this.servers.index = null
        }).catch(() => {
        })
      },
      /**
       * 新增服务器信息
       */
      addServer () {
        this.servers.editor.index = null
        this.servers.editor.model.name = null
        this.servers.editor.model.host = null
        this.servers.editor.model.port = null
        this.servers.editor.model.password = null
        this.showEditor()
      },
      /**
       * 编辑服务器信息
       * @param index
       * @param e
       */
      editServer (index, e) {
        e.stopPropagation()
        this.servers.editor.index = index
        let model = this.servers.list[index]
        this.servers.editor.model.name = model.name
        this.servers.editor.model.host = model.host
        this.servers.editor.model.port = model.port
        this.servers.editor.model.password = model.password
        this.showEditor()
      },
      /**
       * 选中并连接服务器
       * @param index
       */
      selectServer (index) {
        if (this.servers.connection) {
          this.servers.connection.disconnect()
          this.servers.connection = null
          this.servers.dbIndex = null
        }
        // 选中服务器
        this.servers.index = index
        let server = this.servers.list[index]
        // 连接服务器
        this.servers.connection = new Redis(server)
        // 获取分区列表
        this.servers.connection.config(['get', 'databases'], (_, reply) => {
          if (!reply) {
            return
          }
          let count = parseInt(reply[1])
          if (!count) {
            return
          }
          let dbs = []
          for (let i = 0; i < count; i++) {
            dbs.push(i.toString())
          }
          server.dbs = dbs
        })
      },
      /**
       * 显示服务器信息编辑窗口
       */
      showEditor () {
        this.servers.editor.show = true
      }
    }
  }
</script>

<style scoped>

</style>

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
				<div class="item"
				     v-show="filterServer(item)"
				     :class="config.index === i ? 'is-active' : ''"
				     @mouseover="mouseoverIndex = i"
				     @mouseout="mouseoverIndex = null"
				     @click="selectServer(i, $event)">
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
  import RedisClient from '../../plugin/RedisClient'
  import '../../assets/styles/viewport/server-panel.scss'

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
        if (item.name.indexOf(this.filterWord) >= 0) {
          return true
        }
        return false
      },
      /**
       * 移除服务器信息
       */
      removeServer () {
        let index = this.config.index
        if (index === null || index === undefined) {
          return
        }
        this.$confirm('是否确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.servers.splice(index, 1)
          this.config.index = null
        }).catch(() => {
        })
      },
      /**
       * 新增服务器信息
       */
      addServer () {
        this.config.serverEditor.index = null
        this.config.serverEditor.model.name = null
        this.config.serverEditor.model.host = null
        this.config.serverEditor.model.port = null
        this.config.serverEditor.model.password = null
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
        let model = this.config.servers[index]
        this.config.serverEditor.model.name = model.name
        this.config.serverEditor.model.host = model.host
        this.config.serverEditor.model.port = model.port
        this.config.serverEditor.model.password = model.password
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
        // 选中服务器
        this.config.index = index
        let server = this.config.servers[index]
        this.config.client = new RedisClient(server)
        this.config.client.loadDatabases((databases) => {
          this.$set(this.config.client, 'databases', databases)
        })
      },
      /**
       * 显示服务器信息编辑窗口
       */
      showEditor () {
        this.config.serverEditor.show = true
      }
    }
  }
</script>

<style scoped>

</style>

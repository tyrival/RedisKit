<template>
	<div class="server-panel">
		<div class="server-list">
			<template v-for="(item, i) in servers.list">
				<div class="item"
				     :class="servers.index === i ? 'is-active' : ''"
				     @mouseover="mouseoverIndex = i"
				     @mouseout="mouseoverIndex = null"
				     @click="servers.index = i">
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
  import '../../assets/styles/viewport/server-panel.scss'

  export default {
    name: 'ServerPanel',
    props: ['servers'],
    data () {
      return {
        mouseoverIndex: null
      }
    },
    methods: {
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
      addServer () {
        this.servers.editor.index = null
        this.servers.editor.model.name = null
        this.servers.editor.model.host = null
        this.servers.editor.model.port = null
        this.servers.editor.model.password = null
        this.showEditor()
      },
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
      showEditor () {
        this.servers.editor.show = true
      }
    }
  }
</script>

<style scoped>

</style>

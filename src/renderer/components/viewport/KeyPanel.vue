<template>
	<div class="key-panel">
		<div class="filter">
			<el-input placeholder="请输入筛选条件"
			          suffix-icon="el-icon-search"
			          v-model="filterWord"
			          clearable>
			</el-input>
		</div>
		<div class="tab-db">
			<el-tabs v-model="config.client.config.db"
			         type="card"
			         @tab-click="selectDb">
				<template v-for="(item, i) in config.client.databases">
					<el-tab-pane :label="item" :name="item"></el-tab-pane>
				</template>
			</el-tabs>
		</div>
		<div class="key-list"
		     v-show="config.client.store && config.client.store.length">
			<template v-for="(item, i) in config.client.store">
				<div class="key-item"
				     v-show="filterKey(item)"
				     :class="config.client.model.index === i ? 'is-active' : ''"
				     @mousedown="selectKey(i, $event)">
					<el-tag size="mini" :type="calcTypeTagStyle(item)">{{item.type}}</el-tag>
					{{item.key}}
				</div>
			</template>
		</div>
		<div class="el-row menu">
			<el-button-group>
				<el-button @click="addKey"><i class="icon iconfont icon-plus"></i></el-button>
				<el-button @click="removeKey"><i class="icon iconfont icon-minus"></i></el-button>
				<el-button @click="duplicateKey"><i class="icon iconfont icon-duplicate"></i></el-button>
				<el-button @click="setExpire"><i class="icon iconfont icon-time"></i></el-button>
				<el-button @click="renameKey"><i class="icon iconfont icon-edit"></i></el-button>
				<el-button @click="refreshKey"><i class="icon iconfont icon-refresh"></i></el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/key-panel.scss'

  export default {
    name: 'KeyPanel',
    props: ['config'],
    data () {
      return {
        filterWord: ''
      }
    },
    methods: {
      /**
       * 过滤key列表
       * @param item
       * @returns {boolean}
       */
      filterKey (item) {
        if (this.filterWord === null || this.filterWord === undefined) {
          return true
        }
        if (item.key.indexOf(this.filterWord) >= 0) {
          return true
        }
        return false
      },
      /**
       * 选中数据库
       * @param tab
       * @param event
       */
      selectDb (tab, event) {
        this.config.client.selectDatabase(tab.index, (store) => {
          this.$set(this.config.client, 'store', store)
        })
      },
      /**
       * 选中key
       */
      selectKey (index, e) {
        this.config.client.selectKey(index)
        // 右键点击时，还需弹出右键菜单
        if (e && e.button === 2) {
          this.config.keyContextMenu.index = index
          this.config.keyContextMenu.style.top = e.pageY
          this.config.keyContextMenu.style.left = e.pageX
        }
      },
      /**
       * 显示数据库tab列表
       * @returns {boolean}
       */
      showDbTab () {
        let index = this.servers.index
        if (index === null || index === undefined) {
          return false
        }
        return true
      },
      /**
       * 根据数据类型映射tag样式
       * @param item
       * @returns {string}
       */
      calcTypeTagStyle (item) {
        switch (item.type) {
          case 'string':
            return ''
          case 'hash':
            return 'success'
          case 'list':
            return 'danger'
          case 'set':
            return 'warning'
          case 'zset':
            return 'info'
          default:
            return ''
        }
      },
      /**
       * 增加数据
       */
      addKey () {
        this.config.dataEditor.model.name = null
        this.config.dataEditor.model.type = 'string'
        this.config.dataEditor.model.value = null
        this.config.dataEditor.show = true
      },
      /**
       * 删除键
       */
      removeKey () {
        let key = this.config.client.model.key
        if (key === undefined || key === null) {
          this.$message({message: '未选中任何键', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此键？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeKey(key)
        }).catch(() => {
        })
      },
      /**
       * 设置过期时间
       */
      setExpire () {
        let key = this.config.client.model.key
        if (key === null || key === undefined) {
          this.$message({message: '未选中任何键', type: 'error', duration: 1000})
          return
        }
        this.config.client.loadExpire(key, (_, result) => {
          if (result >= 0) {
            this.config.expireEditor.model.duration = result
            this.config.expireEditor.model.timestamp = result * 1000 + new Date().getTime()
          } else {
            this.config.expireEditor.model.timestamp = new Date()
          }
        })
        this.config.expireEditor.key = key
      },
      /**
       * 重命名键
       */
      renameKey () {
        let key = this.config.client.model.key
        if (key === null || key === undefined) {
          this.$message({message: '未选中任何键', type: 'error', duration: 1000})
          return
        }
        this.config.keyNameEditor.key = key
        this.config.keyNameEditor.model.key = key
      },
      /**
       * 复制键
       */
      duplicateKey () {
        let key = this.config.client.model.key
        if (key === null || key === undefined) {
          this.$message({message: '未选中任何键', type: 'error', duration: 1000})
          return
        }
        this.config.keyDuplicateEditor.key = key
        this.config.keyDuplicateEditor.model.key = key + ' DUP'
      },
      /**
       * 刷新key
       */
      refreshKey () {
        this.config.client.loadStore()
      }
    }
  }
</script>

<style scoped>

</style>

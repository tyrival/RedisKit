<template>
	<div class="key-panel" v-if="servers.index !== null">
		<div class="filter">
			<el-input placeholder="请输入筛选条件"
			          suffix-icon="el-icon-search"
			          v-model="filterWord"
			          clearable>
			</el-input>
		</div>
		<div class="tab-db">
			<el-tabs v-if="showDbTab()"
			         v-model="servers.dbIndex"
			         type="card"
			         @tab-click="selectDb">
				<template v-for="(item, i) in getDbs()">
					<el-tab-pane :label="item" :name="item"></el-tab-pane>
				</template>
			</el-tabs>
		</div>
		<div class="key-list" v-show="showKeyList()">
			<template v-for="(item, i) in servers.storage.data">
				<div class="key-item"
				     v-show="filterKey(item)"
				     :class="servers.storage.index === i ? 'is-active' : ''"
				     @click="selectKey(i)">
					<el-tag size="mini" :type="calcTypeTagStyle(item)">{{item.type}}</el-tag>
					{{item.name}}
				</div>
			</template>
		</div>
		<div class="el-row menu">
			<el-button-group>
				<el-button @click="addData"><i class="icon iconfont icon-plus"></i></el-button>
				<el-button><i class="icon iconfont icon-refresh"></i></el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/key-panel.scss'
  import Redis from 'ioredis'

  export default {
    name: 'KeyPanel',
    props: ['servers'],
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
        if (item.name.indexOf(this.filterWord) >= 0) {
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
        this.servers.dbIndex = tab.index
        this.loadKeys()
      },
      /**
       * 加载key列表
       */
      loadKeys () {
        this.servers.storage.data = []
        this.servers.storage.index = null
        let server = this.servers.list[this.servers.index]
        server.db = this.servers.dbIndex.toString()
        this.servers.connection = new Redis(server)
        // 查询所有key
        this.servers.connection.keys(['*'], (_, reply) => {
          if (!reply || !reply.length) {
            return
          }
          // 遍历key，构造查询key对应的数据类型的命令
          let client = this.servers.connection.multi()
          for (let i = 0; i < reply.length; i++) {
            let key = reply[i]
            client = client.type(key)
          }
          // 查询类型
          client.exec((_, results) => {
            let data = []
            for (let i = 0; i < results.length; i++) {
              data.push({
                name: reply[i],
                type: results[i][1]
              })
            }
            this.servers.storage.data = data
          })
        })
      },
      /**
       * 选中key
       */
      selectKey (index) {
        this.servers.storage.index = index
        let data = this.servers.storage.data[index]
        let key = data.name
        let type = data.type
        this.loadValue(key, type, this.displayValue)
      },
      /**
       * 将值加载到缓存中，并显示
       */
      displayValue (value) {
        this.servers.storage.value = value
      },
      /**
       * 加载值
       */
      loadValue (key, type, callback) {
        switch (type) {
          case 'string':
            this.servers.connection.get(key).then((result) => {
              callback(result)
            })
            break
          case 'hash':
            this.servers.connection.hgetall(key).then((result) => {
              callback(result)
            })
            break
          case 'list':
            this.servers.connection.lrange(key, 0, -1).then((result) => {
              callback(result)
            })
            break
          case 'set':
            this.servers.connection.smembers(key).then((result) => {
              callback(result)
            })
            break
          case 'zset':
            this.servers.connection.zrange(key, 0, -1, 'withscores').then((result) => {
              callback(result)
            })
            break
          default:
            break
        }
      },
      /**
       * 销毁连接客户端
       */
      destroyConnection () {
        let client = this.servers.connection
        if (client) {
          client.disconnect()
          client = null
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
       * 获取数据库信息
       * @returns {*}
       */
      getDbs () {
        let index = this.servers.index
        if (index === null || index === undefined) {
          return
        }
        return this.servers.list[this.servers.index].dbs
      },
      /**
       * 判断是否显示key列表
       * @returns {boolean}
       */
      showKeyList () {
        if (this.servers.index !== null && this.servers.dbIndex != null) {
          return true
        }
        return false
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
      addData () {
        this.servers.storage.editor.model.name = null
        this.servers.storage.editor.model.type = 'string'
        this.servers.storage.editor.model.value = null
        this.servers.storage.editor.show = true
      }
    },
    watch: {
      'servers.dbIndex': function (val) {
        if (val === null || val === undefined) {
          return
        }
        this.loadKeys()
      }
    }
  }
</script>

<style scoped>

</style>

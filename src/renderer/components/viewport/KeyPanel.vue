<template>
	<div class="key-panel" v-if="servers.index !== null">
		<div class="filter">
			<el-input placeholder="请输入筛选条件"
			          suffix-icon="el-icon-search"
			          v-model="filterWord"
			          clearable>
			</el-input>
		</div>
		<div class="tab-partition">
			<el-tabs v-if="showPartitionTab()"
			         v-model="servers.partitionIndex"
			         type="card"
			         @tab-click="selectPartition">
				<template v-for="(item, i) in getPartitions()">
					<el-tab-pane :label="item" :name="item"></el-tab-pane>
				</template>
			</el-tabs>
		</div>
		<div class="key-list" v-show="showKeyList()">
			<template v-for="(item, i) in servers.storage.data">
				<div class="key-item"
				     v-show="filterKey(item)"
				     :class="servers.storage.index === i ? 'is-active' : ''"
				     @click="servers.storage.index = i">
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
      filterKey (item) {
        if (this.filterWord === null || this.filterWord === undefined) {
          return true
        }
        if (item.name.indexOf(this.filterWord) >= 0) {
          return true
        }
        return false
      },
      selectPartition (tab, event) {
        this.servers.partitionIndex = tab.index
        this.loadKeys()
      },
      loadKeys () {
        this.servers.storage.data = []
        this.servers.storage.index = null
        let server = this.servers.list[this.servers.index]
        server.db = this.servers.partitionIndex.toString()
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
      destroyConnection () {
        let client = this.servers.connection
        if (client) {
          client.disconnect()
          client = null
        }
      },
      showPartitionTab () {
        let index = this.servers.index
        if (index === null || index === undefined) {
          return false
        }
        return true
      },
      getPartitions () {
        let index = this.servers.index
        if (index === null || index === undefined) {
          return
        }
        return this.servers.list[this.servers.index].partitions
      },
      showKeyList () {
        if (this.servers.index !== null && this.servers.partitionIndex != null) {
          return true
        }
        return false
      },
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
      addData () {
        this.servers.storage.editor.model.name = null
        this.servers.storage.editor.model.type = 'string'
        this.servers.storage.editor.model.value = null
        this.servers.storage.editor.show = true
      }
    },
    watch: {
      'servers.partitionIndex': function (val) {
        console.log('watch')
        this.loadKeys()
      }
    }
  }
</script>

<style scoped>

</style>

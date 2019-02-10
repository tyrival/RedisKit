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
			<el-tabs v-model="servers.partitionIndex" type="card" @tab-click="selectPartition">
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
				<el-button><i class="icon iconfont icon-plus"></i></el-button>
				<el-button><i class="icon iconfont icon-refresh"></i></el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/key-panel.scss'

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
        console.log(tab, event)
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
            return 'info'
          case 'set':
            return 'warning'
          case 'zset':
            return 'danger'
          default:
            return ''
        }
      }
    }
  }
</script>

<style scoped>

</style>

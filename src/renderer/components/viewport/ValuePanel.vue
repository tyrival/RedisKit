<template>
	<div class="value-panel" v-show="showValuePanel()">
		<div class="header">
			<el-button type="primary" @click="saveValue"> 保 存</el-button>
			<el-select v-model="dataFormat.current">
				<el-option v-for="(item, i) in dataFormat.list"
				           :key="item"
				           :label="item"
				           :value="item">
				</el-option>
			</el-select>
		</div>
		<div class="content">
			<!-- string数据 -->
			<div class="content-string" v-if="getDataType() === 'string'">
				<el-input type="textarea" v-model="dataValue"></el-input>
			</div>
			<!-- hash数据 -->
			<div class="content-hash" v-else-if="getDataType() === 'hash'">
				<div class="data-key">
					<template v-for="(value, key) in servers.storage.value">
						<div class="item"
						     :class="dataKey === key ? 'is-active' : ''"
						     @click="selectHashKey(key)"
						     @dblclick="openEditKeyMode(key)">
							<el-input v-show="editKey.show && dataKey === key"
							          v-model="editKey.value"></el-input>
							<el-button v-show="editKey.show && dataKey === key"
							           type="primary"
							           @click="saveHashKey(key)">保存
							</el-button>
							<span v-show="!editKey.show || dataKey !== key">{{key}}</span>
						</div>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button @click="addHashKey"><i class="icon iconfont icon-plus"></i></el-button>
							<el-button @click="removeHashKey"><i class="icon iconfont icon-minus"></i></el-button>
							<el-button @click="refreshValue"><i class="icon iconfont icon-refresh"></i></el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
			<!-- list数据 -->
			<div class="content-list" v-else-if="getDataType() === 'list'">
				<div class="data-key">
					<template v-for="(item, i) in servers.storage.value">
						<div class="el-row item item-list"
						     :class="dataKey === i ? 'is-active' : ''"
						     @click="selectListItem(i)">
							<el-col class="col-index" :span="6">{{i}}</el-col>
							<el-col class="col-ele" :span="18">{{item}}</el-col>
						</div>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button @click="unshiftListItem">
								<i class="icon iconfont icon-unshift"></i>
							</el-button>
							<el-button @click="pushListItem">
								<i class="icon iconfont icon-push"></i>
							</el-button>
							<el-button @click="deleteListItem">
								<i class="icon iconfont icon-minus"></i>
							</el-button>
							<el-button @click="refreshValue">
								<i class="icon iconfont icon-refresh"></i>
							</el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
			<!-- set数据 -->
			<div class="content-set" v-else-if="getDataType() === 'set'">
				<div class="data-key">
					<template v-for="(item, i) in servers.storage.value">
						<div class="el-row item"
						     :class="dataKey === i ? 'is-active' : ''"
						     @click="selectListItem(i)">
							{{item}}
						</div>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button @click="addSetItem"><i class="icon iconfont icon-plus"></i></el-button>
							<el-button @click="removeSetItem"><i class="icon iconfont icon-minus"></i></el-button>
							<el-button @click="refreshValue"><i class="icon iconfont icon-refresh"></i></el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
			<!-- zset数据 -->
			<div class="content-zset" v-else-if="getDataType() === 'zset'">
				<div class="data-key">
					<template v-if="servers.storage.value && servers.storage.value.length">
						<template v-for="i in servers.storage.value.length / 2">
							<div class="el-row item item-list"
							     :class="dataKey === i - 1 ? 'is-active' : ''"
							     @click="selectZsetItem(i - 1)"
							     @dblclick="openEditZsetMode(i - 1)">
								<el-col class="col-index" :span="12">{{servers.storage.value[(i - 1) * 2]}}</el-col>
								<el-col class="col-ele" :span="12">
									<el-input v-show="editKey.show && dataKey === i - 1"
									          v-model="editKey.value"></el-input>
									<el-button v-show="editKey.show && dataKey === i - 1"
									           type="primary"
									           @click="saveZsetScore(i - 1)">保存
									</el-button>
									<span v-show="!editKey.show || dataKey !== i - 1">{{servers.storage.value[i * 2 - 1]}}</span>
								</el-col>
							</div>
						</template>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button @click="addZsetItem">
								<i class="icon iconfont icon-plus"></i>
							</el-button>
							<el-button @click="removeZsetItem">
								<i class="icon iconfont icon-minus"></i>
							</el-button>
							<el-button v-show="order === 1" @click="switchOrder">
								<i class="icon iconfont icon-asc"></i>
							</el-button>
							<el-button v-show="order === 0" @click="switchOrder">
								<i class="icon iconfont icon-desc"></i>
							</el-button>
							<el-button @click="refreshValue">
								<i class="icon iconfont icon-refresh"></i>
							</el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/value-panel.scss'

  export default {
    name: 'ValuePanel',
    props: ['servers'],
    data () {
      return {
        // dataKey编辑模式
        editKey: {
          show: false,
          value: null
        },
        // 缓存除string外数据类型的当前选中项索引
        dataKey: null,
        // dataKey对应的值
        dataValue: null,
        // 排序方式，只针对list和zset有效
        order: 0,
        // 数据显示格式
        dataFormat: {
          current: 'RAW',
          list: ['RAW', 'JSON']
        }
      }
    },
    methods: {
      /**
       * 判断是否显示值面板
       * @returns {boolean}
       */
      showValuePanel () {
        let key = this.servers.storage.index
        if (key !== null && key !== undefined) {
          return true
        }
        return false
      },
      /**
       * 获取数据类型
       */
      getDataType () {
        let index = this.servers.storage.index
        if (index == null || index === undefined) {
          return
        }
        return this.servers.storage.data[index].type
      },
      /**
       * 格式化数据
       * @param value
       * @param format
       * @returns {string}
       */
      formatValue (value) {
        try {
          switch (this.dataFormat.current) {
            case 'JSON':
              return JSON.stringify(JSON.parse(value), null, 2)
            default:
              return JSON.stringify(JSON.parse(value))
          }
        } catch (e) {
          this.dataFormat.current = 'RAW'
          return value
        }
      },
      /**
       * 开启key编辑模式
       * @param item
       */
      openEditKeyMode (key) {
        if (this.editKey.show) {
          return
        }
        this.editKey.show = true
        this.editKey.value = key
      },
      /**
       * 取消编辑模式
       */
      quitEditKeyMode () {
        this.editKey.show = false
        this.editKey.value = null
      },
      /**
       * 切换排序方式
       */
      switchOrder () {
        this.order = Math.abs(this.order - 1)
      },
      /**
       * 刷新值
       */
      refreshValue () {
        let dataIndex = this.servers.storage.index
        this.$parent.$refs.keyPanel.selectKey(dataIndex)
      },
      /**
       * 保存数据值
       */
      saveValue () {
        let client = this.servers.connection
        let index = this.servers.storage.index
        let data = this.servers.storage.data[index]
        let key = data.name
        let type = data.type
        let value = this.dataValue
        let callback = (_, result) => {
          if (result === 'OK') {
            this.$message({message: '保存成功', type: 'success', duration: 700})
          }
        }
        switch (type) {
          case 'string':
            client.set(key, value, callback)
            break
          case 'hash':
            break
          case 'list':
            break
          case 'set':
            break
          case 'zset':
            break
          default:
            break
        }
      },
      /**
       * 选中hash数据属性
       * @param item
       */
      selectHashKey (key) {
        if (this.dataKey === key) {
          return
        }
        this.quitEditKeyMode()
        this.dataKey = key
        this.dataValue = this.formatValue(this.servers.storage.value[key])
      },
      /**
       * 增加hash key
       */
      addHashKey () {
        let index = 0
        let key = 'item'
        while (this.servers.storage.value.hasOwnProperty(key)) {
          key = 'item' + index
          index++
        }
        let client = this.servers.connection
        let dataIndex = this.servers.storage.index
        let data = this.servers.storage.data[dataIndex]
        let dataKey = data.name
        client.hset(dataKey, key, '')
          .then(() => {
            this.$set(this.servers.storage.value, key, '')
          })
      },
      /**
       * 删除hash key
       */
      removeHashKey () {
        let key = this.dataKey
        if (key === undefined || key === null) {
          this.$message({message: '未选中任何Hash Key', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此属性？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dataIndex = this.servers.storage.index
          let data = this.servers.storage.data[dataIndex]
          let dataKey = data.name
          let client = this.servers.connection
          client.hdel(dataKey, key)
          this.$delete(this.servers.storage.value, key)
        }).catch(() => {
        })
      },
      /**
       * 保存hashkey
       * @param item
       */
      saveHashKey (key) {
        if (this.editKey.value !== key) {
          let client = this.servers.connection
          let dataIndex = this.servers.storage.index
          let data = this.servers.storage.data[dataIndex]
          let dataKey = data.name
          let newHashKey = this.editKey.value
          // 判断新key是否存在
          client.hexists(dataKey, newHashKey)
            .then((result) => {
              if (result > 0) {
                this.$message.error('键【' + newHashKey + '】已存在，无法修改。')
                return
              }
              client.multi()
                .hset(dataKey, newHashKey, this.dataValue)
                .hdel(dataKey, key)
                .exec(() => {
                  this.refreshValue()
                })
            })
        }
        this.quitEditKeyMode()
      },
      /**
       * 选中list、set元素
       * @param item
       */
      selectListItem (index) {
        if (this.dataKey === index) {
          return
        }
        this.quitEditKeyMode()
        this.dataKey = index
        this.dataValue = this.formatValue(this.servers.storage.value[index])
      },
      /**
       * list前端插入元素
       */
      unshiftListItem () {
        let val = 'item'
        let dataKey = this.servers.storage.data[this.servers.storage.index].name
        let client = this.servers.connection
        client.lpush(dataKey, val)
          .then(() => {
            this.servers.storage.value.unshift(val)
          })
      },
      /**
       * list后端插入元素
       */
      pushListItem () {
        let val = 'item'
        let dataKey = this.servers.storage.data[this.servers.storage.index].name
        let client = this.servers.connection
        client.rpush(dataKey, val)
          .then(() => {
            this.servers.storage.value.push(val)
          })
      },
      /**
       * 删除list元素
       */
      deleteListItem () {
        if (this.dataKey === undefined || this.dataKey === null) {
          this.$message({message: '未选中任何数组元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此数组元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let client = this.servers.connection
          let dataKey = this.servers.storage.data[this.servers.storage.index].name
          let index = this.dataKey
          let val = 'DELETE' + new Date().getTime()
          client.multi()
            .lset(dataKey, index, val)
            .lrem(dataKey, 0, val)
            .exec(() => {
              this.servers.storage.value.splice(this.dataKey, 1)
            })
        }).catch(() => {
        })
      },
      /**
       * 增加set元素
       */
      addSetItem () {
        let set = this.servers.storage.value
        let item = 'item'
        let index = 0
        while (this.setHasItem(set, item)) {
          item = 'item' + index
          index++
        }
        let client = this.servers.connection
        let dataKey = this.servers.storage.data[this.servers.storage.index].name
        client.sadd(dataKey, item)
          .then(() => {
            this.servers.storage.value.push(item)
          })
      },
      /**
       * 判断元素是否存在set中，set的存储方式为数组
       */
      setHasItem (array, item) {
        if (!array || !array.length) {
          return false
        }
        for (let i = 0; i < array.length; i++) {
          let ele = array[i]
          if (ele === item) {
            return true
          }
        }
        return false
      },
      /**
       * 删除set元素
       */
      removeSetItem () {
        if (this.dataKey === undefined || this.dataKey === null) {
          this.$message({message: '未选中任何集合元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let set = this.servers.storage.value
          let item = this.dataValue
          let client = this.servers.connection
          let dataKey = this.servers.storage.data[this.servers.storage.index].name
          client.srem(dataKey, item).then(() => {
            if (!set || !set.length) {
              return
            }
            for (let i = 0; i < set.length; i++) {
              let ele = set[i]
              if (ele === item) {
                set.splice(i, 1)
                break
              }
            }
          })
        }).catch(() => {
        })
      },
      /**
       * 选中zset元素
       * @param item
       */
      selectZsetItem (index) {
        if (this.dataKey === index) {
          return
        }
        this.quitEditKeyMode()
        this.dataKey = index
        this.dataValue = this.formatValue(this.servers.storage.value[index * 2])
      },
      /**
       * 保存zset的分数
       */
      saveZsetScore (index) {
        let origScore = this.servers.storage.value[index * 2 + 1]
        if (this.editKey.value !== origScore) {
          let item = this.dataValue
          let client = this.servers.connection
          let dataKey = this.servers.storage.data[this.servers.storage.index].name
          // 判断新key是否存在
          client.multi()
            .zrem(dataKey, item, this.dataValue)
            .zadd(dataKey, this.editKey.value, item)
            .exec(() => {
              this.refreshValue()
            })
        }
        this.quitEditKeyMode()
      },
      /**
       * 编辑zset的score
       */
      openEditZsetMode (index) {
        this.editKey.show = true
        this.editKey.value = this.servers.storage.value[index * 2 + 1]
      },
      /**
       * 增加set元素
       */
      addZsetItem () {
        let set = this.servers.storage.value
        let item = 'item'
        let index = 0
        while (this.zsetHasItem(set, item)) {
          item = 'item' + index
          index++
        }
        let client = this.servers.connection
        let dataKey = this.servers.storage.data[this.servers.storage.index].name
        client.zadd(dataKey, 0, item)
          .then(() => {
            this.servers.storage.value.push(item)
            this.servers.storage.value.push(0)
          })
      },
      /**
       * 判断元素是否存在set中，set的存储方式为数组
       */
      zsetHasItem (array, item) {
        if (!array || !array.length) {
          return false
        }
        for (let i = 0; i < array.length / 2; i++) {
          let ele = array[i * 2]
          if (ele === item) {
            return true
          }
        }
        return false
      },
      /**
       * 删除set元素
       */
      removeZsetItem () {
        if (this.dataKey === undefined || this.dataKey === null) {
          this.$message({message: '未选中任何集合元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let set = this.servers.storage.value
          let item = this.dataValue
          let client = this.servers.connection
          let dataKey = this.servers.storage.data[this.servers.storage.index].name
          client.zrem(dataKey, item).then(() => {
            if (!set || !set.length) {
              return
            }
            for (let i = 0; i < set.length; i++) {
              let ele = set[i]
              if (ele === item) {
                set.splice(i, 2)
                break
              }
            }
          })
        }).catch(() => {
        })
      }
    },
    watch: {
      'servers.storage.value': function (val) {
        this.dataKey = null
        if (this.getDataType() === 'string') {
          this.dataValue = this.formatValue(val)
        } else {
          this.dataValue = null
        }
      },
      'dataFormat.current': function () {
        if (!this.dataValue) {
          return
        }
        this.dataValue = this.formatValue(this.dataValue)
      }
    }
  }
</script>

<style scoped>

</style>

<template>
	<div class="value-panel" v-show="showValuePanel()">
		<div class="header">
			<el-button type="primary"> 保 存</el-button>
			<el-select v-model="dataFormat.current">
				<el-option v-for="(item, i) in dataFormat.list"
				           :key="item"
				           :label="item"
				           :value="item">
				</el-option>
			</el-select>
		</div>
		<div class="content">
			<div class="content-string" v-if="getDataType() === 'string'">
				<el-input type="textarea" v-model="dataValue"></el-input>
			</div>
			<div class="content-hash" v-else-if="getDataType() === 'hash'">
				<div class="data-key">
					<template v-for="(value, key) in servers.storage.value">
						<div class="item"
						     :class="dataKey === key ? 'is-active' : ''"
						     @click="selectHashKey(key)">
							{{key}}
						</div>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button><i class="icon iconfont icon-plus"></i></el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
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
							<el-button><i class="icon iconfont icon-plus"></i></el-button>
							<el-button v-show="order === 1"
							           @click="switchOrder">
								<i class="icon iconfont icon-asc"></i>
							</el-button>
							<el-button v-show="order === 0"
							           @click="switchOrder">
								<i class="icon iconfont icon-desc"></i>
							</el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
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
							<el-button><i class="icon iconfont icon-plus"></i></el-button>
						</el-button-group>
					</div>
				</div>
				<div class="data-value">
					<el-input type="textarea" v-model="dataValue"></el-input>
				</div>
			</div>
			<div class="content-zset" v-else-if="getDataType() === 'zset'">
				<div class="data-key">
					<template v-for="i in servers.storage.value.length / 2 - 1">
						<div class="el-row item item-list"
						     :class="dataKey === i ? 'is-active' : ''"
						     @click="selectZsetItem(i)">
							<el-col class="col-index" :span="6">{{servers.storage.value[i * 2 + 1]}}</el-col>
							<el-col class="col-ele" :span="18">{{servers.storage.value[i * 2]}}</el-col>
						</div>
					</template>
					<div class="el-row menu">
						<el-button-group>
							<el-button><i class="icon iconfont icon-plus"></i></el-button>
							<el-button v-show="order === 1"
							           @click="switchOrder">
								<i class="icon iconfont icon-asc"></i>
							</el-button>
							<el-button v-show="order === 0"
							           @click="switchOrder">
								<i class="icon iconfont icon-desc"></i>
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
       * 选中hash数据属性
       * @param item
       */
      selectHashKey (key) {
        this.dataKey = key
        this.dataValue = this.servers.storage.value[key]
      },
      /**
       * 选中list、set元素
       * @param item
       */
      selectListItem (index) {
        this.dataKey = index
        this.dataValue = this.servers.storage.value[index]
      },
      /**
       * 选中zset元素
       * @param item
       */
      selectZsetItem (index) {
        this.dataKey = index
        this.dataValue = this.servers.storage.value[index * 2]
      },
      /**
       * 切换排序方式
       */
      switchOrder () {
        this.order = Math.abs(this.order - 1)
      }
    },
    watch: {
      'servers.storage.value': function (val) {
        this.dataKey = null
        this.dataFormat.current = 'RAW'
        if (this.getDataType() === 'string') {
          this.dataValue = val
        } else {
          this.dataValue = null
        }
      },
      'dataFormat.current': function (val) {
        switch (val) {
          case 'JSON':
            this.dataValue = JSON.stringify(JSON.parse(this.dataValue), null, 2)
            break
          default:
            this.dataValue = JSON.stringify(JSON.parse(this.dataValue))
            break
        }
      }
    }
  }
</script>

<style scoped>

</style>

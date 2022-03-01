<template>
	<div class="value-panel"
	     v-if="showValuePanel()"
	     :style="config.dashboard.show ? 'bottom: 150px' : ''">
		<div class="header" v-if="config.client && config.client.format">
			<el-button type="primary" @click="saveValue">保 存</el-button>
            <el-input class="key-container" :value="config.client.model.key"></el-input>
			<el-select v-model="config.client.format">
				<el-option v-for="(item, i) in dataFormat"
				           :key="item"
				           :label="item"
				           :value="item">
				</el-option>
			</el-select>
		</div>
		<div class="content">
			<!-- string数据 -->
			<div class="content-string" v-if="config.client.model.type === 'string'">
				<el-input type="textarea" v-model="config.client.model.fieldValue"></el-input>
			</div>
			<!-- hash数据 -->
			<div class="content-hash" v-else-if="config.client.model.type === 'hash'">
				<div class="data-key">
					<template v-for="(_, field) in config.client.model.value">
						<div class="item"
						     :class="config.client.model.field === field ? 'is-active' : ''"
						     @click="selectField(field)"
						     @dblclick="openEditKeyMode(field)">
							<el-input v-show="fieldEditor.show && config.client.model.field === field"
							          v-model="fieldEditor.value"></el-input>
							<el-button v-show="fieldEditor.show && config.client.model.field === field"
							           type="primary"
							           @click="saveHashField">保存
							</el-button>
							<span v-show="!fieldEditor.show || config.client.model.field !== field">{{field}}</span>
						</div>
					</template>
				</div>
				<div class="el-row menu">
					<el-button-group>
						<el-button @click="addHashKey"><i class="icon iconfont icon-plus"></i></el-button>
						<el-button @click="removeHashKey"><i class="icon iconfont icon-minus"></i></el-button>
						<el-button @click="editHashKey"><i class="icon iconfont icon-edit"></i></el-button>
						<el-button @click="refreshValue"><i class="icon iconfont icon-refresh"></i></el-button>
					</el-button-group>
				</div>
				<div class="data-value" v-show="config.client.model.field !== null">
					<el-input type="textarea" v-model="config.client.model.fieldValue"></el-input>
				</div>
			</div>
			<!-- list数据 -->
			<div class="content-list" v-else-if="config.client.model.type === 'list'">
				<div class="title-header">
					<el-col class="col-index" :span="7">索引</el-col>
					<el-col class="col-ele" :span="17">值</el-col>
				</div>
				<div class="data-key with-title-header">
					<template v-for="(item, i) in config.client.model.value">
						<div class="el-row item item-list"
						     :class="config.client.model.field === i ? 'is-active' : ''"
						     @click="selectField(i)">
							<el-col class="col-index" :span="7">{{i}}</el-col>
							<el-col class="col-ele" :span="17">{{item}}</el-col>
						</div>
					</template>
				</div>
				<div class="el-row menu">
					<el-button-group>
						<el-button @click="unshiftListItem">
							<i class="icon iconfont icon-unshift"></i>
						</el-button>
						<el-button @click="pushListItem">
							<i class="icon iconfont icon-push"></i>
						</el-button>
						<el-button @click="removeListItem">
							<i class="icon iconfont icon-minus"></i>
						</el-button>
						<el-button @click="refreshValue">
							<i class="icon iconfont icon-refresh"></i>
						</el-button>
					</el-button-group>
				</div>
				<div class="data-value" v-show="config.client.model.field !== null">
					<el-input type="textarea" v-model="config.client.model.fieldValue"></el-input>
				</div>
			</div>
			<!-- set数据 -->
			<div class="content-set" v-else-if="config.client.model.type === 'set'">
				<div class="data-key">
					<template v-for="(item, i) in config.client.model.value">
						<div class="el-row item"
						     :class="config.client.model.field === i ? 'is-active' : ''"
						     @click="selectField(i)">
							{{item}}
						</div>
					</template>
				</div>
				<div class="el-row menu">
					<el-button-group>
						<el-button @click="addSetItem"><i class="icon iconfont icon-plus"></i></el-button>
						<el-button @click="removeSetItem"><i class="icon iconfont icon-minus"></i></el-button>
						<el-button @click="refreshValue"><i class="icon iconfont icon-refresh"></i></el-button>
					</el-button-group>
				</div>
				<div class="data-value" v-show="config.client.model.field !== null">
					<el-input type="textarea" v-model="config.client.model.fieldValue"></el-input>
				</div>
			</div>
			<!-- zset数据 -->
			<div class="content-zset" v-else-if="config.client.model.type === 'zset'">
				<div class="title-header">
					<el-col class="col-index" :span="12">值</el-col>
					<el-col class="col-ele" :span="12">分数</el-col>
				</div>
				<div class="data-key with-title-header">
					<template v-if="config.client.model.value && config.client.model.value.length">
						<template v-for="i in config.client.model.value.length / 2">
							<div class="el-row item item-list"
							     :class="config.client.model.field === i - 1 ? 'is-active' : ''"
							     @click="selectField(i - 1)"
							     @dblclick="openEditZsetMode(i - 1)">
								<el-col class="col-index" :span="12">{{config.client.model.value[(i - 1) * 2]}}</el-col>
								<el-col class="col-ele" :span="12">
									<el-input v-show="fieldEditor.show && config.client.model.field === i - 1"
									          v-model="fieldEditor.value"></el-input>
									<el-button v-show="fieldEditor.show && config.client.model.field === i - 1"
									           type="primary"
									           @click="saveZsetScore(i - 1)">保存
									</el-button>
									<span v-show="!fieldEditor.show || config.client.model.field !== i - 1">
										{{config.client.model.value[i * 2 - 1]}}
									</span>
								</el-col>
							</div>
						</template>
					</template>
				</div>
				<div class="el-row menu">
					<el-button-group>
						<el-button @click="addZsetItem">
							<i class="icon iconfont icon-plus"></i>
						</el-button>
						<el-button @click="removeZsetItem">
							<i class="icon iconfont icon-minus"></i>
						</el-button>
						<el-button @click="editZsetScore">
							<i class="icon iconfont icon-edit"></i>
						</el-button>
						<el-button v-show="this.order === 1" @click="switchOrder">
							<i class="icon iconfont icon-asc"></i>
						</el-button>
						<el-button v-show="this.order === 0" @click="switchOrder">
							<i class="icon iconfont icon-desc"></i>
						</el-button>
						<el-button @click="refreshValue">
							<i class="icon iconfont icon-refresh"></i>
						</el-button>
					</el-button-group>
				</div>
				<div class="data-value" v-show="config.client.model.field !== null">
					<el-input type="textarea" v-model="config.client.model.fieldValue"></el-input>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/value-panel.scss'

  export default {
    name: 'ValuePanel',
    props: ['config'],
    data () {
      return {
        // dataKey编辑模式
        fieldEditor: {
          show: false,
          value: null
        },
        // 排序方式，只对zset有效
        order: 1,
        // 数据显示格式
        dataFormat: ['JSON', 'RAW']
      }
    },
    methods: {
      /**
       * 判断是否显示值面板
       * @returns {boolean}
       */
      showValuePanel () {
        let client = this.config.client
        if (!client || !client.store || !client.store.length ||
          client.model.index === null || client.model.index === undefined) {
          return false
        }
        return true
      },
      /**
       * 编辑hash key
       * @param item
       */
      editHashKey () {
        let field = this.config.client.model.field
        if (field === undefined || field === null) {
          this.$message({message: '未选中任何Hash Key', type: 'error', duration: 1000})
          return
        }
        this.openEditKeyMode(field)
      },
      /**
       * 开启key编辑模式
       * @param item
       */
      openEditKeyMode (key) {
        if (this.fieldEditor.show) {
          return
        }
        this.fieldEditor.show = true
        this.fieldEditor.value = key
      },
      /**
       * 取消编辑模式
       */
      quitEditKeyMode () {
        this.fieldEditor.show = false
        this.fieldEditor.value = null
      },
      /**
       * 切换排序方式
       */
      switchOrder () {
        this.order = Math.abs(this.order - 1)
        this.config.client.sort(this.order)
      },
      /**
       * 刷新值
       */
      refreshValue () {
        this.config.client.loadValue()
      },
      /**
       * 保存数据值
       */
      saveValue () {
        let callback = (_, result) => {
          this.$message({message: '保存成功', type: 'success', duration: 500})
        }
        this.config.client.saveField(this.config.client.model.fieldValue, callback)
      },
      /**
       * 选中数据的元素
       */
      selectField (field) {
        let client = this.config.client
        if (client.model.field === field) {
          return
        }
        this.quitEditKeyMode()
        client.selectField(field)
      },
      /**
       * 增加hash key
       */
      addHashKey () {
        this.config.client.addHashField()
      },
      /**
       * 删除hash key
       */
      removeHashKey () {
        let field = this.config.client.model.field
        if (field === undefined || field === null) {
          this.$message({message: '未选中任何Hash Key', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此属性？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeHashField(field)
        }).catch(() => {
        })
      },
      /**
       * 保存hashkey
       * @param item
       */
      saveHashField () {
        if (this.fieldEditor.value !== this.config.client.model.field) {
          this.config.client.saveHashField(this.fieldEditor.value)
        }
        this.quitEditKeyMode()
      },
      /**
       * list前端插入元素
       */
      unshiftListItem () {
        this.config.client.addListItem(true)
      },
      /**
       * list后端插入元素
       */
      pushListItem () {
        this.config.client.addListItem(false)
      },
      /**
       * 删除list元素
       */
      removeListItem () {
        let index = this.config.client.model.field
        if (index === undefined || index === null) {
          this.$message({message: '未选中任何数组元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此数组元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeListItem(index)
        })
      },
      /**
       * 增加set元素
       */
      addSetItem () {
        this.config.client.addSetItem()
      },
      /**
       * 删除set元素
       */
      removeSetItem () {
        let item = this.config.client.model.fieldValue
        if (item === undefined) {
          this.$message({message: '未选中任何集合元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeSetItem(item)
        })
      },
      /**
       * 保存zset的分数
       */
      saveZsetScore (index) {
        let origScore = this.config.client.model.value[index * 2 + 1]
        if (this.fieldEditor.value !== origScore) {
          this.config.client.saveZsetScore(this.fieldEditor.value)
        }
        this.quitEditKeyMode()
      },
      /**
       * 编辑zset的分数
       */
      editZsetScore () {
        let index = this.config.client.model.field
        if (index === undefined || index === null) {
          this.$message({message: '未选中任何Zset元素', type: 'error', duration: 1000})
          return
        }
        this.openEditZsetMode(index)
      },
      /**
       * 编辑zset的score
       */
      openEditZsetMode (index) {
        this.fieldEditor.show = true
        this.fieldEditor.value = this.config.client.model.value[index * 2 + 1]
      },
      /**
       * 增加set元素
       */
      addZsetItem () {
        this.config.client.addZsetItem()
      },
      /**
       * 删除set元素
       */
      removeZsetItem () {
        let item = this.config.client.model.fieldValue
        if (item === undefined || item === null) {
          this.$message({message: '未选中任何集合元素', type: 'error', duration: 1000})
          return
        }
        this.$confirm('是否确定删除此元素？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeZsetItem(item)
        })
      }
    },
    watch: {
      'config.client.format': function () {
        let value = this.config.client.model.fieldValue
        if (!value) {
          return
        }
        this.config.client.model.fieldValue = this.config.client.formatValue(value)
      }
    }
  }
</script>

<style scoped>

</style>

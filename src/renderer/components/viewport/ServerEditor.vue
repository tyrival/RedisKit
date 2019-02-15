<template>
	<el-dialog title="服务器信息"
	           :show-close="false"
	           :close-on-click-modal="false"
	           :close-on-press-escape="false"
	           :visible.sync="config.serverEditor.show"
	           :width="config.serverEditor.model.singleMode ? '40%' : '60%'">
		<el-form :model="config.serverEditor.model"
		         label-width="60px"
		         size="small"
		         :rules="rules"
		         ref="serverEditorForm">
			<el-form-item label="">
				<el-radio-group v-model="config.serverEditor.model.singleMode">
					<el-radio :label="true">单服务器</el-radio>
					<el-radio :label="false">集群</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="config.serverEditor.model.name" autocomplete="off" clearable></el-input>
			</el-form-item>
			<template v-if="config.serverEditor.model.singleMode">
				<el-form-item label="服务器">
					<el-input v-model="config.serverEditor.model.cluster[0].host"
					          autocomplete="off"
					          placeholder="localhost"
					          clearable></el-input>
				</el-form-item>
				<el-form-item label="端口">
					<el-input v-model="config.serverEditor.model.cluster[0].port"
					          autocomplete="off"
					          placeholder="6379"
					          clearable></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="config.serverEditor.model.cluster[0].password" autocomplete="off" clearable></el-input>
				</el-form-item>
			</template>
			<template v-else>
				<template v-for="(node, i) in config.serverEditor.model.cluster">
					<el-row>
						<el-col :span="9">
							<el-form-item label="服务器">
								<el-input v-model="node.host" autocomplete="off" placeholder="localhost" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="端口">
								<el-input v-model="node.port" autocomplete="off" placeholder="6379"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="密码">
								<el-input v-model="node.password" autocomplete="off" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2" style="text-align: center">
							<el-button v-if="i !== 0"
							           size="mini"
							           icon="icon iconfont icon-minus"
							           circle
							           @click="deleteNode(i)"></el-button>
						</el-col>
					</el-row>
				</template>
				<el-form-item label="">
					<el-button size="mini" type="primary" plain @click="addNode">增加节点</el-button>
				</el-form-item>
			</template>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="config.serverEditor.show = false">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveServer">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'ServerEditor',
    props: ['config'],
    data () {
      return {
        rules: {
          name: [{required: true, message: '必须填写名称'}]
        }
      }
    },
    methods: {
      /**
       * 保存服务器信息
       */
      saveServer () {
        let form = this.$refs.serverEditorForm
        form.validate((res, obj) => {
          this.doSaveServer()
        })
      },
      /**
       * 保存服务器信息
       */
      doSaveServer () {
        let editIndex = this.config.serverEditor.index
        let model = Object.assign({}, this.config.serverEditor.model)
        if (editIndex === null || editIndex === undefined) {
          this.config.servers.push(model)
        } else {
          this.config.servers.splice(editIndex, 1, model)
        }
        this.config.serverEditor.show = false
        this.$dbServers(this.config.servers)
      },
      /**
       * 增加节点
       */
      addNode () {
        this.config.serverEditor.model.cluster.push({
          host: null,
          port: null,
          password: null
        })
      },
      /**
       * 删除节点
       * @param index
       */
      deleteNode (index) {
        this.config.serverEditor.model.cluster.splice(index, 1)
      }
    },
    watch: {
      'config.serverEditor.show': function (val) {
        if (!val) {
          this.$refs.serverEditorForm.resetFields()
        }
      }
    }
  }
</script>

<style scoped>

</style>

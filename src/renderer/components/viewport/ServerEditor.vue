<template>
	<el-dialog title="服务器信息" :visible.sync="config.serverEditor.show" width="40%">
		<el-form :model="config.serverEditor.model"
		         label-width="80px"
		         size="small"
		         :rules="rules"
		         ref="serverEditorForm">
			<el-form-item label="名称" prop="name">
				<el-input v-model="config.serverEditor.model.name" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="服务器" prop="host">
				<el-input v-model="config.serverEditor.model.host" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="端口" prop="port">
				<el-input v-model="config.serverEditor.model.port" autocomplete="off" placeholder="6379" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="config.serverEditor.model.password" autocomplete="off" clearable></el-input>
			</el-form-item>
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
      let mustBeNumber = function (rule, value, callback) {
        if (!value) {
          callback()
        }
        if (!Number.isInteger(value)) {
          callback(new Error('端口必须是数字或为空（默认: 6379）'))
        }
        callback()
      }
      return {
        rules: {
          name: [{required: true, message: '必须填写名称'}],
          host: [{required: true, message: '必须填写服务器地址'}],
          port: [{validator: mustBeNumber}]
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
          if (!res) {
            return
          }
          let editIndex = this.config.serverEditor.index
          let model = Object.assign({}, this.config.serverEditor.model)
          if (editIndex === null || editIndex === undefined) {
            this.config.servers.push(model)
          } else {
            this.config.servers.splice(editIndex, 1, model)
          }
          this.config.serverEditor.show = false
          this.$dbServers(this.config.servers)
        })
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

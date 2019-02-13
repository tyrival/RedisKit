<template>
	<el-dialog title="服务器信息" :visible.sync="servers.editor.show" width="40%">
		<el-form :model="servers.editor.model"
		         label-width="80px"
		         size="small"
		         :rules="rules"
		         ref="serverEditorForm">
			<el-form-item label="名称" prop="name">
				<el-input v-model="servers.editor.model.name" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="服务器" prop="host">
				<el-input v-model="servers.editor.model.host" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="端口" prop="port">
				<el-input v-model="servers.editor.model.port" autocomplete="off" placeholder="6379" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="servers.editor.model.password" autocomplete="off" clearable></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="servers.editor.show = false">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveServer">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'ServerEditor',
    props: ['servers'],
    data () {
      let mustBeNumber = function (rule, value, callback) {
        if (!value) {
          callback()
        }
        if (!Number.isInteger(value)) {
          callback(new Error('端口必须是数字或为空（默认: 6379）'))
        }
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
          let editIndex = this.servers.editor.index
          let model = Object.assign({dbs: []}, this.servers.editor.model)
          if (editIndex === null || editIndex === undefined) {
            this.servers.list.push(model)
          } else {
            this.servers.list.splice(editIndex, 1, model)
          }
          this.servers.editor.show = false
        })
      }
    },
    watch: {
      'servers.editor.show': function (val) {
        if (!val) {
          this.$refs.serverEditorForm.resetFields()
        }
      }
    }
  }
</script>

<style scoped>

</style>

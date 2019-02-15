<template>
	<el-dialog title="新增数据" :show-close="false" :visible.sync="config.dataEditor.show" width="35%">
		<el-form :model="config.dataEditor.model"
		         label-width="60px"
		         size="small"
		         :rules="rules"
		         ref="dataEditorForm"
		         clearable>
			<el-form-item label="键" prop="name">
				<el-input v-model="config.dataEditor.model.name" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="config.dataEditor.model.type">
					<el-option v-for="(item, i) in dataType"
					           :key="item"
					           :label="item"
					           :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="值" v-if="config.dataEditor.model.type === 'string'">
				<el-input type="textarea"
				          :autosize="{ minRows: 2, maxRows: 10}"
				          resize="none"
				          v-model="stringValue"
				          autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="config.dataEditor.show = false">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveData">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'DataEditor',
    props: ['config'],
    data () {
      return {
        stringValue: '',
        dataType: ['string', 'hash', 'list', 'set', 'zset'],
        rules: {
          name: [{required: true, message: '必须填写名称'}],
          type: [{required: true, message: '必须选择类型'}]
        }
      }
    },
    methods: {
      /**
       * 保存数据
       */
      saveData () {
        let form = this.$refs.dataEditorForm
        form.validate((res, obj) => {
          if (!res) {
            return
          }
          let key = this.config.dataEditor.model.name
          let type = this.config.dataEditor.model.type
          this.config.client.addKey(key, type, this.stringValue)
          this.config.dataEditor.show = false
        })
      },
      /**
       * 重置表单
       */
      resetForm () {
        this.stringValue = ''
        this.$refs.dataEditorForm.resetFields()
      }
    },
    watch: {
      'config.dataEditor.show': function (val) {
        if (!val) {
          this.resetForm()
        }
      }
    }
  }
</script>

<style scoped>

</style>

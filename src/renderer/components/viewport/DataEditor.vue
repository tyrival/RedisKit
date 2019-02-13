<template>
	<el-dialog title="新增数据" :visible.sync="servers.storage.editor.show" width="35%">
		<el-form :model="servers.storage.editor.model"
		         label-width="60px"
		         size="small"
		         :rules="rules"
		         ref="dataEditorForm"
		         clearable>
			<el-form-item label="键" prop="name">
				<el-input v-model="servers.storage.editor.model.name" autocomplete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="servers.storage.editor.model.type">
					<el-option v-for="(item, i) in dataType"
					           :key="item"
					           :label="item"
					           :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="值" v-if="servers.storage.editor.model.type === 'string'">
				<el-input type="textarea"
				          :autosize="{ minRows: 2, maxRows: 10}"
				          resize="none"
				          v-model="stringValue"
				          autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="servers.storage.editor.show = false">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveData">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'DataEditor',
    props: ['servers'],
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
          let name = this.servers.storage.editor.model.name
          let type = this.servers.storage.editor.model.type
          let client = this.servers.connection
          switch (type) {
            case 'string':
              client.set(name, this.stringValue)
              break
            case 'hash':
              client.hset(name, 'item', '')
              break
            case 'list':
              client.lpush(name, 'item')
              break
            case 'set':
              client.sadd(name, 'item')
              break
            case 'zset':
              client.zadd(name, 0, 'item')
              break
            default:
              break
          }
          this.servers.storage.editor.show = false
        })
      }
    },
    watch: {
      'servers.storage.editor.show': function (val) {
        if (!val) {
          this.stringValue = ''
          this.$refs.dataEditorForm.resetFields()
        }
      }
    }
  }
</script>

<style scoped>

</style>

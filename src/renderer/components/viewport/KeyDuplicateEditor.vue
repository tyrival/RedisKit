<template>
	<el-dialog title="复制键"
	           :show-close="false"
	           :visible.sync="config.keyDuplicateEditor.key !== null && config.keyDuplicateEditor.key !== undefined"
	           width="35%">
		<el-input v-model="config.keyDuplicateEditor.model.key"
		          style="width:100%"
		          size="small"></el-input>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="config.keyDuplicateEditor.key = null">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveData">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'KeyDuplicateEditor',
    props: ['config'],
    methods: {
      /**
       * 保存数据
       */
      saveData () {
        let oldKey = this.config.keyDuplicateEditor.key
        let newKey = this.config.keyDuplicateEditor.model.key
        let model = this.config.client.model
        let type = model.type
        let value = model.value
        if (oldKey === newKey) {
          this.$message({message: '不可与原始键名称一致。', type: 'error', duration: 1000})
        } else {
          this.config.client.addKey(newKey, type, value)
        }
        this.config.keyDuplicateEditor.key = null
      },
      /**
       * 重置表单
       */
      reset () {
        this.config.keyDuplicateEditor.model.key = null
      }
    },
    watch: {
      'config.keyDuplicateEditor.key': function (val) {
        if (val === null || val === undefined) {
          this.reset()
        }
      }
    }
  }
</script>

<style scoped>

</style>

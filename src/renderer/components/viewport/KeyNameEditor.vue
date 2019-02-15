<template>
	<el-dialog title="键名称"
	           :show-close="false"
	           :visible.sync="config.keyNameEditor.key !== null && config.keyNameEditor.key !== undefined"
	           width="35%">
		<el-input v-model="config.keyNameEditor.model.key"
		          style="width:100%"
		          size="small"></el-input>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="config.keyNameEditor.key = null">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveData">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'KeyNameEditor',
    props: ['config'],
    methods: {
      /**
       * 保存数据
       */
      saveData () {
        let oldKey = this.config.keyNameEditor.key
        let newKey = this.config.keyNameEditor.model.key
        if (oldKey !== newKey) {
          this.config.client.saveKey(oldKey, newKey, () => {
            this.$message('保存成功。')
          })
        }
        this.config.keyNameEditor.key = null
      },
      /**
       * 重置表单
       */
      reset () {
        this.config.keyNameEditor.model.key = null
      }
    },
    watch: {
      'config.keyNameEditor.key': function (val) {
        if (val === null || val === undefined) {
          this.reset()
        }
      }
    }
  }
</script>

<style scoped>

</style>

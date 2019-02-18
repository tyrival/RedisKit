<template>
	<el-dialog title="设置过期时间"
	           top="22px"
	           :show-close="false"
	           :visible.sync="config.expireEditor.key !== null && config.expireEditor.key !== undefined"
	           width="35%">
		<el-form :model="config.expireEditor.model"
		         label-width="60px"
		         size="mini"
		         ref="expireEditorForm"
		         clearable>
			<el-form-item label="模式">
				<el-radio-group v-model="config.expireEditor.model.mode">
					<el-radio :label="0">持续时间</el-radio>
					<el-radio :label="1">截止时间</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="config.expireEditor.model.mode === 0" label="秒数" prop="duration">
				<el-input-number v-model="config.expireEditor.model.duration"
				                 style="width:220px"
				                 controls-position="right"
				                 size="small"
				                 :min="0"></el-input-number>
			</el-form-item>
			<el-form-item v-else label="时间" prop="timestamp">
				<el-date-picker v-model="config.expireEditor.model.timestamp"
				                :default-value="config.expireEditor.model.timestamp"
				                type="datetime"
				                size="small"
				                placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="config.expireEditor.key = null">取 消</el-button>
			<el-button size="mini" type="primary" @click="saveData">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
  export default {
    name: 'ExpireEditor',
    props: ['config'],
    methods: {
      /**
       * 保存数据
       */
      saveData () {
        let client = this.config.client
        let key = client.model.key
        let delay = 0
        if (this.config.expireEditor.model.mode === 1) {
          delay = (this.config.expireEditor.model.timestamp.getTime() - new Date().getTime()) / 1000
        } else {
          delay = this.config.expireEditor.model.duration
        }
        if (delay > 0) {
          client.setExpire(key, delay)
        } else {
          client.removeExpire(key)
        }
        this.config.expireEditor.key = null
      },
      /**
       * 重置表单
       */
      reset () {
        this.config.expireEditor.model.mode = 0
        this.config.expireEditor.model.duration = 0
        this.config.expireEditor.model.timestamp = 0
      }
    },
    watch: {
      'config.expireEditor.key': function (val) {
        if (val === null || val === undefined) {
          this.reset()
        }
      }
    }
  }
</script>

<style scoped>

</style>

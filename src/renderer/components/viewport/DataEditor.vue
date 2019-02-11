<template>
	<el-dialog title="新增数据" :visible.sync="servers.storage.editor.show" width="60%">
		<el-form :model="servers.storage.editor.model" label-width="60px" size="small">
			<el-row>
				<el-col :span="12">
					<el-form-item label="键">
						<el-input v-model="servers.storage.editor.model.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类型">
						<el-select v-model="servers.storage.editor.model.type">
							<el-option v-for="(item, i) in dataType"
							           :key="item"
							           :label="item"
							           :value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="值">
				<el-input type="textarea"
				          :autosize="{ minRows: 2, maxRows: 10}"
				          resize="none"
				          v-model="servers.storage.editor.model.value" autocomplete="off"></el-input>
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
        dataType: ['string', 'hash', 'list', 'set', 'zset']
      }
    },
    methods: {
      /**
       * 保存数据
       */
      saveData () {
        // TODO 增加表单校验规则，并在保存前验证
      }
    }
  }
</script>

<style scoped>

</style>

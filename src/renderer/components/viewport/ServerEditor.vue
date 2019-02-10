<template>
	<el-dialog title="服务器信息" :visible.sync="servers.editor.show" width="35%">
		<el-form :model="servers.editor.model" label-width="60px" size="mini">
			<el-form-item label="名称">
				<el-input v-model="servers.editor.model.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="服务器">
				<el-input v-model="servers.editor.model.host" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="端口">
				<el-input v-model="servers.editor.model.port" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="servers.editor.model.password" autocomplete="off"></el-input>
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
    methods: {
      saveServer () {
        let editIndex = this.servers.editor.index
        let model = Object.assign({partitions: []}, this.servers.editor.model)
        if (editIndex === null || editIndex === undefined) {
          this.servers.list.push(model)
        } else {
          this.servers.list.splice(editIndex, 1, model)
        }
        this.servers.editor.show = false
      }
    }
  }
</script>

<style scoped>

</style>

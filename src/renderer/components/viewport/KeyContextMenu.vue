<template>
	<div v-if="config.keyContextMenu.index !== undefined && config.keyContextMenu.index !== null"
	     :style="calcStyle"
	     class="context-menu">
		<div class="item" @click="setExpire">
			<i class="icon iconfont icon-top"></i> 设置过期时间
		</div>
		<div class="item" @click="renameKey">
			<i class="icon iconfont icon-top"></i> 重命名键
		</div>
		<div class="item" @click="duplicateKey">
			<i class="icon iconfont icon-top"></i> 复制键
		</div>
		<div class="separate-line"></div>
		<div class="item" @click="deleteKey">
			<i class="icon iconfont icon-copy"></i> 删除键
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/context-menu.scss'

  export default {
    name: 'KeyContextMenu',
    props: ['config'],
    computed: {
      calcStyle () {
        return {
          top: this.config.keyContextMenu.style.top + 'px',
          left: this.config.keyContextMenu.style.left + 'px'
        }
      }
    },
    methods: {
      /**
       * 设置过期时间
       */
      setExpire () {
        let key = this.config.client.model.key
        this.config.client.loadExpire(key, (_, result) => {
          if (result >= 0) {
            this.config.expireEditor.model.duration = result
            this.config.expireEditor.model.timestamp = result * 1000 + new Date().getTime()
          } else {
            this.config.expireEditor.model.timestamp = new Date()
          }
        })
        this.config.expireEditor.key = key
      },
      /**
       * 重命名键
       */
      renameKey () {
        this.config.keyNameEditor.key = this.config.client.model.key
        this.config.keyNameEditor.model.key = this.config.client.model.key
      },
      /**
       * 复制键
       */
      duplicateKey () {
        let key = this.config.client.model.key
        this.config.keyDuplicateEditor.key = key
        this.config.keyDuplicateEditor.model.key = key + ' DUP'
      },
      /**
       * 删除键
       */
      deleteKey () {
        let key = this.config.client.model.key
        this.$confirm('是否确定删除此键？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.config.client.removeKey(key)
        }).catch(() => {
        })
      },
      hide () {
        this.config.keyContextMenu.index = null
      }
    },
    watch: {
      'config.keyContextMenu.index': function (val) {
        if (val !== null && val !== undefined) {
          window.addEventListener('click', this.hide)
        } else {
          window.removeEventListener('click', this.hide)
        }
      }
    }
  }
</script>

<style scoped>

</style>

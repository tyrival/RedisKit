<template>
	<div v-if="config.keyContextMenu.index !== undefined && config.keyContextMenu.index !== null"
	     :style="calcStyle"
	     class="context-menu">
		<div class="item" @click="setExpireTime">
			<i class="icon iconfont icon-top"></i> 设置过期时间
		</div>
		<div class="item" @click="setExpireTime">
			<i class="icon iconfont icon-top"></i> 重命名键
		</div>
		<div class="item" @click="setExpireTime">
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
      setExpireTime () {
        // TODO
      },
      /**
       * 删除键
       */
      deleteKey () {
        // TODO
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

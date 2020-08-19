<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1. 创建better-scroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,  // 监听滚动级别
        pullUpLoad: this.pullUpLoad
      })

      // 2. 监听滚动位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', position => {
          this.$emit('scroll', position)
        })
      }

      // 3. 监听滚动到底部
      if (this.pullUpLoad){
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }

    },
    methods: {
      // 简化父子组件调用接口
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },

      refresh() {
        this.scroll && this.scroll.refresh()
      },

      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },

      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
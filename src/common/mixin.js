import BackTop from "components/content/backTop/BackTop"

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    // 设置滚动区域的位置
    btnClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
  }
}
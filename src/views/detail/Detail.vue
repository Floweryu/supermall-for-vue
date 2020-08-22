<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comments" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="btnClick" v-show="isShowBackTop"/>

    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import Toast from "components/common/toast/Toast"

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import {backTopMixin} from "common/mixin"

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Toast,

      Scroll,

      GoodsList,

    },
    mixins: [backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        message: '',
        show: false
      }
    },
    created() {
      // 保存传入的 iid
      this.iid = this.$route.query.iid

      // 根据 iid 请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.data.result
        // 获取轮播图
        this.topImages = data.itemInfo.topImages

        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)

        // 获取商品详情数据
        this.detailInfo = data.detailInfo

        // 获取商品参数据
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 获取评价信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0]
        }

        // 等待DOM被渲染，但是图片并没有加载完
        // 获取的 offsetTop 可能不包含图片
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        //
        //   console.log(this.themeTopYs);
        // })
      })

      // 请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.data.list
      })

      // 给 getThemeTopY 赋值(进行防抖）
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comments.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44)
        this.themeTopYs.push(Number.MAX_VALUE)
      }, 100)
    },
    mounted() {
      // 监听图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh, 200)
      this.$bus.$on('detailItemImageLoad', () => {
        refresh()
      })

    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
      contentScroll(position) {
        // 获取 y 值
        const positionY = -position.y
        this.isShowBackTop = position.y < -1000

        // 与主题中的 y 值做对比
        // [0, 7346, 8234, 8471]
        // y 值在 0 ~ 7346之间对应商品，使index = 0, 一次类推
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            // if (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]){
            //   this.currentIndex = i
            //   this.$refs.nav.currentIndex = this.currentIndex
            // }
            // else if(i === length - 1 && positionY >= this.themeTopYs[i]){
            //   this.currentIndex = i
            //   this.$refs.nav.currentIndex = this.currentIndex
            // }
          }
        }
      },
      addToCart() {
        // 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 将商品添加到购物车
        this.$store.dispatch("addCart", product).then(res => {
          this.message = res
          this.show = true

          setTimeout(() => {
            this.show = false
            this.message = ''
          }, 1500)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9999;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control ref="tabControlOne" :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick" class="tab-control" v-show="isFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3"
            @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control ref="tabControlTwo" :titles="['流行', '新款', '精选']" @tabClick="tabClick"/>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="btnClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/tabControl/TabControl"
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop"

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "common/utils";


  export default {
    name: "Home",
    components: {
      NavBar,
      Scroll,
      TabControl,
      GoodsList,
      BackTop,

      HomeSwiper,
      RecommendView,
      FeatureView,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isFixed: false,
        saveY: 0
      }
    },
    created() {
      // 1. 请求多个数据
      this.getHomeMultidata()

      // 2. 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {

      // 监听图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh, 200)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })

    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /*
      事件监听相关
       */


      // 根据点击的下标，获取对应的type
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControlOne.currentIndex = index
        this.$refs.tabControlTwo.currentIndex = index
      },

      // 设置滚动区域的位置
      btnClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },

      // 判断当前坐标是否显示返回顶部图标
      contentScroll(position) {
        this.isShowBackTop = position.y < -1000

        this.isFixed =  position.y < -this.tabOffsetTop
      },

      // 加载更多图片
      loadMore() {
        this.getHomeGoods(this.currentType)
      },

      // 获取tab-control的offsetTop
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControlTwo.$el.offsetTop
      },

      /*
      网络请求相关
       */
      // 请求轮播图的数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.data.banner.list;
          this.recommends = res.data.data.recommend.list;
        })
      },

      // 请求商品的数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.data.list);
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()    // 上拉加载更多
        })
        // this.$refs.scroll.finishPullUp()
      }
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    /*padding-top: 44px;*/
    height: 100vh;  /*设置视窗高度*/
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /*浏览器使用原生滚动时，为了不让导航一起滚动而使用*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*z-index: 9;*/
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content{
    position: absolute;
    overflow: hidden;   /*这里要这样设置*/
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>

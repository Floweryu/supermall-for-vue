<template>
  <div class="goods-item">
    <img :src="goodsItem.show.img" alt="">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  .goods-item{
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img{
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    text-align: center;
    font-size: 12px;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    position: absolute;
  }

  .goods-info p {
    overflow: hidden; /*设置超出块区域部分隐藏*/
    text-overflow: ellipsis;  /*设置超出部分以什么形式显示，这里是...*/
    white-space: nowrap;  /*处理空白*/
    margin-bottom: 3px;   /*设置外下边距*/
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect{
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~@/assets/img/common/collect.svg") 0 0/14px 14px;
    position: absolute;
  }

</style>
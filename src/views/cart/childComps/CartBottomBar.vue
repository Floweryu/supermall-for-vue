<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计: ￥{{totalPrice}}
    </div>

    <div class="calculate">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";

  export default {
    name: "",
    components: {
      CheckButton,
    },
    computed:{
      totalPrice() {
        return this.$store.state.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0)
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        // if (this.$store.state.cartList.length === 0) return false
        // return !(this.$store.state.cartList.filter(item => ! item.checked).length)
        // 找到没有选中的就返回false，即没有全选
        if (this.$store.state.cartList.length === 0) return false
        return ! (this.$store.state.cartList.find(item => ! item.checked))
      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) { // 如果全部选中
          this.$store.state.cartList.forEach(item => item.checked = false)
        } else {  // 部分或全部不选中
          this.$store.state.cartList.forEach(item => item.checked = true)
        }

        // 这里改变 item.checked的值后， isSelectAll的值也改变了
        // this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll)
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    background-color: white;
    position: relative;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    text-align: center;
  }
  .check-content {
    display: flex;
    align-items: center;
    border-top: 1px solid #eee;
    margin-left: 10px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 22px;
    margin-right: 5px;
  }

  .price {
    margin-left: 30px;
  }
  .calculate {
    width: 90px;
    background-color: var(--color-tint);
  }
</style>
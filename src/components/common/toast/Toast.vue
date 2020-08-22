<template>
  <div class="toast" v-show="show">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "",
    props: {
      message: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);   /*向左上平移50%*/
    padding: 8px 10px;

    border-radius: 5px;

    color: white;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
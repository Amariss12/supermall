<template>
  <div class="toast">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  props:{
    message:{
      type:String,
      default:''
    }
  }
}
</script>

<style scopde>

</style>
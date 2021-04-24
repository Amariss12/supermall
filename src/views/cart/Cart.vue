<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import { mapGetters } from 'vuex'
import CartList from './childComps/CartList.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'
export default {
  components:{
    NavBar,
    CartList,
    CartBottomBar
  },
  computed:{
   ...mapGetters(['cartLength'])
   }
    }
  

</script>

<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: white;
}
</style>
<template>
  <div id="detail">
    <detail-nav-bar />
    <scroll class="content">
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import { getDetail ,Goods,Shop} from "network/detail";
import DetailSwiper from './childComps/DetailSwiper.vue';
import DetailBaseInfo from './childComps/DetailBaseInfo.vue';
import DetailShopInfo from './childComps/DetailShopInfo.vue';
import Scroll from '../../components/common/scroll/Scroll.vue';

export default {
  name:"Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
  },
  data() {
    return {
      iid: null,
      topImages:[],
      goods:{},
      shop:{}
    };
  },
  created() {
    /**1.保存存入的iid */
    this.iid = this.$route.params.iid;
    /**2.根据iid请求详情数据 */
    getDetail(this.iid).then((res) => {
      console.log(res)
      const data = res.result
      /**获取顶部的图片轮播数据 */
  this.topImages = res.result.itemInfo.topImages
  /**获取商品信息 */
  this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
  /**获取shop信息 */
  this.shop = new Shop(data.shopInfo)
    });
  },
};
</script>

<style>
#detail{
  position: relative;
  z-index:9;
  background-color: #fff;
  height:100vh
}

.content{
  height: calc(100%-44px);
}

</style>
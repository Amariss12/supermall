<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" class="goods-info"/>
    <detail-param-info :paramInfo="paramInfo" ref="params"/>
    <detail-comment :commentInfo="commentInfo" ref="comment"/>
    <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-button-bav class="button-bar" @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import { getDetail ,Goods,Shop , GoodsParam,getRecommend} from "network/detail";
import DetailSwiper from './childComps/DetailSwiper.vue';
import DetailBaseInfo from './childComps/DetailBaseInfo.vue';
import DetailShopInfo from './childComps/DetailShopInfo.vue';
import Scroll from '../../components/common/scroll/Scroll.vue';
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
import DetailParamInfo from './childComps/DetailParamInfo.vue';
import DetailComment from './childComps/DetailComment.vue';
import GoodsList from '../../components/content/goods/GoodsList.vue';
import {itemListenerMixin,backTopMinin} from 'common/mixin'
import {debounce} from 'common/utils'
import DetailButtonBav from './childComps/DetailButtonBav.vue';
import {mapActions} from 'vuex' 


export default {
  name:"Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailComment,
    GoodsList,
    DetailButtonBav,
   
  },
  mixins:[itemListenerMixin,backTopMinin],
  data() {
    return {
      iid: null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      themeTopYs:[0,1000,2000,3000],
      getThemeTopY:null,
      currentIndex:0,
 
    };
  },
  created() {
    /**1.保存存入的iid */
    this.iid = this.$route.params.iid;
    /**2.根据iid请求详情数据 */
    getDetail(this.iid).then((res) => {
      // console.log(res)
      const data = res.result
      /**3.获取顶部的图片轮播数据 */
  this.topImages = res.result.itemInfo.topImages
  /**4.获取商品信息 */
  this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
  /**5.获取shop信息 */
  this.shop = new Shop(data.shopInfo)
  /**6.保存商品的详情信息 */
  this.detailInfo = data.detailInfo
  /**7.获取参数信息 */
  this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
  /**8.取出评论信息 */
  if(data.rate.cRate!==0){
    this.commentInfo = data.rate.list[0]
  }
    });
    /**9.取出推荐信息 */
    getRecommend().then(res=>{
      console.log(res)
      this.recommends = res.data.list
    })
    /**10.给getThemeTopY赋值 */
    this.getThemeTopY = debounce(()=>{
       this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
    })
  },

  methods:{
    ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position){
       this.isShowBackTop = (-position.y)>1000
      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0 ; i<length-1 ; i++){
        if(this.currentIndex !== i && (positionY >=this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
  addToCart(){
    /**1.获取购物车需要展示的信息 */
    const product = {}
    product.image = this.topImages[0]
    product.title = this.goods.title
    product.desc = this.goods.desc
    product.price = this.goods.newPrice
    product.iid = this.iid
    /**2.将商品添加到购物车里 */
    this.addCart(product).then(res=>{
      console.log(res)
    })
    /**3.添加到购物车成功 */
  }
  },
  mounted(){
    
  },
  destroyed(){
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  }
};
</script>

<style scoped>
#detail{
 position: relative;
  z-index:9;
  background-color: #fff;
  height:100vh;
}
.detail-nav{
  position: relative;
  z-index:9;
  background-color: #fff;
  
}
.content {
  position: absolute;
  top: 44px;
  bottom: 60px;

}
.goods-info{
  position: relative;
}

</style>
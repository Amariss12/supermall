<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
     <tab-control class="tab-control" 
    :titles="['流行','新款','精选']"
    @tabClick="tabClick"
    ref="tabControl1"
    v-show="isTabFixed"/>
  <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"
  :pullUpLoad="true"
  @pullingUp="loadMore">
   <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
   <recommend-view :recommends="recommends"/>
   <feature-view/>
   <tab-control 
    :titles="['流行','新款','精选']"
    @tabClick="tabClick"
    ref="tabControl2" />
   <goods-list :goods="showGoods"></goods-list>
  </scroll>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from '../../components/content/tabControl/TabControl.vue'
import GoodsList from '../../components/content/goods/GoodsList.vue'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import Scroll from '../../components/common/scroll/Scroll.vue'
import {itemListenerMixin,backTopMinin} from 'common/mixin'

export default {
  name:"Home",
  components:{
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins:[itemListenerMixin,backTopMinin],
  data(){
    return {
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]}
      },
      currentType:'pop',
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0,
      
    }
  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    },
 
  },
   activated(){
    this.$refs.scroll.scrollTo(0,this.saveY,1)
    this.$refs.scroll.refresh()
   
  },
  deactivated(){
    this.saveY = this.$refs.scroll.getScrollY()
   this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  created(){
   
   this.getHomeMultidata()
  this.getHomeGoods('pop')
  this.getHomeGoods('new')
  this.getHomeGoods('sell')
  
  },
  mounted(){
   
  },
  
  methods:{

    /**
     * 事件监听相关方法
     */
    
    tabClick(index){
      switch(index){
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
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
   
    contentScroll(position){
      /**
       * 1.判断BackTop是否显示
       */
      this.isShowBackTop = (-position.y)>1000
      /**2.决定tabControl是否吸顶(position:fixed) */
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.refresh()
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      console.log(this.tabOffsetTop)
    },

    /**
     * 网络请求相关方法
     */
getHomeMultidata(){
   getHomeMultidata().then(res=>{
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    })
},
getHomeGoods(type){
  const page = this.goods[type].page + 1
getHomeGoods(type,page).then(res=>{
  this.goods[type].list.push(...res.data.list)
  this.goods[type].page +=1

  this.$refs.scroll.finishPullUp()

    })
}
  }
}
</script>

<style scoped>
#home{
  padding-top: 44px;
  height:100vh;
  position: relative;
}



.home-nav{
  background-color: var(--color-tint);
  color:#fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;

}



.content{
  position: absolute;
  top:44px;
  bottom: 49px;
  left: 0;
  right: 0;


}
.tab-control{
  position: relative;
  z-index:9;
 
}

</style>
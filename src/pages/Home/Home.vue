<template>
  <div class='home'>
    <template v-if="bType == 'store'">
      <ec-search :preview="false" :data="searchStoreData"></ec-search>
      <ec-shop-signs :preview="false"></ec-shop-signs>
      <ec-line :preview="false" :data="lineData"></ec-line>
    </template>
    <template v-else-if="bType == 'home'">
      <app-down></app-down>
    </template>
    <component v-for="(item,index) in modules" :key="index" :is="'ec-'+item.module" :data="item.data" :preview="false" :modules-index="index">
      {{ item }}
    </component>
    <template v-if="bType == 'store'">
      <ec-shop-menu :preview="false"></ec-shop-menu>
      <CommonNav></CommonNav>
    </template>
    <template v-else>
      <ec-tab-down v-if="bType !='store'"></ec-tab-down>

      <!--天降红包-->
      <van-popup v-model="bonusShow" class="bonus-show" v-if="bonusData" style="width: 80%;">
        <a :href="bonusData.ad_link"><img :src="bonusData.popup_ads" class="img" v-if="bonusData.popup_ads" /></a>
      </van-popup>
    </template>
    <ec-filter-top :preview="false" v-if="bType != 'store'"></ec-filter-top>
  </div>
</template>

<script>
//node library
import url from 'url'
import qs from 'qs'

// mapActions mapState
import {
  mapActions,
  mapState
} from 'vuex'

// custom components
import EcSlide from '@/components/slide/Frontend'
import EcTitle from '@/components/title/Frontend'
import EcAnnouncement from '@/components/announcement/Frontend'
import EcNav from '@/components/nav/Frontend'
import EcLine from '@/components/line/Frontend'
import EcBlank from '@/components/blank/Frontend'
import EcJigsaw from '@/components/jigsaw/Frontend'
import EcProduct from '@/components/product/Frontend'
import EcCoupon from '@/components/coupon/Frontend'
import EcCountDown from '@/components/count-down/Frontend'
import EcButton from '@/components/button/Frontend'
import EcSearch from '@/components/search/Frontend'
import EcStore from '@/components/store/Frontend'
import EcShopSigns from '@/components/shop-signs/Frontend'
import EcShopMenu from '@/components/shop-menu/Frontend'
import EcTabDown from '@/components/tab-down/Frontend'
import EcFilterTop from '@/components/element/FilterTop'
import AppDown from '@/components/element/AppDown'
import CommonNav from '@/components/CommonNav'

// third party components
import {
  Button
} from 'element-ui'

import {
  Toast,
  Popup
} from 'vant'

//data-conversion
import { conversion } from '@/assets/js/data-conversion'

export default {
  name: 'home',
  components: {
    "EcButton": Button,
    EcSlide,
    EcTitle,
    EcAnnouncement,
    EcNav,
    EcLine,
    EcBlank,
    EcJigsaw,
    EcProduct,
    EcCoupon,
    EcCountDown,
    EcButton,
    EcSearch,
    EcStore,
    EcShopSigns,
    EcShopMenu,
    EcTabDown,
    EcFilterTop,
    AppDown,
    CommonNav,
    [Popup.name]: Popup,
  },
  data() {
    return {
      fromId:'',
      share:'',
      shop_title:'',
      initial:'',
      bonusShow:false,
      bonusData:''
    }
  },
  created() {
	
    let load = ''
    if(this.bType == 'index'){
      load = localStorage.getItem('modules') ? 0 : ''
    }else{
      load = this.$route.params.id
    }

    let modulesType = JSON.parse(localStorage.getItem('modulesType'));
    if(modulesType == null){
      this.setModulesType();
    }
    
    this.init(load)
  },
  mounted(){
	 
    if(this.bType == 'index'){
      this.shopConfig()
    }
  },
  methods: {
    init(id){
	
      let modulesType = JSON.parse(localStorage.getItem('modulesType'));
      let codeurl = this.$route.query.codeurl;  //从后台扫码进入前台标识
      if(this.bType == 'home'){
        if((modulesType.type != window.shopInfo.type) || (modulesType.name != this.bType) || this.bStore != id || this.modules == null || codeurl === 'true'){
            this.getModule({
              ru_id:this.bStore,
              type:this.bType
            })

          //更新缓存modulesType
          this.setModulesType();

          //更新判断是否使用缓存
          this.initial = true
          return
        }else{
          this.initial = false
        }
      }else{
        this.initial = true
        //判断是否是专题首页
        if(this.bType == 'topic'){
          this.$store.dispatch('setModuleInfo', {
            id: this.$route.params.id,
            type:this.bType
          })
        }else{
          this.getModule({
            ru_id:this.bStore,
            type:this.bType
          })
        }
      }
    },
    setModulesType(){
      let newModulesType = {
        type:window.shopInfo.type,
        name:this.bType
      }

      localStorage.setItem('modulesType',JSON.stringify(newModulesType))
    },
    getModule(o) {
      this.modules = []
      this.$http.post(`${window.ROOT_URL}api/v4/visual/default`, qs.stringify(o)).then(({ data }) => {
        if(data.data){
          this.$store.dispatch('setModuleInfo', {
            id: data.data,
            type:o.type
          })
        }else{
          Toast({
            message:data.errors.message,
            duration:1000
          });
          this.$router.push({
            name:'home'
          })
        }
      })
    },
    shopConfig(){
      let configData = JSON.parse(sessionStorage.getItem('configData'));
      if(!configData){
        this.$http.get(`${window.ROOT_URL}api/v4/shop/config`).then(({data:{data}})=>{
          //首页天降红包广告
          this.bonusData = data.bonus_ad;

          //单独设置微信分享信息
          this.$wxShare.share({
            title:data.shop_title,
            desc:data.shop_desc,
            link:window.location.href,
            imgUrl:data.wap_logo
          })

          //设置title
          document.title = data.shop_title
          sessionStorage.setItem('configData',JSON.stringify(data));
        })
      }else{
        //单独设置微信分享信息
        this.$wxShare.share({
          title:configData.shop_title,
          desc:configData.shop_desc,
          link:window.location.href,
          imgUrl:configData.wap_logo
        })

        //首页天降红包广告
        //this.bonusData = configData.bonus_ad;

        //设置title
        document.title = configData.shop_title
      }
    },
  },
  computed: {
    ...mapState({
      searchStoreData: state => state.shopInfo.searchStoreData,
      lineData: state => state.shopInfo.lineData,
      titleData: state => state.shopInfo.titleData,
      productData: state => state.shopInfo.productData,
    }),
    bStore() {
      return this.$route.params.id ? this.$route.params.id : 0
    },
    bType(){
      let type = 'index'
      if(this.$route.name == 'home'){
        type = 'index'
      }else if(this.$route.name == 'shopHome'){
        type = 'store'
      }else if(this.$route.name == 'topicHome'){
        type = 'topic'
      }
      return type
    },
    bMoudles() {
      return 0 < this.modules.length ? true : false
    },
    modules:{
      get(){
		 
        return this.$store.state.modules
      },
      set(val){
        this.$store.state.modules = val
      }
    }
  },
  watch:{
    '$route'(to,from){
      this.fromId = from.params.id ? parseInt(from.params.id) : 0;
      this.init(this.fromId)
    },
    bonusData(){
      if(this.bonusData && this.bonusData.open == 1){
        this.bonusShow = true
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.bonus-show{ background: none; }
</style>
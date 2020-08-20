<template>
  <div class='home'>
    <ec-search :preview="false" :data="searchStoreData"></ec-search>
    <ec-shop-signs :preview="false"></ec-shop-signs>
    <ec-line :preview="false" :data="lineData"></ec-line>
    <component v-for="(item,index) in modules" :key="index" :is="'ec-'+item.module" :data="item.data" :preview="false" :modules-index="index">
      {{ item }}
    </component>
    <ec-shop-menu :preview="false"></ec-shop-menu>
    <CommonNav></CommonNav>
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
      share:'',
      shop_title:'',
      shop_id:this.$route.params.id
    }
  },
  created() {
	 
    //this.init(this.shop_id)
  },
  mounted(){
    this.shopConfig()
	
	
  },
  activated(){
	this.init(this.shop_id)
	  // if (localStorage.getItem('sx')!=0){
		 //  localStorage.setItem('sx',0)
		 //  this.init(this.shop_id)
	  // }

 },
  methods: {
    init(id){
      this.getModule({
        ru_id:id,
        type:'store'
      })
    },
    setModulesType(){
      let newModulesType = {
        type:window.shopInfo.type,
        name:'store'
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
      userInfo: state => state.user.userInfo
    }),
    modules:{
      get(){
		 console.log(this.$store.state.modules)
        return this.$store.state.modules
      },
      set(val){
        this.$store.state.modules = val
      }
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
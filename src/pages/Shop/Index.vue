<template>
	<div class="con">
	 	<div class="store-nav-list">
	 		<swiper class="box-flex" :options="swiperOption" ref="mySwiper">
	 			<swiper-slide>
	 				<a href="javascript:;" @click="shopCatClick(0)" :class="{'active':cat_id == 0}">
	 				<div class="store-box all-category"><i class="iconfont icon-menu"></i></div>
	 				<h5>{{$t('lang.all_categories')}}</h5>
	 				</a>
	 			</swiper-slide>
				<swiper-slide v-for="(item, index) in shopCatList" :key="index">
					<a href="javascript:void(0)" @click="shopCatClick(item.cat_id)" :class="{'active':cat_id == item.cat_id}">
					<div class="store-box"><img :src="item.touch_icon" class="img" v-if="item.cat_icon"><img src="../../assets/img/no_image.jpg" alt="" class="img" v-else></div>
					<h5>{{ item.cat_alias_name }}</h5>
					</a>
				</swiper-slide>
			</swiper>
	 	</div>
	 	<div class="shopping-menu" :class="{'distance-active':order == 'DESC' || regionShow}">
		 	<div class="filter_tab">
		 		<div class="pro_filter_items dis-box">
		 			<div class="item" :class="{'active':sort == 'sort'}" @click="filterHandle('hot')"><span>{{$t('lang.hot_alt')}}</span><i class="iconfont icon-xiajiantou"></i></div>
		 			<div class="item" :class="{'active':regionShow}" @click="filterHandle('region')"><span>{{$t('lang.region')}}</span><i class="iconfont icon-xiajiantou"></i></div>
		 			<!-- <div class="item" :class="{'active':sort == 'distance'}" @click="filterHandle('distance')"><span>{{$t('lang.distance')}}</span><i class="iconfont icon-xiajiantou"></i></div>
		 			<div class="item" @click="filterHandle('range')"><span>{{$t('lang.nearby')}}</span></div> -->
		 		</div>
		 	</div>
		 </div>
		 <div class="store-info" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400">
		 	<div class="store-list" v-for="(item,index) in shopList" :key="index">
		 		<header class="goods-shop-info padding-all">
					<section class="dis-box">
						<div class="g-s-i-img" @click="shopDetail(item.user_id)"><img :src="item.logo_thumb" class="img"></div>
						<div class="g-s-i-title box-flex" @click="shopDetail(item.user_id)">
							<h3>{{ item.rz_shopName }}</h3>
							<p>{{$t('lang.collection_one')}} <span>{{ item.count_gaze }}</span> {{$t('lang.collection_two')}}</p>
							<!-- <p class="distance">{{$t('lang.distance')}}{{ item.distance }}km</p> -->
						</div>
						<div class="g-s-info-add">
							<a href="javascript:void(0);" :class="{'active':item.is_collect_shop == 0}" @click="collectHandle(item.user_id,item.is_collect_shop)">
								<span v-if="item.is_collect_shop == 1">{{$t('lang.followed')}}</span>
								<span v-else>{{$t('lang.did_not_concern')}}</span>
							</a>
						</div>
					</section>
				</header>
		 		<template v-if="item.goods.length > 0">
		 		<section class="goods-shop-pic">
		 			<div class="padding-all">
		 				<swiper class="product-one-list of-hidden" :options="swiperOption">
				 			<swiper-slide class="product-list-li" v-for="(goods,goodsIndex) in item.goods" :key="goodsIndex">
				 				<div class="product-div">
				 					<router-link :to="{ name: 'goods', params: { id: goods.goods_id }}">
				 					<img class="product-list-img" :src="goods.goods_thumb" v-if="goods.goods_thumb">
				 					<img src="../../assets/img/no_image.jpg" alt="" class="product-list-img" v-else>
				 					<div class="product-text"><p><span class="price"><em>¥{{ goods.shop_price }}</em></span></p></div>
				 					</router-link>
				 				</div>
				 			</swiper-slide>
				 		</swiper>
			 		</div>
		 		</section>
		 		</template>
		 	</div>
		 	<div class="footer-cont" v-if="footerCont">{{$t('lang.no_more')}}</div>
		 	<template v-if="loading">
				<van-loading type="spinner" color="black" />
			</template>
		 </div>
		 <Region :display.sync="regionShow" :regionOptionDate.sync="regionOptionDate"></Region>
	 </div>
</template>

<script>
import { mapState } from 'vuex'

import {
	List,
	Dialog,
	Waterfall,
	Loading,
	Toast
} from 'vant'

import {
    swiper,
    swiperSlide
} from 'vue-awesome-swiper'

import Region from '@/components/Region'
import ShopHeader from '@/components/shop/ShopHeader'
import arrRemove from '@/mixins/arr-remove'

export default{
	data(){
		return{
			swiperOption:{
				notNextTick: true,
				watchSlidesProgress: true,
				watchSlidesVisibility: true,
				slidesPerView: 'auto',
				lazyLoading: true,
			},
			disabled: false,
			loading:true,
			shopScore:false,
			size:10,
			page:1,
			cat_id:0,
			sort:'sort_order',
			order:'ASC',
			lat:'',
			lng:'',
			regionShow:false,
			regionOptionDate:{
				province:{
					id:'',
					name:''
				},
				city:{
					id:'',
					name:''
				},
				district:{
					id:'',
					name:''
				},
				street:{
					id:'',
					name:''
				},
				regionSplic:''
			},
			footerCont:false
		}
	},
	components:{
		swiper,
		swiperSlide,
		ShopHeader,
		Region,
		[Dialog.name]:Dialog,
		[List.name]:List,
		[Loading.name]:Loading,
		[Toast.name]:Toast
	},
	directives: {
		WaterfallLower: Waterfall('lower'),
		WaterfallUpper: Waterfall('upper')
	},
	created(){
		let that = this;
		
		that.$store.dispatch('setShopCatList');

		navigator.geolocation.getCurrentPosition(that.showPosition,that.showErr)
	},
	computed:{
		...mapState({
			shopCatList: state => state.shop.shopCatList
		}),
		shopList:{
			get(){
				return this.$store.state.shop.shopList
			},
			set(val){
				this.$store.state.shop.shopList = val	
			}
		},
		isLogin(){
 			return localStorage.getItem('token') == null ? false : true
 		},
 		shopCollectStatue(){
			return this.$store.state.user.shopCollectStatue
		},
		regionSplic() {
			return this.regionOptionDate.regionSplic
	    },
	},
	methods:{
		shopListLoad(page){
			if(page){
				this.page = page
				this.size = Number(page) * 10
			}

			this.$store.dispatch('setShopList',{
				cat_id:this.cat_id,
				warehouse_id:0,
				area_id:0,
				size:this.size,
				page:this.page,
				sort:this.sort,
				order:this.order,
				lat:this.lat,
				lng:this.lng,
				city_id:this.regionOptionDate.city.id
			})
		},
		shopCatClick(val){
			this.cat_id = val
			this.shopListLoad()
		},
		filterHandle(val){
			if(val == 'hot'){
				this.order = this.order == 'ASC' ? 'DESC' : 'ASC'
				this.sort = 'sort'
				this.shopListLoad()
			}else if(val == 'region'){
				this.handelRegionShow()
				this.order = 'ASC'
			}else if(val == 'distance'){
				this.order = this.order == 'ASC' ? 'DESC' : 'ASC'
				this.sort = 'distance'
				this.shopListLoad()
			}else{
				this.$store.dispatch('setShopMap',{
					lat:this.lat,
					lng:this.lng
				}).then(res=>{
					if(res.status == 'success'){
						window.location.href= res.data
					}else{
						Toast(this.$t('lang.locate_failure'))
					}
				})
			}
		},
		handelRegionShow(){
			this.regionShow = this.regionShow ? false : true
		},
		loadMore(){
			setTimeout(() => {
				this.disabled = true
		    	if(this.page * this.size == this.shopList.length){
		  			this.page ++
		  			this.shopListLoad()	
		  		}
	    	},200)
		},
		shopDetail(val){
			this.$router.push({
				name:'shopHome',
				params:{
					id:val
				}
			})
		},
		collectHandle(val,status){
			if(this.isLogin){
				this.$store.dispatch('setCollectShop',{
					ru_id:val,
					status:status
				})
			}else{
				let msg = this.$t('lang.fill_in_user_collect_goods')
				this.notLogin(msg)
			}
		},
		notLogin(msg){
			Dialog.confirm({
				message:msg,
				className:'text-center'
			}).then(()=>{
				this.$router.push({
					path: '/login',
					query:{ redirect: {name:'shop'}}
				})
			}).catch(()=>{

			})
		},
		showPosition(postion){
			let that = this;
			that.lat = postion.coords.latitude;
			that.lng = postion.coords.longitude;

			this.shopListLoad()
		},
		showErr(err){
			let that = this;
			that.lat = 31.23037;
			that.lng = 121.4737;

			this.shopListLoad()
		},
		shippingFee(val) {
	      this.$store.dispatch('setShippingFee', {
	          goods_id: 0,
	          position: val
	      })
	    },
	},
	watch:{
		shopList(){
	  		if(this.page * this.size == this.shopList.length){
	  			this.disabled = false
	  			this.loading = true
	  		}else{
	  			this.loading = false
	  			this.footerCont = this.page > 1 ? true : false
	  		}
	  		this.shopList = arrRemove.trimSpace(this.shopList)
	  	},
	    shopCollectStatue(){
	      	this.shopCollectStatue.forEach((v)=>{
				this.shopList.forEach((res) => {
					if(res.user_id == v.id){
						res.is_collect_shop = v.status
						res.count_gaze = v.status == 1 ? res.count_gaze + 1 : res.count_gaze - 1
					}
				})
	      	})
	    },
	    regionShow(){
	    	if(!this.regionShow){
	    		this.shopListLoad()
	    	}
	    },
	    regionSplic(){
	      let shipping_region = {
	        province_id: this.regionOptionDate.province.id,
	        city_id: this.regionOptionDate.city.id,
	        district_id: this.regionOptionDate.district.id,
	        street_id: this.regionOptionDate.street.id
	      }

	      //运费
	      this.shippingFee(shipping_region)
	    }
	}
}
</script>

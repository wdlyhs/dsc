<template>
	<div class="store_cont-box">
		<div class="store_cont-list">
			<div class="store_cont_top">
				<div class="region_select">
					<van-cell-group class="van-cell-noleft">
						<van-cell :title="$t('lang.label_region_select')" v-model="regionOptionDate.regionSplic" @click="handelRegionShow" is-link />
					</van-cell-group>
				</div>
			</div>
			<section class="store_cont_warp">
				<div class="store_list">
					<ul class="new-store-radio" v-if="storeContent.length>0">
						<li :class="{'active':store_id == item.id, 'disabled': item.is_stocks == 0}" v-for="(item,index) in storeContent" :key="index" @click="storeClick(item.id,item.is_stocks)">
							<div class="flow-have-adr padding-all">
								<div class="f-h-adr-title">
									<label>{{ item.stores_name }}</label>
									<span><a :href="item.map_url"><i class="iconfont icon-location"></i>{{$t('lang.view_route')}}</a></span>
								</div>
								<p class="f-h-adr-con t-remark m-top06 store-address-cont">[{{ item.address }} {{ item.stores_address }}]</p>
							</div>
						</li>
					</ul>
					<NotCont v-else></NotCont>
				</div>
				<div class="filter-btn store-btn-box">
					<div class="van-cell-noleft2">
						<van-cell :title="$t('lang.arrival_time')" v-model="dataTime" @click="dataShow" is-link />
					</div>
					<van-field :label="$t('lang.phone_number')" type="tel" v-model="mobile" :placeholder="$t('lang.fill_in_mobile')" />
					<div class="van-sku-actions">
						<van-button type="default" class="van-button--bottom-action" @click="onClose">{{$t('lang.close')}}</van-button>
						<van-button type="primary" class="van-button--bottom-action" @click="onStorebtn">{{$t('lang.immediately_private')}}</van-button>
					</div>
				</div>
			</section>
		</div>
		<Region :display.sync="regionShow" :regionOptionDate.sync="regionOptionDate"></Region>
		<van-popup v-model="show" position="bottom" class="show-popup-bottom show-goods-coupon">
		<van-datetime-picker
		  v-model="currentDate"
		  type="datetime"
		  @confirm="dataConfirm"
		  @cancel="dataCancel"
		/>
		</van-popup>
	</div>
</template>

<script>
import qs from 'qs'
import {
	Cell,
	CellGroup,
	Field,
	Button,
	Popup,
	DatetimePicker,
	Toast,
	Dialog
} from 'vant'

import Region from '@/components/Region'
import NotCont from '@/components/NotCont'

import format from '@/mixins/date-format'

export default{
	data(){
		return{
			show:false,
			storeContent:[],
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
			mobile:'',
			dataTime:'',
			minHour: 10,
			maxHour: 20,
			minDate: new Date(),
			maxDate: new Date(2019, 10, 1),
			currentDate: new Date(),
			store_id:0,
			rec_id:this.$route.query.rec_id ? this.$route.query.rec_id : ''
		}
	},
	components:{
		[Cell.name]:Cell,
		[CellGroup.name]:CellGroup,
		[Field.name]:Field,
		[Button.name]:Button,
		[Popup.name]:Popup,
		[DatetimePicker.name]:DatetimePicker,
		[Toast.name]:Toast,
		[Dialog.name]:Dialog,
		Region,
		NotCont
	},
	created(){
		let result = JSON.parse(localStorage.getItem('regionOption'))
		let o = {}

		if(result){
			this.regionOptionDate = result;

			if(this.rec_id){
				o = {
					province_id:result.province.id,
					city_id:result.city.id,
					district_id:result.district.id,
					street_id:result.street.id,
					goods_id:0,
					rec_id:this.rec_id,
					page:1,
					size:10
				}
			}else{
				o = {
					province_id:result.province.id,
					city_id:result.city.id,
					district_id:result.district.id,
					street_id:result.street.id,
					goods_id:this.$route.query.id,
					spec_arr:this.$route.query.attr_id,
					num: this.$route.query.num,
					page:1,
					size:10
				}
			}
			this.storeList(o)
		}
	},
	mounted(){
		this.dataTime = format.formatDate(this.minDate)
	},
	computed:{
		isLogin() {
            return localStorage.getItem('token') == null ? false : true
        },
	},
	methods:{
		storeList(o){
			this.$http.get(`${window.ROOT_URL}api/v4/offline-store/list`,{ params:o }).then(({data})=>{
				this.storeContent = data.data.list
				this.storeContent.forEach((v,i)=>{
					if(i == 0 && v.is_stocks != 0){
						this.store_id = v.id
					}
				})
				this.mobile = data.data.phone ? data.data.phone : ''
			})
		},
		storeClick(id,is_stocks){
			if(is_stocks != 0){
				this.store_id = id
			}else{
				Toast(this.$t('lang.understock'))
			}
		},
		handelRegionShow(){
			this.regionShow = this.regionShow ? false : true
		},
		dataShow(){
			this.show = true
		},
		onClose(){
			if(this.rec_id){
				this.$router.push({
					name:'cart'
				})
			}else{
				this.$router.push({
					name:'goods',
					params:{
						id:this.$route.query.id
					}
				})
			}
		},
		onStorebtn(){
			if(!this.checkMobile()){
				Toast(this.$t('lang.mobile_not_null'))
				return false
			}else if(this.dataTime == ''){
				Toast(this.$t('lang.fill_in_arrival_time'))
				return false
			}else if(this.store_id == 0){
				Toast(this.$t('lang.fill_in_store'))
				return false
			}

			if(this.isLogin){
				if(this.rec_id){					   
					this.$http.post(`${window.ROOT_URL}api/v4/cart/offline/update`,qs.stringify({
						rec_id:this.rec_id,
						store_id:this.store_id,
						store_mobile:this.mobile,
		                take_time:this.dataTime,
		                num:''
					})).then(({data})=>{	
						if(data.data.error == 0){
							this.$router.push({
				                name: 'checkout',
				                query: {
				                    rec_type: 12,
				                    store_id: this.store_id,
				                }
				            })
			   			}else{
			   				Toast(data.data.msg)
			   			}
					})
				}else{
					this.$store.dispatch('setStoresCart',{
						goods_id:this.$route.query.id,
						store_id:this.store_id,
		                num: this.$route.query.num,
						spec: this.$route.query.attr_id,
						store_mobile:this.mobile,
		                take_time:this.dataTime,
		                warehouse_id:'0',
		                area_id:'0',
		                parent_id:'0',
		                quick:1,
		                rec_type:12,
		                parent:0
					}).then(res=>{
						if(res.data == true){
							this.$router.push({
				                name: 'checkout',
				                query: {
				                    rec_type: 12,
				                    store_id:res.store_id,
				                }
				            })
			            }else{
			            	if(res.data.error == 1){
			            		Toast(res.data.msg)
			            	}else{
			            		Toast(this.$t('lang.private_store_fail'))
			            	}
			            }
					})
				}
			}else{
                let msg = this.$t('lang.login_user_invalid')
                this.notLogin(msg)
            }
		},
		dataConfirm(){
			this.dataTime = format.formatDate(this.currentDate)
			this.show = false
		},
		dataCancel(){
			this.show = false
		},
		//手机验证
		checkMobile() {
            let rule = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
            if (rule.test(this.mobile)){
            	return true
            } else {
                return false
            }
        },
        mapRange(lat,lng){
        	this.$store.dispatch('setShopMap',{
				lat:lat,
				lng:lng
			}).then(res=>{
				if(res.status == 'success'){
					window.location.href= res.data
				}else{
					Toast(this.$t('lang.locate_failure'))
				}
			})
        },
        notLogin(msg) {
            let url = window.location.href;
            let query;

            if(this.rec_id){
            	query = {
            		rec_id : this.rec_id
            	}
            }else{
            	query = {
            		id:this.$route.query.id,
            		attr_id:this.$route.query.attr_id,
            		num:this.$route.query.num
            	}
            }

            Dialog.confirm({
                message: msg,
                className: 'text-center'
            }).then(() => {
                this.$router.push({
                    name: 'login',
                    query: {
                        redirect: {
                            name:'storeGoods', 
                            query:query,
                            url:url
                        }
                    }
                })
            }).catch(() => {

            })
        },
	},
	watch:{
		regionShow(){
			let o = {}
			
			if(!this.regionShow){
				if(this.rec_id){
					o = {
						province_id:this.regionOptionDate.province.id,
						city_id:this.regionOptionDate.city.id,
						district_id:this.regionOptionDate.district.id,
						street_id:this.regionOptionDate.street.id,
						goods_id:0,
						rec_id:this.rec_id,
						page:1,
						size:10
					}
				}else{
					o = {
						province_id:this.regionOptionDate.province.id,
						city_id:this.regionOptionDate.city.id,
						district_id:this.regionOptionDate.district.id,
						street_id:this.regionOptionDate.street.id,
						goods_id:this.$route.query.id,
						spec_arr:this.$route.query.attr_id,
						num: this.$route.query.num,
						page:1,
						size:10
					}
				}

				this.storeList(o)
			}
		}
	}
}
</script>
<style>
.van-sku-actions{ display: flex; flex-direction: row; }
</style>
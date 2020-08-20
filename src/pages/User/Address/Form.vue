<template>
	<div class="con bg-color-write">
	  	<div class="flow-consignee">
		    <div class="text-all dis-box">
		    	<label>{{ $t('lang.consignee') }}<em>*</em></label>
		    	<div class="input-text">
		    		<ec-input type="text" size="consignee" v-model="consignee" :placeholder="$t('lang.enter_consignee')"></ec-input>
		    		<i class="iconfont icon-guanbi1 close-common"></i>
		    	</div>
		    </div>
		    <div class="text-all dis-box">
		    	<label>{{ $t('lang.phone_number') }}<em>*</em></label>
		    	<div class="input-text">
		    		<ec-input type="tel" size="mobile" v-model="mobile" :placeholder="$t('lang.enter_contact_number')"></ec-input>
		    		<i class="iconfont icon-guanbi1 close-common"></i>
		    	</div>
		    </div>
		    <div class="text-all dis-box">
		    	<label>{{ $t('lang.region_alt') }}<em>*</em></label>
		    	<div class="input-text">
		    		<div class="address-box" @click="handelRegionShow">
			    		<span class="text-all-span">{{ regionSplic }}</span>
			    		<span class="user-more"><i class="iconfont icon-more"></i></span>
			    	</div>
		    	</div>
		    </div>
		    <div class="text-all">
		    	<label>{{ $t('lang.detail_info') }}<em>*</em></label>
		    	<div class="input-text">
		    		<ec-input type="text" size="address" v-model="address" :placeholder="$t('lang.enter_address')"></ec-input>
		    		<i class="iconfont icon-guanbi1 close-common"></i>
		    	</div>
		    </div>
		    <div class="ect-button-more">
		    	<a href="javascript:;" class="btn btn-submit" @click="submitBtn">{{ $t('lang.save') }}</a>
		    </div>
	  	</div>
		<Region :display.sync="regionShow" :regionOptionDate.sync="regionOptionDate"></Region>

		<!-- 快捷菜单 -->
        <CommonNav></CommonNav>
	</div>
</template>

<script>
import qs from 'qs'
import { mapState } from 'vuex'
import { Input } from 'element-ui'

import { 
	Popup,
	Picker,
	Toast,
} from 'vant'

import Region from '@/components/Region'
import CommonNav from '@/components/CommonNav'

export default{
	data(){
		return{
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
			consignee:'',
			mobile:'',
			address:'',
			wximport:this.$route.query.wximport ? this.$route.query.wximport : false
		}
	},
	components:{
		Region,
		CommonNav,
		'EcInput':Input,
		[Popup.name]:Popup,
		[Picker.name]:Picker,
		[Toast.name]:Toast,
	},
	created(){
		let id = this.$route.params.id
		let result = JSON.parse(localStorage.getItem('regionOption'))
		let that = this

		if(id){
			this.addressInfoInt(id)
		}else{
			if(this.wximport){
				wx.openAddress({
  					success: function (res) {
						that.$store.dispatch('userWxImportAddress',{
							provinceName:res.provinceName,
							cityName:res.cityName,
							countyName:res.countryName,
							detailInfo:res.detailInfo,
							telNumber:res.telNumber,
							userName:res.userName
						}).then(result => {
							if(result.status == 'success'){
								that.consignee = result.data.consignee ? result.data.consignee : ''
								that.mobile = result.data.mobile ? result.data.mobile : ''
								that.address = result.data.address ? result.data.address : ''
								that.regionOptionDate.province.id = result.data.province ? result.data.province : ''
			                    that.regionOptionDate.city.id = result.data.city ? result.data.city : ''
			                    that.regionOptionDate.district.id = result.data.district ? result.data.district : ''
			                    that.regionOptionDate.street.id = ''
			                    that.regionOptionDate.regionSplic = result.data.region ? result.data.region : ''
							}
						})
					},
					cancel:function(res){
						console.log(JSON.stringify(res))
					}
				})
			}else{
				if(result){
					this.regionOptionDate = result;
				}
			}
		}
	},
	computed:{
		...mapState({
			addressInfo : state => state.user.addressInfo
		}),
		isAddress(){
			return this.$route.params.id ? true : false
		},
		regionSplic() {
			return this.regionOptionDate.regionSplic
	    },
	},
	methods:{
		addressInfoInt(id){
			this.$store.dispatch('userAddressInfo',{
				address_id:id
			}).then(res=>{
				if(res.data){
					this.consignee = res.data.consignee
					this.mobile = res.data.mobile
					this.address = res.data.address

					this.regionOptionDate.province.id = res.data.province
                    this.regionOptionDate.city.id = res.data.city
                    this.regionOptionDate.district.id = res.data.district
                    this.regionOptionDate.street.id = res.data.street
                    this.regionOptionDate.regionSplic = res.data.region
				}
			})
		},
		handelRegionShow(){
			this.regionShow = this.regionShow ? false : true
			this.$store.dispatch('setRegion',{
				region:1,
				level:1
			})
		},
		submitBtn(){
			let address_id = 0
			if(this.isAddress){
				address_id = this.$route.params.id
			}

			if(this.consignee == ''){
				Toast(this.$t('lang.consignee_not_null'))
				return false
			} 
			
			if(!this.checkMobile()){
				Toast(this.$t('lang.phone_number_format'))
				return false
			}

			if(this.address == ''){
				Toast(this.$t('lang.address_not_null'))
				return false
			}

			this.$store.dispatch('userAddressAdd',{
				address_id:address_id,
				consignee:this.consignee,
				mobile:this.mobile,
				address:this.address,
				country:1,
				province:this.regionOptionDate.province.id,
				city:this.regionOptionDate.city.id,
				district:this.regionOptionDate.district.id,
				street:this.regionOptionDate.street.id
			}).then(res => {
				if(res.status == 'success'){
					Toast.success({
						duration: 1000,
					  	message: this.$t('lang.save_success')
					})

					if(this.$route.query.routerLink){
						if(this.$route.query.entrance && this.$route.query.entrance == 'first'){
							if(this.$route.query.rec_type){
								if(this.$route.query.rec_type == 'supplier'){
									this.$router.push({
										name:this.$route.query.routerLink,
										query:{
											rec_type:this.$route.query.rec_type,
											rec_id:this.$route.query.rec_id,
										}
									})
								}else{
									this.$router.push({
										name:this.$route.query.routerLink,
										query:{
											rec_type:this.$route.query.rec_type,
											type_id:this.$route.query.type_id,
											team_id:this.$route.query.team_id
										}
									})
								}
							}else{
								if(this.$route.query.routerLink == 'crowdfunding-checkout'){
									this.$router.push({
										name:this.$route.query.routerLink,
										query:{
											pid:this.$route.query.pid,
											id:this.$route.query.id,
											number:this.$route.query.number,
										}
									})
								}else{
									this.$router.push({
										name:this.$route.query.routerLink,
									})
								}
							}
						}else{
							this.$router.push({
								name: 'address',
								query: this.$route.query
							})
						}
					}else{
						this.$router.push({name: 'address'});
					}
				}else{
					Toast({
						duration: 1000,
					  	message: this.$t('lang.save_fail')
					})
				}
			})
		},
	    checkMobile() {
	        let rule = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
	        if (rule.test(this.mobile)) {
	            return true
	        } else {
	            return false
	        }
	    },
	    shippingFee(val) {
	      this.$store.dispatch('setShippingFee', {
	          goods_id: 0,
	          position: val
	      })
	    },
	},
	watch:{
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

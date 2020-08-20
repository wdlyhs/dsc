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
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { Input } from 'element-ui'

import { 
	Popup,
	Picker,
	Toast,
} from 'vant'

import Region from '@/components/Region'

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
			email:'',
			address:''
		}
	},
	components:{
		Region,
		'EcInput':Input,
		[Popup.name]:Popup,
		[Picker.name]:Picker,
		[Toast.name]:Toast,
	},
	created(){
		let id = this.$route.params.id
		let result = JSON.parse(localStorage.getItem('regionOption'))
		if(result){
			this.regionOptionDate = result;
		}
	},
	computed:{
		regionSplic() {
			return this.regionOptionDate.regionSplic
	    },
	},
	methods:{
		handelRegionShow(){
			this.regionShow = this.regionShow ? false : true
			this.$store.dispatch('setRegion',{
				region:1,
				level:1
			})
		},
		submitBtn(){
			let that = this;
			if(this.consignee == ''){
				Toast(this.$t('lang.consignee_not_null'))
				return false
			} 
			
			if(!this.checkMobile()){
				Toast(this.$t('lang.phone_number_format'))
				return false
			}
			if(this.regionOptionDate.regionSplic == ''){
				Toast(this.$t('lang.fill_in_region'))
				return false
			}
			if(this.address == ''){
				Toast(this.$t('lang.address_not_null'))
				return false
			}

			let o = {
				goods_id: this.$route.params.id,
				consignee:this.consignee,
				mobile:this.mobile,
				country:1,
				province:this.regionOptionDate.province.id,
				city:this.regionOptionDate.city.id,
				district:this.regionOptionDate.district.id,
				street:this.regionOptionDate.street.id,
				address:this.address,
			}
			this.$http.get(`${window.ROOT_URL}api/v4/gift_gard/check_take`,{ params:o }).then(({data})=>{
				Toast(this.$t('lang.pick_success'));
				that.$http.get(`${window.ROOT_URL}api/v4/gift_gard/exit_gift`).then(({data})=>{
					if(data.data.error == 0){
						that.$router.push({name: 'giftCardOrder'})
					}
				})
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

<template>
	<van-popup v-model="display" position="bottom" @click-overlay="overlay" :close-on-click-overlay="false">
		<div class="mod-address-main">
			<div class="mod-address-head dis-box">
				<!-- <div class="mod-address-head-left box-flex"><i class="iconfont icon-back"></i>{{$t('lang.back')}}</div> -->
				<div class="mod-address-head-tit box-flex">{{$t('lang.delivery_to_the')}}</div>
				<div class="mod-address-head-right box-flex"><i class="iconfont icon-close" @click="onRegionClose"></i></div>
			</div>
			<div class="mod-address-body">
				<ul class="ulAddrTab">
					<li :class="{'cur':regionLevel-1 == 1}" v-if="regionOption.province.name" @click="tabClickRegion(1,1)">
						<span>{{ regionOption.province.name }}</span>
					</li>
					<li v-else>
						<span>{{$t('lang.select')}}</span>
					</li>
					<li :class="{'cur':regionLevel-1 == 2}" v-if="regionOption.city.name" @click="tabClickRegion(regionOption.province.id,2)"><span>{{ regionOption.city.name }}</span></li>
					<li :class="{'cur':regionLevel-1 == 3}" v-if="regionOption.district.name" @click="tabClickRegion(regionOption.city.id,3)"><span>{{ regionOption.district.name }}</span></li>
					<li :class="{'cur':regionLevel-1 == 4}" v-if="regionOption.street.name" @click="tabClickRegion(regionOption.district.id,4)"><span>{{ regionOption.street.name }}</span></li>
				</ul>

				<ul class="ulAddrList" v-if="regionLevel == 2">
					<li :class="{'active':regionOption.province.id == item.id}" v-for="(item,index) in regionDate.provinceData" :key="index" @click="childRegion(item.id,item.name,item.level)">{{ item.name }}</li>
				</ul>
				<ul class="ulAddrList" v-if="regionLevel == 3">
					<li :class="{'active':regionOption.city.id == item.id}" v-for="(item,index) in regionDate.cityDate" :key="index" @click="childRegion(item.id,item.name,item.level)">{{ item.name }}</li>
				</ul>
				<ul class="ulAddrList" v-if="regionLevel == 4">
					<li :class="{'active':regionOption.district.id == item.id}" v-for="(item,index) in regionDate.districtDate" :key="index" @click="childRegion(item.id,item.name,item.level)">{{ item.name }}</li>
				</ul>
				<ul class="ulAddrList" v-if="regionLevel == 5">
					<li :class="{'active':regionOption.street.id == item.id}" v-for="(item,index) in regionDate.streetDate" :key="index" @click="childRegion(item.id,item.name,item.level)">{{ item.name }}</li>
				</ul>
			</div>
		</div>
	</van-popup>
</template>

<script>
import { mapState } from 'vuex'

import {
  Popup
} from 'vant'

export default{
	props:['display','regionOptionDate','isPrice'],
	data(){
		return{
			regionOption : this.regionOptionDate
		}
	},
	components:{
		[Popup.name] : Popup
	},
	created(){
		this.$store.dispatch('setRegion',{
			region:1,
			level:1
		})

		let regionSession = localStorage.getItem('regionOption')
		let userRegion = JSON.parse(localStorage.getItem('userRegion')) //获取定位地址
		
		if(regionSession == null && userRegion !== null){
			this.regionOption.province = userRegion.province ? userRegion.province : ''
			this.regionOption.city = userRegion.city ? userRegion.city : ''
			this.regionOption.district = userRegion.district ? userRegion.district : ''
			this.regionOption.regionSplic = this.regionOption.province.name +' '+ this.regionOption.city.name +' '+ this.regionOption.district.name

			localStorage.setItem('regionOption',JSON.stringify(this.regionOption))
		}
	},
	computed:{
		regionId(){
			return this.$store.state.region.id
		},
		regionLevel(){
			return this.$store.state.region.level
		},
		regionDate(){
			return this.$store.state.region.data
		},
		status:{
			get(){
				return this.$store.state.region.status
			},
			set(val){
				this.$store.state.region.status = val
			}
		},
		isLogin(){
 			return localStorage.getItem('token') == null ? false : true
 		},
 		userRegion(){
 			return this.$store.state.userRegion
 		}
	},
	methods:{
		onRegionClose(){
			this.$emit('update:display',false)
		},
		childRegion(val,name,level){
			this.status = false

			switch(level){
				case 2:
					this.regionOption.province.id = val
					this.regionOption.province.name = name
					break
				case 3:
					this.regionOption.city.id = val
					this.regionOption.city.name = name
					break
				case 4:
					this.regionOption.district.id = val
					this.regionOption.district.name = name
					break
				case 5:
					this.regionOption.street.id = val
					this.regionOption.street.name = name
					break
				default:
					break
			}
			this.$store.dispatch('setRegion',{
				region:val,
				level:level
			})
		},
		tabClickRegion(val,level){
			let arr = ['province','city','district','street']

			arr.forEach((v,i)=>{
				if((i+1) > level){
					this.regionOption[v].id = ''
					this.regionOption[v].name = ''
				}
			})
			this.$store.dispatch('setRegion',{
				region:val,
				level:level
			})
		},
		overlay(){
			this.$emit('update:display',false)
		}
	},
	watch:{
		status(){
			if(this.status == true){
				this.regionOption.regionSplic = this.regionOption.province.name +' '+ this.regionOption.city.name +' '+ this.regionOption.district.name +' '+ this.regionOption.street.name

				localStorage.setItem('regionOption',JSON.stringify(this.regionOption))

				this.$emit('update:regionOptionDate',this.regionOption)
				this.$emit('update:display',false)
				this.$emit('update:isPrice',1)
			}
		},
		userRegion(){
			let regionSession = localStorage.getItem('regionOption')

			if(regionSession == null && this.userRegion){
				this.regionOption.province = this.userRegion.province ? this.userRegion.province : ''
				this.regionOption.city = this.userRegion.city ? this.userRegion.city : ''
				this.regionOption.district = this.userRegion.district ? this.userRegion.district : ''
				this.regionOption.regionSplic = this.regionOption.province.name +' '+ this.regionOption.city.name +' '+ this.regionOption.district.name

				localStorage.setItem('regionOption',JSON.stringify(this.regionOption))
			}
		}
	}
}
</script>
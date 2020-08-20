<template>
	<div class="address">
		<template v-if="isRouterlink">
		<div class="flow-consignee-list">
			<van-radio-group v-model="iSaddress">
		  		<van-cell-group v-for="(item,index) in addressList" :key="index">
				  	<section class="flow-checkout-adr">
				  		<div class="flow-have-adr" @click="checkoutRouter(item.id)">
				  			<div class="f-h-adr-title">
				  				<div class="box-flex">
				  					<label>{{ item.name }}</label>
				  				</div>
				  				<div class="box-flex">
				  					<label class="fr">{{ item.mobile }}</label>
				  				</div>
				  			</div>
				  			<p>{{ item.province_name }} {{ item.city_name }} {{item.district_name}} {{item.street_name}} {{item.address}}</p>
				  		</div>
			  			<van-cell class="flow-set-adr">
			  				<template slot="title">
			  					<van-radio :name="item.id" @click="checkoutRouter(item.id)">{{ $t('lang.default_address') }}</van-radio>
			  				</template>
			  				<a href="javascript:void(0);" @click="checkoutRouterEdit(item.id)"><i class="iconfont icon-bianji"></i>{{ $t('lang.edit') }}</a>
		  					<a href="javascript:void(0);" @click="userAddressDelete(item.id)"><i class="iconfont icon-delete"></i>{{ $t('lang.delete') }}</a>
			  			</van-cell>
				  	</section>
			  	</van-cell-group>
			</van-radio-group>
	  	</div>
	  	<div class="filter-btn">
		<a href="javascript:void(0)" class="btn btn-submit box-flex" @click="checkoutRouterAdd">{{ $t('lang.add_consignee_info') }}</a>
	  	</div>
	  	</template>
	 	<template v-else>
  		<div class="flow-consignee-list">
	  		<van-radio-group v-model="iSaddress">
		  		<van-cell-group v-for="(item,index) in addressList" :key="index">
				  	<section class="flow-checkout-adr">
				  		<div class="flow-have-adr">
				  			<div class="f-h-adr-title">
				  				<div class="box-flex">
				  					<label>{{ item.name }}</label>
				  				</div>
				  				<div class="box-flex">
				  					<label class="fr">{{ item.mobile }}</label>
				  				</div>
				  			</div>
				  			<p>{{ item.province_name }} {{ item.city_name }} {{item.district_name}} {{item.street_name}} {{item.address}}</p>
				  		</div>
			  			<van-cell class="flow-set-adr">
			  				<template slot="title">
			  					<van-radio :name="item.id">{{ $t('lang.default_address') }}</van-radio>
			  				</template>
			  				<router-link :to="{ name: 'editAddressForm', params: { id: item.id }}"><i class="iconfont icon-bianji"></i>{{ $t('lang.edit') }}</router-link>
		  					<a href="javascript:void(0);" @click="userAddressDelete(item.id)"><i class="iconfont icon-delete"></i>{{ $t('lang.delete') }}</a>
			  			</van-cell>
				  	</section>
				</van-cell-group>
		  	</van-radio-group>
	  	</div>
		<div class="filter-btn">
			<div class="btn btn-wximport" v-if="isWeiXin" @click="wxAddress">{{ $t('lang.import_wx_address') }}</div>
		  	<router-link :to="{name:'addAddressForm'}" class="btn btn-submit box-flex">{{ $t('lang.add_consignee_info') }}</router-link>
		</div>
		</template>
		<!-- 快捷菜单 -->
        <CommonNav></CommonNav>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import isApp from '@/mixins/is-app'

import CommonNav from '@/components/CommonNav'
 
import { 
	Radio,
	RadioGroup,
	Cell,
	CellGroup 
} from 'vant'

export default{
	mixins: [isApp],
	data(){
		return {
			defaultSel:0
		}
	},
	components:{ 
		[Cell.name]:Cell,
		[CellGroup.name]:CellGroup,
		[Radio.name]:Radio,
		[RadioGroup.name]:RadioGroup,
		CommonNav
	},
	created(){
		this.$store.dispatch('userAddress');
	},
	computed:{
		...mapState({
			addressList: state => state.user.addressList,
		}),
		iSaddress:{
			get(){
				return this.$store.state.user.addressId
			},
			set(value){
				this.$store.dispatch('userAddressDefault',{
					address_id:value
				})
			}
		},
		isRouterlink(){
			return this.$route.query.routerLink ? this.$route.query.routerLink : ''
		},
		isWeiXin(){
			return isApp.isWeixinBrowser()
	    }
	},
	methods:{
		userAddressDelete(value){
			this.$store.dispatch('userAddressDelete',{
				address_id:value
			})
		},
		checkoutRouterEdit(val){
			this.$router.push({
				name:'editAddressForm',
				params:{ id:val },
				query:this.$route.query
			})
		},
		checkoutRouterAdd(){
			this.$router.push({
				name:'addAddressForm',
				query:this.$route.query
			})
		},
		wxAddress(){
			this.$router.push({
				name:'addAddressForm',
				query:{
					wximport:true
				}
			})
		},
		checkoutRouter(id){
			this.iSaddress = id
			
			if(this.$route.query){
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
			}
		}
	}
}
</script>
<style scoped>
.filter-btn{ display: flex; }
.filter-btn .btn{ flex: 1; }
.filter-btn .btn-wximport{ color: #333;background-color: #fff; }
</style>
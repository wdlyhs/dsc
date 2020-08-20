<template>
	<div class="user-default">
		<header class="user-header-box" :class="{'user-drpshop': data.is_drp > 0 && (data.drp_shop.membership_status != 0 ? data.drp_shop.audit == 1 : true)}">
			<div class="user-header dis-box">
				<div class="header-img">
					<router-link :to="{ name: 'profile' }">
						<img :src="data.avatar" alt="" class="img" v-if="data.avatar">
						<img src="../../../assets/img/user_default.png" alt="" class="img" v-else>
					</router-link>
				</div>
				<div class="header-admin box-flex">
					<div class="header-admin-box dis-box">
						<h4 class="box-flex" v-if="data.name !=''">{{ data.name }}</h4>
						<h4 class="box-flex" v-else>{{ data.username }}</h4>
						<div class="header-icon">
							<router-link :to="{ name: 'message' }" class="message"><i class="iconfont icon-message"></i></router-link>
							<router-link :to="{ name: 'profile' }" class="set"><i class="iconfont icon-set"></i></router-link>
						</div>
					</div>
					<p>{{ data.user_rank }}</p>
				</div>
			</div>
			<div class="exclusive" v-if="data.is_drp > 0">
				<div class="left">
					<i class="icon_vip"><img src="../../../assets/img/newuser/icon-vip.png" class="img"></i>
					<span>{{$t('lang.high_grade_vip')}}</span>
				</div>
				<div class="center">{{$t('lang.shopping_saves_money_shares')}}</div>
				<div class="right" v-if="data.drp_shop.membership_status != 0 ? data.drp_shop.audit == 1 : true">
					<router-link :to="{ name: 'drp-info' }"><span>{{$t('lang.my_vip')}}</span><i class="iconfont icon-more"></i></router-link>
				</div>
				<div class="right" v-else>
					<router-link :to="{ name: 'drp-register' }"><span>{{$t('lang.immediately_opened')}}</span><i class="iconfont icon-more"></i></router-link>
				</div>
			</div>
		</header>

		<section class="user-function-list user-function-frist">
			<div class="user-item-title">
				<div class="dis-box padding-all wallet-bt">
					<h3 class="box-flex">{{$t('lang.my_wallet')}}</h3>
					<div class="user-more"><router-link :to="{name:'account'}" class="box-flex">{{$t('lang.account_manage')}}<i class="iconfont icon-more"></i></router-link></div>
				</div>
			</div>
			<ul class="user-item-list">
				<li>
					<router-link :to="{name:'account'}" class="box-flex">
						<h4 class="ellipsis-one">{{ data.user_money }}</h4>
						<p>{{$t('lang.money')}}</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{name:'bonus'}" class="box-flex">
						<h4 class="ellipsis-one">{{ data.bonus }}</h4>
						<p>{{$t('lang.bonus')}}</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{name:'account'}" class="box-flex">
						<h4 class="ellipsis-one">{{ data.pay_points }}</h4>
						<p>{{$t('lang.integral')}}</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{name:'userCoupon'}" class="box-flex">
						<h4 class="ellipsis-one">{{ data.coupons_num }}</h4>
						<p>{{$t('lang.coupons')}}</p>
					</router-link>
				</li>
			</ul>
		</section>

		<section class="user-function-list">
			<div class="user-item-title">
				<div class="dis-box padding-all wallet-bt">
					<h3 class="box-flex">{{$t('lang.my_order')}}</h3>
					<div class="user-more">
						<router-link :to="{name:'order'}" class="box-flex">{{$t('lang.all_order')}}<i class="iconfont icon-more"></i></router-link>
					</div>
				</div>
			</div>
			<ul class="user-item-list user-order-list">
				<li>
					<a href="javascript:;" class="box-flex" @click="orderLink(1)">
						<h4><i class="user-icon"><img src="../../../assets/img/newuser/order_icon_1.png" class="img"></i></h4>
						<p>{{$t('lang.order_status_01')}}</p>
						<div class="user-list-num" v-if="data.pay_count > 0">{{ data.pay_count }}</div>
					</a>
				</li>
				<template v-if="data.is_team > 0">
				<li>
					<router-link :to="{name:'team-order'}" class="box-flex">
						<h4><i class="user-icon"><img src="../../../assets/img/newuser/order_icon_2.png" class="img"></i></h4>
						<p>{{$t('lang.order_status_02')}}</p>
						<div class="user-list-num" v-if="data.team_num > 0">{{ data.team_num }}</div>
					</router-link>
				</li>
				</template>
				<li>
					<a href="javascript:;" class="box-flex" @click="orderLink(2)">
						<h4><i class="user-icon"><img src="../../../assets/img/newuser/order_icon_3.png" class="img"></i></h4>
						<p>{{$t('lang.order_status_03')}}</p>
						<div class="user-list-num" v-if="data.confirmed_count > 0">{{ data.confirmed_count }}</div>
					</a>
				</li>
				<li>
					<router-link :to="{name:'comment'}" class="box-flex">
						<h4><i class="user-icon"><img src="../../../assets/img/newuser/order_icon_4.png" class="img"></i></h4>
						<p>{{$t('lang.order_status_04')}}</p>
						<div class="user-list-num" v-if="data.not_comment > 0">{{ data.not_comment }}</div>
					</router-link>
				</li>
				<li>
					<router-link :to="{name:'refound'}" class="box-flex">
						<h4><i class="user-icon"><img src="../../../assets/img/newuser/order_icon_5.png" class="img"></i></h4>
						<p>{{$t('lang.order_status_05')}}</p>
						<div class="user-list-num" v-if="data.return_count > 0">{{ data.return_count }}</div>
					</router-link>
				</li>
			</ul>
		</section>

		<section class="user-function-list">
			<div class="user-item-title">
				<div class="dis-box padding-all wallet-bt">
					<h3 class="box-flex">{{$t('lang.all_tool')}}</h3>
				</div>
			</div>
			<div class="user-nav-item">
				<router-link :to="{name:'collectionGoods'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_1.png" class="img"></i></label>
					<p>{{$t('lang.collect_goods')}}</p>
				</router-link>
				<router-link :to="{name:'collectionShop'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_2.png" class="img"></i></label>
					<p>{{$t('lang.collect_shop')}}</p>
				</router-link>
				<template v-if="data.is_share > 0">
				<router-link :to="{name:'affiliate'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_3.png" class="img"></i></label>
					<p>{{$t('lang.my_share')}}</p>
				</router-link>
				</template>
				<router-link :to="{name:'history'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_8.png" class="img"></i></label>
					<p>{{$t('lang.history')}}</p>
				</router-link>
				<template v-if="data.is_drp > 0">
				<router-link :to="{name:'drp'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_4.png" class="img"></i></label>
					<p>{{$t('lang.my_drp')}}</p>
				</router-link>
				</template>
                <template v-if="data.is_crowdfunding > 0">
				<router-link :to="{name:'crowdfunding'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_5.png" class="img"></i></label>
					<p>{{$t('lang.my_crowdfunding')}}</p>
				</router-link>
                </template>
				<template v-if="data.is_team > 0">
				<router-link :to="{name:'team'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_6.png" class="img"></i></label>
					<p>{{$t('lang.my_team')}}</p>
				</router-link>
				</template>
                <template v-if="data.is_merchant_apply > 0">
				<a href="javascript:;" @click="merchantsChange">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_7.png" class="img"></i></label>
					<p>{{$t('lang.my_merchants')}}</p>
				</a>
                </template>
				<template v-if="data.is_bargain > 0">
				<router-link :to="{name:'bargain'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_9.png" class="img"></i></label>
					<p>{{$t('lang.my_bargain')}}</p>
				</router-link>
				</template>
                <template v-if="data.is_gift_card > 0">
				<router-link :to="{name:'giftCard'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_12.png" class="img"></i></label>
					<p>{{$t('lang.my_gift_card')}}</p>
				</router-link>
				<router-link :to="{name:'giftCardOrder'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_13.png" class="img"></i></label>
					<p>{{$t('lang.my_take')}}</p>
				</router-link>
                </template>
                <template v-if="data.is_auction > 0">
				<router-link :to="{name:'userAuction'}">
					<label><i class="user-icon"><img src="../../../assets/img/newuser/icon_14.png" class="img"></i></label>
					<p>{{$t('lang.my_auction')}}</p>
				</router-link>
                </template>
			</div>
		</section>

		<van-popup v-model="show" class="merchantsPopup">
			<div class="title">{{$t('lang.my_merchants')}}</div>
			<div class="content">
				<van-radio-group v-model="result">
					<van-radio name="0">{{$t('lang.merchants_store')}}</van-radio>
					<van-radio name="1">{{$t('lang.supplier_apply')}}</van-radio>
				</van-radio-group>
				<van-button type="danger" @click="onConfirm">{{$t('lang.confirm')}}</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
import {
	Radio,
  	RadioGroup,
	Popup,
	Button
} from 'vant'

export default{
	name:'user-default',
	props:['data'],
	data(){
		return{
			show:false,
			result:'0'
		}
	},
	components:{
		[Popup.name]:Popup,
		[Radio.name]: Radio,
    	[RadioGroup.name]: RadioGroup,
    	[Button.name]: Button,
	},
	methods:{
		orderLink(val){
			this.$router.push({
				name:'order',
				query:{
					tab:val
				}
			})
		},
		merchantsChange(){
			if(this.data.is_suppliers > 0){
				this.show = true;
			}else{
				this.$router.push({
					name:'merchants'
				})
			}
		},
		onConfirm(){
			if(this.result == 0){
				this.$router.push({
					name:'merchants'
				})
			}else{
				this.$router.push({
					name:'supplier-apply'
				})
			}
		}
	}
}
</script>
<style>
.merchantsPopup{
	width: 70%;
	border-radius: .5rem;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.merchantsPopup .title{
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	color: #000;
	font-size:20px;
	border-bottom: 1px solid #000000;
	padding: 0 0 2rem;
}
.merchantsPopup .content{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.merchantsPopup .van-radio-group{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 3rem 0;
}
.merchantsPopup .van-radio{
	margin-right: 10px;
}
.merchantsPopup .van-radio__input{
	font-size: 18px;
}
</style>

<template>
	<div class="drp-order drp-orderdetail">
		<div class="header color-white">
			<p class="f-03">{{$t('lang.get_commission')}}</p>
			<h4 v-html="drpOrderDetailData.money_format"></h4>
		</div>
		<div class="m-top10 drp-order-list">
			<div class="order-box bg-color-write ">
				<div class="order-header dis-box">
					<div class="box-flex">
						<span class="f-06 color-3">{{$t('lang.label_buyer')}}{{drpOrderDetailData.buy_user_name}}</span>
					</div>
					<div class="f-03 color-red">{{drpOrderDetailData.status==1?$t('lang.has_been_divide'):$t('lang.not_into')}}
					</div>
				</div>
			</div>
			<div class="order-box bg-color-write">
				<div class="order-cont color-7 f-03">
					<div class="order-num">
						<span>{{$t('lang.label_order')}}</span>{{drpOrderDetailData.order_sn}}
					</div>
					<div class="time">
						<span>{{drpOrderDetailData.add_time_format}}</span>
					</div>
				</div>
			</div>
			<div class="goods-li">
				<router-link :to="{name:'goods', params:{id:item.goods_id}}" class="show bg-color-write li" v-for='(item,index) in drpOrderDetailData.goods_list'
				    :key="index">
					<div class="left">
						<img v-if="item.goods_thumb" class="img" :src="item.goods_thumb" />
						<img v-else class="img" src="../../../../assets/img/not_goods.png" />
					</div>
					<div class="right">
						<h4 class="f-05 color-3 twolist-hidden">{{item.goods_name}}</h4>
						<div class="dis-box cont">
							<div class="f-06 color-red box-flex" v-html="item.goods_price_format"></div>
							<div class="f-03 color-7">×{{item.goods_number}}</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<CommonNav :routerName="routerName">
	         <li slot="aloneNav">
				<router-link :to="{name: 'drp'}">
					<i class="iconfont icon-fenxiao"></i>
					<p>{{$t('lang.drp_center')}}</p>
				</router-link>
			</li>
	    </CommonNav>
	</div>
</template>
<script>
	import {
		Toast
	} from 'vant'
	import { mapState } from 'vuex'
	import CommonNav from '@/components/CommonNav'
	export default {
		name: "drp-orderdetail",
		components: {
			CommonNav,
			[Toast.name]: Toast,
		},
		data() {
			return {
				routerName:'drp',
				//默认参数
				parameterData: {
					order_id: '',
				},
			};
		},
		computed: {
			...mapState({
				drpOrderDetailData: state => state.drp.drpOrderDetailData,
			})
		},
		mounted() {
			let that = this
			// 取到路由带过来的参数
			let orderId = that.$route.params.order_id;
			that.parameterData.order_id = orderId
			that.loading(that.$store.dispatch('setDrpOrderDetail', that.parameterData))
		},
		methods: {
			loading(url) {
				let that = this
				Toast.loading({
					duration: 500,
					mask: true,
					message: this.$t('lang.loading')
				}, url);
			}
		}
	};
</script>

<template>
	<div class="drp-order con_main" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="200">
		<!--订单-tabs-->
		<van-tabs :active="active">
			<van-tab>
				<div class="nav_active" slot="title" @click="tabNav(2)">{{$t('lang.all')}}</div>
			</van-tab>
			<van-tab>
				<div class="nav_active" slot="title" @click="tabNav(1)">{{$t('lang.has_been_divide')}}</div>
			</van-tab>
			<van-tab>
				<div class="nav_active" slot="title" @click="tabNav(0)">{{$t('lang.not_into')}}</div>
			</van-tab>
		</van-tabs>
		<!--状态-list-->
		<template v-if="drpOrderData!=''">
			<div class="m-top10 drp-order-list bg-color-write" v-for="(item,index) in drpOrderData" :key="index">
				<div class="order-box">
					<div class="order-header dis-box">
						<div class="box-flex f-06 color-3">{{$t('lang.label_buyer')}}{{item.buy_user_name}}</div>
						<div class="f-03 color-red">{{item.status==0?$t('lang.not_into'):$t('lang.has_been_divide')}}</div>
					</div>
				</div>
				<div class="f-03 color-7">
					<div class="order-box ">
						<div class="order-cont">

                            <template v-if="item.log_type == 0 || item.log_type == 2">
                                <div>{{$t('lang.label_order')}}
                                	<span class="color-3">{{item.order_sn}}</span>
                                </div>
                            </template>

							<div>{{item.add_time_format}}</div>
						</div>
					</div>

                    <template v-if="item.log_type == 0 || item.log_type == 2">
					<router-link :to="{name:'drp-orderdetail',params: { order_id: item.order_id }}" >
						<div class="dis-box goodslist" v-for="(item,index) in item.goods_list" :key='index'>
							<div class="left">
								<div class="img img-common">
									<img v-if="item.goods_thumb" class="img" :src="item.goods_thumb" />
									<img v-else class="img" src="../../../../assets/img/not_goods.png" />
								</div>
							</div>
							<div class="box-flex right color-3">
								<h4 class="twolist-hidden m-top02 f-05">{{item.goods_name}}</h4>
								<div class="dis-box m-top10 ">
									<p class="f-05 color-red box-flex" v-html="item.goods_price_format"></p>
									<div class="f-03 color-9">×{{item.goods_number}}</div>
								</div>
							</div>
						</div>
					</router-link>
                    </template>
                    <template v-else-if="item.log_type == 1">
                        <div class="dis-box goodslist" v-for="(item,index) in item.goods_list" :key='index'>
                        	<div class="left">
                        		<div class="img img-common">
                        			<img v-if="item.goods_thumb" class="img" :src="item.goods_thumb" />
                        			<img v-else class="img" src="../../../../assets/img/not_goods.png" />
                        		</div>
                        	</div>
                        	<div class="box-flex right color-3">
                        		<h4 class="twolist-hidden m-top02 f-05">{{item.goods_name}}</h4>
                        		<div class="dis-box m-top10 ">
                        			<p class="f-05 color-red box-flex" v-html="item.goods_price_format"></p>
                        			<div class="f-03 color-9">×{{item.goods_number}}</div>
                        		</div>
                        	</div>
                        </div>
                    </template>
					<div class="text-right padding-all "> {{$t('lang.label_dis_commission')}}
						<span class="color-red">{{item.level_per}}</span>，{{$t('lang.label_get_commission')}}
						<span class="color-red" v-html="item.money_format"></span>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<NotCont/>
		</template>
		<CommonNav :routerName="routerName">
	         <li slot="aloneNav">
				<router-link :to="{name: 'drp'}">
					<i class="iconfont icon-fenxiao"></i>
					<p>{{$t('lang.drp_center')}}</p>
				</router-link>
			</li>
	    </CommonNav>
		<template v-if="loading">
            <van-loading type="spinner" color="black" />
        </template>
	</div>
</template>
<script>
	import { mapState } from 'vuex'

	import {
		Toast,
		Tab,
		Tabs,
		Waterfall,
		Loading
	} from 'vant'

	import CommonNav from '@/components/CommonNav'
	import NotCont from '@/components/NotCont'
	import arrRemove from '@/mixins/arr-remove'

	export default {
		name: "drp-order",
		components: {
			CommonNav,
			NotCont,
			[Toast.name]: Toast,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Loading.name]: Loading,
		},
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		data() {
			return {
				routerName:'drp',
				active: 0,
				status:2,
				disabled:false,
				loading:true,
				size:10,
				page:1,
			};
		},
		created() {
			//初始化加载全部列表 status = 2
			this.orderList(this.status)
		},
		//运算，方法使用不用加()
		computed: {
			drpOrderData:{
				get(){
					return this.$store.state.drp.drpOrderData
				},
				set(val){
					this.$store.state.drp.drpOrderData = val
				}
			}
		},
		methods: {
			//定义列表数据方法
			orderList(status) {
				this.$store.dispatch({
					type: 'setDrpOrder',
					page: this.page,
					size: this.size,
					status: status
				})
			},
			loadMore(){
				setTimeout(() => {
					this.disabled = true
					if(this.page * this.size == this.drpOrderData.length){
						this.page ++
						this.orderList(this.status)
					}
				},200);
			},
			//状态切换
			tabNav(val) {
				this.status = val
				this.orderList(val)
			},
		},
		watch:{
			drpOrderData(){
				if(this.page * this.size == this.drpOrderData.length){
					this.disabled = false
					this.loading = true
				}else{
					this.loading = false
				}

				this.drpOrderData = arrRemove.trimSpace(this.drpOrderData)
			}
		}
	};
</script>

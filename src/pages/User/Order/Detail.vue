<template>
  <div class="con con_main">
  <div class="flow-checkout">
  	<section class="flow-checkout-item flow-checkout-adr">
	    <van-cell-group>
	    	<van-cell icon="location">
          <template v-if="orderDetail.offline_store">
            <div slot="title">
                <h2 class="f-h-adr-title">{{ orderDetail.offline_store.stores_name }}</h2>
                <p class="f-04 col-7 m-top02" v-if="orderDetail.pick_code">{{$t('lang.take_delivery_code')}}：{{ orderDetail.pick_code }}</p>
                <p class="f-04 col-7 m-top02">{{$t('lang.service_call')}}：{{ orderDetail.offline_store.stores_tel }}</p>
                <p class="f-04 col-7 m-top02">{{$t('lang.store_order_time')}}：{{ orderDetail.take_time }}</p>
                <p class="f-04 col-7 m-top02">{{$t('lang.business_hours')}}：{{ orderDetail.offline_store.stores_opening_hours }}</p>
            </div>
          </template>
          <template v-else>
  	    		<template slot="title">
  	    			<span>{{ orderDetail.consignee }} {{ orderDetail.mobile }}</span>
  	    			<label class="t-remark">{{ orderDetail.address }}</label>
  	    		</template>
          </template>
	    	</van-cell>
	    </van-cell-group>
	  </section>
    <section class="flow-checkout-item user-item">
    	<div class="item-hd">
    		<div class="head">
    			<h3>{{ orderDetail.shop_name }}</h3>
    			<span class="kefu"><a href="javascript:;" @click="onChat(0,orderDetail.shop_id)">{{ $t('lang.relation_contact') }} <i class="iconfont icon-kefu color-red"></i></a></span>
    		</div>
    	</div>
    	<div class="item-bd">
	    	<div class="subHead">
					<h4><label>{{$t('lang.order_sn')}}：</label><span>{{ orderDetail.order_sn }}</span></h4>
					<p>
						<span>{{$t('lang.order_time')}}：{{ orderDetail.add_time }} </span>
						<template v-if="orderDetail.failure == 1">
							<em class="em-promotion b-tag">{{$t('lang.team_fail')}}</em>
						</template>
						<template v-else>
							<em class="em-promotion b-tag" v-if="orderDetail.team_id > 0">{{$t('lang.team_order')}}</em>
						</template>
						<em class="em-promotion b-tag" v-if="orderDetail.extension_code == 'bargain_buy'">{{ $t('lang.bargain_order') }}</em>
					</p>
				</div>
	    	<template v-if="!listShow">
	  			<div class="list-bd-box list-order-box dis-box">
            <div class="box-flex">
  	  				<div class="goods-item" v-for="(goodsItem,goodsIndex) in orderDetail.goods" :key="goodsIndex">
  							<div class="dis-box" :class="{'package-box':goodsItem.extension_code == 'package_buy'}">
                  <div class="reture-left-img" @click="productLink(goodsItem)">
                    <div class="img-box">
                      <img :src="goodsItem.goods_thumb" class="img" v-if="goodsItem.goods_thumb">
                      <img class="img" src="../../../assets/img/no_image.jpg" v-else>
                      <em class="activity-tag" v-if="goodsItem.is_gift"><img src="../../../assets/img/gift-icon.png" class="img" /></em>
                      <em class="activity-tag" v-if="goodsItem.parent_id"><img src="../../../assets/img/parts-icon.png" class="img" /></em>
                      <em class="activity-tag" v-if="goodsItem.extension_code == 'package_buy'"><img src="../../../assets/img/package.png" class="img" /></em>
                    </div>
                  </div>
    							<div class="reture-right-cont" @click="productLink(goodsItem)">
    								<h4 class="twolist-hidden">
                      <span class="color-red" v-if="goodsItem.extension_code == 'package_buy'">[{{$t('lang.package_box')}}]</span>{{ goodsItem.goods_name }}
                    </h4>
                    <template v-if="goodsItem.extension_code == 'package_buy'">
    								<div class="price m-top04">
                      <div class="color-red fl">{{$t('lang.label_package_price')}}{{goodsItem.goods_price_formated}}</div>
                      <span class="fr">x{{goodsItem.package_goods_list.length}}</span>
                    </div>
                    <div class="p-attr">{{$t('lang.is_discount')}}{{ goodsItem.format_package_list_saving }}</div>
                    </template>
                    <template v-else>
                    <div class="price m-top04">
                      <div class="color-red fl">{{goodsItem.goods_price_formated}}</div>
                      <span class="fr">x{{goodsItem.goods_number}}</span>
                    </div>
                    <div class="p-attr" v-if="goodsItem.goods_attr">{{ goodsItem.goods_attr }}</div>
                    </template>
                    <div class="p-virtual" v-if="goodsItem.virtual_goods && goodsItem.virtual_goods.length > 0">
                      <div v-for="virtualItem in goodsItem.virtual_goods">
                        <div class="virtual-item">{{$t('lang.virtual_card_number')}}：{{virtualItem.card_sn}}</div>
                        <div class="virtual-item">{{$t('lang.virtual_card_pwd')}}：{{virtualItem.card_password}}</div>
                      </div>
                    </div>
    							</div>
                  <div class="t-jiantou t-jantou-xia" style="margin-top: 0;" @click="onListPackage" v-if="goodsItem.extension_code == 'package_buy'">
                    <span class="user-more">
                      <i class="iconfont" :class="[listPackageShow ? 'icon-moreunfold' :'icon-more']"></i>
                    </span>
                  </div>
                </div>
                <template v-if="goodsItem.extension_code == 'package_buy' && listPackageShow">
                  <div class="dis-box package-list" v-for="packageItem in goodsItem.package_goods_list">
                    <div class="reture-left-img">
                      <div class="img-box">
                        <img :src="packageItem.goods_thumb" class="img" v-if="packageItem.goods_thumb">
                        <img class="img" src="../../../assets/img/no_image.jpg" v-else>
                      </div>
                    </div>
                    <div class="reture-right-cont">
                      <h4 class="twolist-hidden">{{ packageItem.goods_name }}</h4>
                        <div class="price m-top04">
                        <div  class="color-red fl">{{packageItem.rank_price_format}}</div>
                        <span class="fr">x{{packageItem.goods_number}}</span>
                      </div>
                    </div>
                  </div>
                </template>
  						</div>
            </div>
            <div class="t-jiantou t-jantou-xia" @click="onListShow" v-if="length > 1">
              <span class="user-more">
                <i class="iconfont icon-moreunfold"></i>
              </span>
            </div>
	  			</div>
        </template>
        <template v-else>
          <div class="list-bd-box dis-box">
            <ul class="box-flex">
              <li class="reture-left-img fl" v-for="(goodsItem,goodsIndex) in orderDetail.goods" :key="goodsIndex">
                <router-link :to="{name:'goods',params:{id:goodsItem.goods_id}}">
                  <div class="img-box">
                    <img :src="goodsItem.goods_thumb" class="img" v-if="goodsItem.goods_thumb">
                    <img class="img" src="../../../assets/img/no_image.jpg" v-else>
                    <em class="activity-tag" v-if="goodsItem.is_gift"><img src="../../../assets/img/gift-icon.png" class="img" /></em>
                    <em class="activity-tag" v-if="goodsItem.parent_id"><img src="../../../assets/img/parts-icon.png" class="img" /></em>
                  </div>
                </router-link>
              </li>
            </ul>
            <div class="align-items" @click="onListShow"><span class="user-more"><em>{{$t('lang.gong')}}{{ length }} {{$t('lang.kuan')}}</em><i class="iconfont icon-more"></i></span></div>
          </div>
        </template>
	    </div>
    </section>
    <section class="flow-checkout-item m-top10" v-if="orderDetail.shipping_id && !orderDetail.offline_store">
    	<ul>
    		<li>
    			<section class="dis-box padding-all">
    				<label class="t-remark g-t-temark">{{$t('lang.shipping_mode')}}</label>
    				<div class="box-flex text-right f-04">
    					<span>{{ orderDetail.shipping_name }}</span>&nbsp;
    					<em class="color-red">{{ orderDetail.shipping_fee_formated }}</em>
    				</div>
    			</section>
    		</li>
        <li class="padding-all border-t-common" v-if="orderDetail.postscript && !orderDetail.main_count > 0">
          <div class="box-flex t-remark">
            <p>{{$t('lang.buyer_message')}}：{{ orderDetail.postscript }}</p>
          </div>
        </li>
    	</ul>
    </section>
    <section class="flow-checkout-item m-top10">
    	<ul>
    		<li class="dis-box padding-all">
  				<label class="t-remark g-t-temark">{{$t('lang.payment_mode')}}</label>
  				<div class="box-flex text-right f-04">
  					<span>{{ orderDetail.pay_name }}</span>
  				</div>
    		</li>
        <li class="dis-box padding-all border-t-common" v-if="orderDetail.pay_effective_time">
          <label class="t-remark g-t-temark">{{$t('lang.payment_time')}}</label>
          <div class="box-flex text-right f-04">
            <span class="color-red"><count-down :endTime="orderDetail.pay_effective_time" :endText="$t('lang.activity_end')"></count-down></span>
          </div>
        </li>
    		<li class="padding-all border-t-common" v-if="orderDetail.exchange_goods == 0">
    			<div class="dis-box">
	  				<label class="t-remark g-t-temark">{{$t('lang.invoice_info')}}</label>
	  			</div>
	  			<div class="box-flex t-remark m-top08">
            <template v-if="!orderDetail.cross_border">
              <template v-if="orderDetail.invoice_type == 1">
                <p>{{$t('lang.label_invoice_content')}}{{$t('lang.vat_invoice')}}</p>
              </template>
              <template v-if="orderDetail.invoice_type == 0">
                  <p>{{$t('lang.label_invoice_type')}}{{$t('lang.plain_invoice')}}</p>
                  <p>{{$t('lang.label_invoice_company')}}{{ orderDetail.inv_payee }}</p>
                  <p>{{$t('lang.label_invoice_content')}}{{ orderDetail.inv_content }}</p>
              </template>
            </template>
	  			</div>
    		</li>
    		<li class="padding-all border-t-common" v-if="orderDetail.bonus_id > 0">
    			<div class="dis-box">
    				<label class="t-remark g-t-temark">{{$t('lang.bonus')}}</label>
    				<div class="box-flex text-right f-04">
    					<span>{{$t('lang.bonus_amount')}}</span>
    					<em class="color-red"> {{ orderDetail.bonus }}</em>
    				</div>
    			</div>
    		</li>
    		<li class="padding-all border-t-common" v-if="orderDetail.coupons_type > 0">
    			<div class="dis-box">
    				<label class="t-remark g-t-temark">{{$t('lang.coupons')}}</label>
    				<div class="box-flex text-right f-04">
    					<span>{{$t('lang.coupon_amount')}}</span>
    					<em class="color-red"> {{ orderDetail.coupons }}</em>
    				</div>
    			</div>
    		</li>
    		<li class="padding-all border-t-common" v-if="orderDetail.vc_id > 0">
    			<div class="dis-box">
    				<label class="t-remark g-t-temark">{{$t('lang.value_card')}}</label>
    				<div class="box-flex text-right f-04">
    					<span>{{$t('lang.value_card_amount')}}</span>
    					<em class="color-red"> {{ orderDetail.card_amount }}</em>
    				</div>
    			</div>
    		</li>
  			<li class="padding-all border-t-common" v-if="orderDetail.integral > 0 && orderDetail.exchange_goods == 0">
  				<div class="dis-box">
  					<label class="t-remark g-t-temark">{{$t('lang.integral')}}</label>
  					<div class="box-flex text-right f-04">
  						<span>{{$t('lang.integral_deduction_amout')}}</span>
  						<em class="color-red"> {{ orderDetail.integral_money }}</em>
  					</div>
  				</div>
  			</li>
    	</ul>
    </section>
    <section class="flow-checkout-item m-top10">
    	<van-cell-group>
	    	<van-cell :title="$t('lang.goods_amout')" class="van-cell-title b-min b-min-b">
			  	<div>
                    <em class="color-red">
                    <template v-if="orderDetail.extension_code == 'group_buy' && orderDetail.is_group_deposit == 1">{{$t('lang.label_group_deposit')}}</template>
                    {{ orderDetail.goods_amount_formated }}
                    </em>
			  	</div>
			  </van-cell>
	    	<van-cell>
	    		<template slot="title">
	    			<ul>
	    				<li class="of-hidden" v-if="discount > 0">
	    					<label class="t-remark g-t-temark fl">{{$t('lang.goods_favorable')}}</label>
	    					<span class="color-red fr">-{{ orderDetail.discount_formated }}</span>
	    				</li>
	    				<li class="of-hidden m-top10" v-if="!orderDetail.offline_store">
	    					<label class="t-remark g-t-temark fl">{{$t('lang.shipping_fee')}}</label>
	    					<span class="color-red fr">+{{ orderDetail.shipping_fee_formated }}</span>
	    				</li>
              <li class="of-hidden m-top10" v-if="orderDetail.rate_fee > 0">
                  <label class="t-remark g-t-temark fl">{{$t('lang.comprehensive_tax')}}</label>
                  <span class="color-red fr">+{{ orderDetail.rate }}</span>
              </li>
              <template v-if="orderDetail.membership_card_id && orderDetail.membership_card_id > 0">
              <li class="of-hidden m-top10">
                  <label class="t-remark g-t-temark fl">{{$t('lang.membership_card_buy_money')}}</label>
                  <span class="color-red fr">+{{ orderDetail.membership_card_buy_money_formated }}</span>
              </li>
              <li class="of-hidden m-top10">
                  <label class="t-remark g-t-temark fl">{{$t('lang.membership_card_discount_price')}}</label>
                  <span class="color-red fr">-{{ orderDetail.membership_card_discount_price_formated }}</span>
              </li>
              </template>
	    				<li class="of-hidden m-top10" v-if="orderDetail.bonus_id > 0">
	    					<label class="t-remark g-t-temark fl">{{$t('lang.use_bonus')}}</label>
	    					<span class="color-red fr">-{{ orderDetail.bonus }}</span>
	    				</li>
	    				<li class="of-hidden m-top10" v-if="orderDetail.coupons_type > 0">
	    					<label class="t-remark g-t-temark fl">{{$t('lang.use_coupons')}}</label>
	    					<span class="color-red fr">-{{ orderDetail.coupons }}</span>
	    				</li>
	    				<li class="of-hidden m-top10" v-if="orderDetail.vc_id > 0">
	    					<label class="t-remark g-t-temark fl">{{$t('lang.use_value_card')}}</label>
	    					<span class="color-red fr">-{{ orderDetail.card_amount }}</span>
	    				</li>
						<li class="of-hidden m-top10" v-if="orderDetail.integral > 0">
							<label class="t-remark g-t-temark fl">{{$t('lang.use_integral')}}</label>
							<span class="color-red fr">-{{ orderDetail.integral  }}</span>
						</li>
						<li class="of-hidden m-top10" v-if="orderDetail.surplus > 0">
							<label class="t-remark g-t-temark fl">{{$t('lang.use_balance')}}<template v-if="orderDetail.presale_final_pay">({{$t('lang.pay_in_advance')}})</template></label>
							<span class="color-red fr">-{{ orderDetail.surplus_formated  }}</span>
						</li>
            <li class="of-hidden m-top10" v-if="orderDetail.money_paid > 0">
              <label class="t-remark g-t-temark fl">{{$t('lang.pay_in_balance')}}</label>
              <span class="color-red fr">-{{ orderDetail.money_paid_formated  }}</span>
            </li>
	    			</ul>
	    		</template>
	    	</van-cell>
	    </van-cell-group>
    </section>
    <van-cell-group class="m-top10" v-if="orderDetail.delay === 1">
      <van-cell class="van-cell-title b-min b-min-b">
        <div slot="title" class="lh28">{{$t('lang.delay_in_receiving')}}</div>
        <template v-if="orderDetail.delay_type == '申请'">
          <van-button size="small" type="primary" @click="delayOrder(orderDetail.order_id)">{{ orderDetail.delay_type }}</van-button>
        </template>
        <template v-else>
          <span class="lh28 color-red">{{ orderDetail.delay_type }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <section :class="{'order-detail-submit': orderDetail.handler}">
      <div class="van-submit-bar van-order-submit-bar" :class="{'van-submit-bar-w100':(!orderDetail.tracker && orderDetail.handler != 6 && orderDetail.handler != 8) && (orderDetail.pay_code == 'cod' ? true : !totalAmountInt > 0)}">
        <div class="van-submit-bar__bar">
          <div class="van-submit-bar__text van-submit-bar__text_left">
            <span>{{$t('lang.total_amount_payable')}}：</span>
            <span class="van-submit-bar__price">{{ amountPrice }}</span>
          </div>
          <!--是否是预售订单付款-->
          <template v-if="orderDetail.presale_final_pay >= 0">
            <template v-if="orderDetail.presale_final_pay == 0">
            <van-button type="danger" size="large" v-if="orderDetail.total_amount > 0 && orderDetail.handler != 7 && orderDetail.handler != 8" class="van-button--disabled" disabled>{{ buttonText }}</van-button>
            </template>
            <template v-else>
              <van-button type="danger" size="large" v-if="orderDetail.total_amount > 0 && orderDetail.handler != 7 && orderDetail.handler != 8" @click="onlinepay(orderDetail.order_sn,orderDetail.presale_final_pay)">{{ buttonText }}</van-button>
            </template>
          </template>
          <template v-else>
            <template v-if="orderDetail.pay_code != 'cod'">
            <van-button type="danger" size="large" v-if="orderDetail.total_amount > 0 && orderDetail.handler != 7 && orderDetail.handler != 8 && orderDetail.failure == 0" @click="onlinepay(orderDetail.order_sn)">{{ buttonText }}</van-button>
            </template>
          </template>
          <template v-if="orderDetail.handler == 2">
            <van-button type="danger" size="large" :text="$t('lang.received')" @click="receivedOrder(orderDetail.order_id)" />
          </template>
          <template v-if="orderDetail.handler == 4">
            <van-goods-action-big-btn :text="$t('lang.ss_received')" primary />
          </template>
        </div>
      </div>
  		<van-goods-action v-if="orderDetail.handler || orderDetail.handler != 2 || !orderDetail.tracker">
        <template v-if="orderDetail.handler == 1">
          <van-goods-action-big-btn :text="$t('lang.cancel_order')" @click="onClickBigBtn"/>
        </template>
        <template v-if="orderDetail.handler == 3">
          <van-goods-action-big-btn :text="$t('lang.evaluation_list')" @click="onCommentBtn(orderDetail.order_id)" primary />
        </template>
        <template v-if="orderDetail.handler == 5">
          <van-goods-action-big-btn :text="$t('lang.payment')" primary />
        </template>
        <template v-if="orderDetail.handler == 6 && !orderDetail.tracker">
          <van-goods-action-big-btn :text="$t('lang.confirmed')" primary />
        </template>
        <template v-if="orderDetail.handler == 7">
          <van-goods-action-big-btn :text="$t('lang.canceled')" primary />
        </template>
        <template v-if="orderDetail.handler == 8">
          <van-goods-action-big-btn :text="$t('lang.invalid_order')" primary />
        </template>
        <template v-if="orderDetail.tracker">
          <div class="btn-invoice_no">
            <a :href="orderDetail.tracker">{{$t('lang.order_tracking')}}</a>
          </div>
        </template>
			</van-goods-action>
    </section>
    <CommonNav></CommonNav>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
	Cell,
	CellGroup,
	SubmitBar,
	GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Toast,
  Button
} from 'vant'

import ProductList from '@/components/user/ProductList'
import CommonNav from '@/components/CommonNav'
import formProcessing from '@/mixins/form-processing'
import CountDown from '@/components/CountDown'

export default{
  mixins: [formProcessing],
	data(){
		return {
			loading:true,
			length:0,
			buttonText:this.$t('lang.immediate_payment'),
      listPackageShow:false
		}
	},
	components:{
		[Cell.name] : Cell,
		[CellGroup.name] : CellGroup,
		[SubmitBar.name] : SubmitBar,
		[GoodsAction.name] : GoodsAction,
		[GoodsActionBigBtn.name] : GoodsActionBigBtn,
		[GoodsActionMiniBtn.name] : GoodsActionMiniBtn,
    [Button.name]: Button,
		ProductList,
    CommonNav,
    CountDown
	},
	created(){
		this.onLoad()
	},
	computed:{
		...mapState({
			orderDetail: state => state.user.userOrderDetail
		}),
		goods(){
    	return this.orderDetail.goods
    },
    discount(){
    	return Number(this.orderDetail.discount)
    },
    amountPrice(){
    	let price = 0
    	if(this.orderDetail.total_amount){
    		price = this.orderDetail.total_amount ? this.orderDetail.total_amount : this.orderDetail.goods_amount
    	}

    	return '¥' + price
    },
    totalAmountInt(){
      return Number(this.orderDetail.total_amount)
    },
    listShow:{
        get(){
          return this.$store.state.user.listShow
        },
        set(val){
          this.$store.state.user.listShow = val
        }
    },
    pay_code(){
      return this.orderDetail.pay_code ? this.orderDetail.pay_code : 'balance'
    }
	},
	methods:{
    onLoad(){
      this.$store.dispatch('setOrderDetail',{
        order_id:this.$route.params.id
      })
    },
		onSubmit(){
      this.$router.push({
        name:'done',
        query:{
          order_sn:this.orderDetail.order_sn
        }
      })
		},
		onClickBigBtn(){
			this.$store.dispatch('setOrderHandler',{
        order_id:this.$route.params.id
      }).then(res=>{
        if(res.data == true){
        	Toast(this.$t('lang.order_cancel'))
          this.onLoad()
        }
      })
		},
    //延迟收货
    delayOrder(id){
      this.$store.dispatch('setDelayOrder',{
        order_id:id
      }).then(res=>{
        Toast(res.data.msg)
        if(res.data.error == 0){
          this.onLoad()
        }
      })
    },
    //晒单评论
    onCommentBtn(id){
      this.router.push({
        name:'commentDetail',
        params:{
          id:id
        }
      })
    },
    //确认收货
    receivedOrder(id){
      this.$store.dispatch('setReceivedOrder',{
        order_id:id
      }).then(res=>{
        if(res.data == true){
          Toast(this.$t('lang.order_confirm_receipt'))
          this.onLoad()
        }
      })
    },
    //立即支付
    onlinepay(id,pay){
      if(this.pay_code == 'balance'){
        this.$router.push({
            name:'done',
            query:{
              order_sn:id,
              pay_code:'balance'
            }
        })
      }else{
        if(pay){
          this.$router.push({
            name:'done',
            query:{
              order_sn:id,
              presale_final_pay:pay
            }
          })
        }else{
          this.$router.push({
            name:'done',
            query:{
              order_sn:id
            }
          })
        }
      }
    },
    onListShow(){
      this.listShow = this.listShow ? false : true
    },
    onListPackage(){
      this.listPackageShow = this.listPackageShow ? false : true
    },
    productLink(item){
      if(item.extension_code == 'package_buy'){
        this.$router.push({
          name:'package'
        })
      }else{
        this.$router.push({
          name:'goods',
          params:{
            id:item.goods_id
          }
        })
      }
    }
	},
	watch:{
		goods(){
			this.length = this.goods.length
		}
	}
}
</script>
<style scoped>
.goods-item .dis-box{ margin-bottom: 1rem; }
.goods-item .package-box,
.goods-item .package-list{ padding-bottom: .5rem; border-bottom: 1px solid #f0f0f0; }
.goods-item .dis-box:last-child{ margin-bottom: 0; border-bottom: 0; padding-bottom: 0; }
</style>

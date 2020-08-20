<template>
	<div class="vip-apply">
		<div class="img"><img src="../../../../assets/img/vip/apply-img-1.jpg" alt=""></div>
		<div class="img"><img src="../../../../assets/img/vip/apply-img-2.jpg" alt=""></div>
		<div class="img"><img src="../../../../assets/img/vip/apply-img-3.png" alt=""></div>
		<div class="img title-how"><img src="../../../../assets/img/vip/title-how.png" alt=""></div>
		<div v-for="(channel,index) in apply_channel" :key="index">
			<template v-if="channel.receive_type== 'integral'">
			<div class="apply-box">
				<div class="title">0{{index+1}}.{{$t('lang.drp_apply_title_1')}}</div>
				<div class="body">
					<div class="text">{{$t('lang.drp_apply_info_1_1')}}<span class="number">{{channel.content.buy_pay_point}}</span>{{$t('lang.drp_apply_info_1_2')}}</div>
					<div class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">{{$t('lang.drp_apply_ing')}}</div>
					<div class="v-btn" v-else :data-type="channel.receive_type" :data-number="channel.content.user_pay_point" @click="clickSubmit">{{$t('lang.drp_apply_btn_1')}}</div>
				</div>
			</div>
			</template>
			<template v-if="channel.receive_type=='order'">
			<div class="apply-box">
				<div class="title">0{{index+1}}.{{$t('lang.drp_apply_title_2')}}</div>
				<div class="body">
					<div class="text">{{$t('lang.drp_apply_info_2_1')}}<span class="number">{{channel.content.buy_money}}</span>{{$t('lang.drp_apply_info_2_2')}}</div>
					<div class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">{{$t('lang.drp_apply_ing')}}</div>
					<div class="v-btn" v-else :data-type="channel.receive_type" :data-number="channel.content.user_order_money" @click="clickSubmit">{{$t('lang.drp_apply_btn_1')}}</div>
				</div>
			</div>
			</template>
			<template v-if="channel.receive_type == 'buy'">
			<div class="apply-box">
				<div class="title">0{{index+1}}.{{$t('lang.drp_apply_title_3')}}</div>
				<div class="body">
					<div class="text">{{$t('lang.drp_apply_info_3_1')}}<span class="number">{{channel.content.price}}</span>{{$t('lang.drp_apply_info_3_2')}}</div>
					<div class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">{{$t('lang.drp_apply_ing')}}</div>
					<div class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">{{$t('lang.drp_apply_btn_2')}}</div>
				</div>
			</div>
			</template>
			<template v-if="channel.receive_type=='goods'">
			<div class="apply-box">
				<div class="title title-big">0{{index+1}}.{{$t('lang.drp_apply_title_4')}}</div>
				<div class="body">
					<div class="text">{{$t('lang.drp_apply_info_4_1')}}</div>
					<div class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">{{$t('lang.drp_apply_ing')}}</div>
					<div class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">{{$t('lang.drp_apply_btn_1')}}</div>
				</div>
			</div>
			</template>
            <template v-if="channel.receive_type == 'free'">
            <div class="apply-box">
            	<div class="title title-big">0{{index+1}}.{{$t('lang.drp_apply_title_5')}}</div>
            	<div class="body">
            		<div class="text">{{$t('lang.drp_apply_info_5_1')}}</div>
            		<div class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">{{$t('lang.drp_apply_ing')}}</div>
            		<div class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">{{$t('lang.drp_apply_btn_1')}}</div>
            	</div>
            </div>
            </template>
		</div>

		<CommonNav></CommonNav>

		<van-popup v-model="applyPopupShow" class="vip-popup">
			<!-- <div class="p-close" @click='closePopup'><van-icon name="clear" /></div> -->
			<div class="p-content">
				<div class="p-icon" v-if="popupStep == 2 || popupStep == 3">
					<div class="loader04" v-if="popupStep == 2"></div>
					<div class="p-icon-success" v-if="popupStep == 3"></div>
				</div>
				<p v-html="validMsg"></p>
				<p v-html="validNumber" v-if="validNumber.length > 0" class="number"></p>
				<p v-html="validTip" v-if="validTip.length > 0" :class="{'green': formValid, 'red': !formValid}"></p>
			</div>
			<div class="p-handler">
				<template v-if="popupStep == 1">
				<div class="v-btn" @click='submit' v-if="formValid">{{$t('lang.submit_apply')}}</div>
				<div class="v-btn" @click='closePopup' v-else>{{$t('lang.close_window')}}</div>
				</template>
				<template v-if="popupStep == 2">
				<div class="v-btn disabled">{{$t('lang.drp_apply_padding')}}</div>
				</template>
				<template v-if="popupStep == 3">
				<div class="v-btn" @click='closePopup'>{{$t('lang.close_window')}}</div>
				</template>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import qs from 'qs'
	import { mapState } from 'vuex'
	import CommonNav from '@/components/CommonNav'
	import {
		Field,
		Button,
		Toast,
		Popup,
		Icon,
		Dialog,
	} from 'vant'
	export default {
		name: "drp-register",
		components: {
			[Field.name]: Field,
			[Button.name]: Button,
			[Toast.name]: Toast,
			[Popup.name]: Popup,
			[Icon.name]: Icon,
			[Dialog.name]: Dialog,
			CommonNav
		},
		data() {
			return {
				registerCont: '',
				apply_channel: '',
				goodsHasBuy: false,
				back:this.$route.query.back,
				applyPopupShow: false,
				formValid: true,
				validMsg: '',
				validNumber: '',
				validTip: '',
				popupStep: 1,
				applySuccess: false,
				type: '',
				buy_pay_point:0,
				user_pay_point:0,
				buy_money:0,
				user_order_money:0
			};
		},
		computed: {
			...mapState({
				status: state => state.drp.status,
				error: state => state.drp.error
			}),
			isLogin(){
  			  return localStorage.getItem('token') == null ? false : true
  			}
		},
		mounted() {
			//事件初始化加载
			Toast.loading({
				duration: 500,
				mask: true,
				message: this.$t('lang.loading')
			});

			this.application()

			// if (window.history && window.history.pushState && this.back) {
   //              // 向历史记录中插入了当前页
   //              history.pushState(null, null, document.URL);
   //              window.addEventListener('popstate', this.goBack, false);
   //          }
		},
		methods: {
			goBack(){
                this.$router.replace({
                    path: this.back
                })
            },
			application(){
				let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null
                // 重新领取
                let membership_card_id_repeat = this.$route.query.membership_card_id_repeat ? this.$route.query.membership_card_id_repeat : null

                let o = {
                    shop_id : this.$route.query.shop_id ? this.$route.query.shop_id : 0,
                    parent_id: parent_id,
                }

                if (membership_card_id_repeat) {
                    o = {
                        shop_id : this.$route.query.shop_id ? this.$route.query.shop_id : 0,
                        parent_id: parent_id,
                        membership_card_id_repeat:membership_card_id_repeat
                    }
                }

                this.$http.post(`${window.ROOT_URL}api/v4/drp/application`, qs.stringify(o)).then(({data:data})=>{
					if(data.data.shop_info){
						this.$router.push({
							name:'drp-info'
						})
					}else{
						this.registerCont = data.data.notice
						// 分销申请方式
						this.apply_channel = data.data.apply_channel
						// 判断是否已购买商品
						for (var i = this.apply_channel.length - 1; i >= 0; i--) {
							if(this.apply_channel[i].receive_type == 'goods'){
								if(this.apply_channel[i].content.goods_list){
									for(var j = this.apply_channel[i].content.goods_list.length - 1; j>=0; j--){
										if(this.apply_channel[i].content.goods_list[j].is_buy == 1){
											this.goodsHasBuy = true
											break;
										}
									}
								}
							}
						}
					}
				})
			},
			closePopup(){
				this.applyPopupShow = false;
			},
			clickSubmit(e){
				if(!this.isLogin){
					let msg = this.$t('lang.login_user_not')
					this.notLogin(msg);
					return false;
				}

				if(this.applySuccess){
					return false;
				}
		    	this.type = e.currentTarget.dataset.type;
		    	for(let i = 0; i < this.apply_channel.length; i++){
		    		if(this.apply_channel[i].receive_type == 'order'){
		    			this.buy_money = this.apply_channel[i].content.buy_money
		    			this.user_order_money = this.apply_channel[i].content.user_order_money
		    		}
		    		if(this.apply_channel[i].receive_type == 'integral'){
		    			this.buy_pay_point = this.apply_channel[i].content.buy_pay_point
		    			this.user_pay_point = this.apply_channel[i].content.user_pay_point
		    		}
		    	}

                // 重新领取
                let membership_card_id_repeat = this.$route.query.membership_card_id_repeat ? this.$route.query.membership_card_id_repeat : null

                let o = {
                    receive_type: this.type
                }

                if (membership_card_id_repeat) {
                    o = {
                        receive_type: this.type,
                        membership_card_id_repeat:membership_card_id_repeat
                    }
                }

		    	if(this.type == 'integral'){
		    		o = {
		    		    receive_type: this.type,
                        point:this.buy_pay_point
		    		}

                    if (membership_card_id_repeat) {
                        o = {
                            receive_type: this.type,
                            point:this.buy_pay_point,
                            membership_card_id_repeat:membership_card_id_repeat
                        }
                    }
		    	}

                this.$router.push({
                	name:'drp-apply',
                	query:o
                });
			},
			submit(){
	    		this.$router.push({
	    			name:'drp-apply',
	    			query:{
	    				receive_type:this.type
	    			}
	    		});
			},
		    //判断是否登录
		    notLogin(msg){
		      let url = window.location.href;
		      Dialog.confirm({
		        message:msg,
		        className:'text-center'
		      }).then(()=>{
		        this.$router.push({
		          path: '/login',
		          query:{
		            redirect: {
		              name:'drp-register',
		              url:url
		            }
		          }
		        })
		      }).catch(()=>{

		      })
		    }
		},
		watch: {
			status(val, oldVal) {
				if (val === 'success') {
					this.$router.push({
						name: 'drp-finish'
					})
				}
			}
		}
	};
</script>

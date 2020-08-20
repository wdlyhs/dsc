<template>
	<div class="drp-withdraw ">
		<div class="padding-all bg-color-write ">
			<div class="f-04 color-9">{{$t('lang.contribution_roll_out')}}</div>
			<van-field class="f-04" v-model="amount" clearable label="￥" :placeholder="$t('lang.enter_shift_amount')" />
			<p class="title f-03 color-9">{{$t('lang.enter_shift_amount')}}{{drpTransData.max_money}},{{$t('lang.min_transfer_amount')}}{{drpTransData.min_money}}{{$t('lang.yuan')}}</p>
		</div>
		<div class="withdraw-btn">
			<van-button class="br-5 f-06 m-top10" @click="withdrawMoney" type="primary" bottom-action>{{$t('lang.confirm_transfer')}}</van-button>
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
	import { mapState } from 'vuex'
	import CommonNav from '@/components/CommonNav'
	import {
		Field,
		Button,
		Toast,
		Dialog
	} from 'vant'
	export default {
		name: "drp-withdraw",
		components: {
			CommonNav,
			[Field.name]: Field,
			[Button.name]: Button,
			[Toast.name]: Toast,
			[Dialog.name]: Dialog
		},
		data() {
			return {
				amount: '',
				routerName:'drp'
			};
		},
		//初始化加载数据
		created() {
			Toast.loading({
				duration: 500,
				mask: true,
				message: this.$t('lang.loading')
			}, this.$store.dispatch('setDrpTrans'));
		},
		computed: {
			...mapState({
				drpTransData: state => state.drp.drpTransData,
			})
		},
		mounted() {},
		methods: {
			withdrawMoney() {
				let that = this
				let minMoney = parseInt(this.$store.state.drp.drpTransData.min_money)
				let maxMoney = parseInt(this.$store.state.drp.drpTransData.max_money)
				let inputValue = parseInt(this.amount)
				console.log(inputValue)
				if (inputValue < minMoney) {
					Toast(this.$t('lang.amount_cannot_less') + minMoney + this.$t('lang.yuan'))
				} else if (inputValue > maxMoney) {
					Toast(this.$t('lang.amount_exceeds_max_limit'))
				} else {
					that.$store.dispatch('setDrpTransferred',{
						amount:inputValue
					}).then(res=>{
						if(res.status == 'success'){
							Toast.success(res.data.msg);

							if(res.data.error == 0){
								this.$router.push({
									name:'drp'
								})
							}
						}else{
							Toast(this.$t('lang.deposit_fail'));
						}
					})
				}
			}
		}
	};
</script>

<template>
	<div class="user-recharge">
		<van-cell-group>
		  <van-cell :title="$t('lang.deposit_account')" :value="bank_cur" is-link />
		</van-cell-group>

		<van-field v-model="amount" type="digit" :label="$t('lang.deposit_money')" :placeholder="$t('lang.enter_deposit_money')" class="m-top10" />
		<div class="field-tips">{{$t('lang.lowest_deposit_money')}}：<em class="color-red" v-if="buyer_cash > 0">￥{{ buyer_cash }}</em><em class="color-red" v-else>{{$t('lang.unlimited')}}</em></div>
		<div class="field-tips" v-if="account">{{$t('lang.max_deposit_money')}}：<span class="color-red" v-html="account"></span></div>

		<div class="padding-all">
			<template v-if="msg == ''">
				<button class="btn btn-submit border-radius-top05" @click="submitBtn">{{$t('lang.submit_apply')}}</button>
			</template>
			<template v-else>
				<button class="btn btn-submit btn-disabled border-radius-top05">{{ msg }}</button>
				<router-link :to="{name:'realname'}" class="taps">{{$t('lang.up_real_name')}}</router-link>
			</template>
		</div>

		<van-popup class="show-popup-bottom" v-model="show" position="bottom">
			<div class="goods-show-title padding-all">
				<h3 class="fl">{{$t('lang.select_account')}}</h3>
				<i class="iconfont icon-close fr" @click="close"></i>
			</div>
			<div class="s-g-list-con">
				<div class="select-two">
					<ul>
						<li class="ect-select" v-for="(item,index) in bank" :key="index" :class="{'active':bank_id == index}" @click="brand_select(item.bank_card,item.bank_name,index)">
							<label class="dis-box">
								<span class="box-flex">{{ item.bank_card }} {{ item.bank_name }}</span>
								<i class="iconfont icon-gou"></i>
							</label>
						</li>
					</ul>
				</div>
			</div>
		</van-popup>
		<CommonNav></CommonNav>
	</div>
</template>

<script>
import qs from 'qs'

import { 
	Field,
	Cell,
	CellGroup,
	Popup,
	Toast
} from 'vant'

import CommonNav from '@/components/CommonNav'

export default{
	data(){
		return {
			show:false,
			amount:'',
			account:'',
			bank:[],
			bank_id:-1,
			bank_cur:'',
			msg:'',
			buyer_cash:0
		}
	},
	components:{
		[Field.name]:Field,
		[Cell.name]:Cell,
		[CellGroup.name]:CellGroup,
		[Popup.name]:Popup,
		[Toast.name]:Toast,
		CommonNav
	},
	created(){
	    this.raplayInfo()

	    this.shopConfig()
	},
	methods:{
		raplayInfo(){
			this.$http.get(`${window.ROOT_URL}api/v4/account/reply`).then(({data:{data}}) =>{
		     	if(data.code == 0){
		     		this.bank = data.bank
		     		this.bank_cur = this.bank[0].bank_card
		     		this.account = data.surplus_amount
		     	}else{
		     		this.msg = data.msg
		     	}
		    })
		},
		modeHandle(){
			this.show = true
		},
		brand_select(card,name,index){
			this.bank_id = index
			this.bank_cur = card + ' ' + name
		},
		close(){
			this.show = false
		},
		shopConfig(){
			this.$http.get(`${window.ROOT_URL}api/v4/shop/config`).then(({data:{data}})=>{
				this.buyer_cash = data.buyer_cash
			})
		},
		submitBtn(){
			let o = {
				amount:this.amount,
				surplus_type:1
			}
			if(Number(this.amount) >= Number(this.buyer_cash)){
				this.$http.post(`${window.ROOT_URL}api/v4/account/account`,qs.stringify(o)).then(res => {
			    	Toast(res.data.data.msg)
			    	setTimeout(()=>{
			    		this.$router.push({
				    		name:'account'
				    	})
			    	},500)
			    })
		    }else{
		    	Toast(this.$t('lang.deposit_money_prompt'))
		    }
		}
	}
}
</script>
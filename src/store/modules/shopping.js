import {
	GOODS_CART_LIST,
	GOODS_GUESS_LIST,
	STORE_ALL,
	SHIPPING,
	SHIPPING_FEE,
	CHECKOUT,
	CHECKOUT_TOTAL,
	DONEINFO,
	PAYLIST,
	CART_COUPONS_LIST,
	COUDAN_GOODS_LIST,
	COUDAN_INFO
} from '../mutation-type.js'

import { apiShopping } from '@/config'

import i18n from '@/locales'

import { 
	Toast,
	Dialog
} from 'vant'

import router from '@/router'

const state = {
	goodsCartList:[],
	goodsGuessList:[],
	checkedGoods:[],
	allGoodsListId:[],
	checkedShop:[],
	shipping_fee:'',
	checkoutInfo:'',
	listShow:[],
	cartCheckedVlaue:[],
	pay_list:[],
	pay_id:'',
	doneinfo:'',
	cartCouponsList:[],
	coudanGoodsList:[],
	coudanInfo:''
}

const mutations = {
	[GOODS_CART_LIST](state,o){
		state.goodsCartList = o.data

	    state.goodsCartList.forEach((v,index)=>{
	    	state.checkedGoods[index] = []
	    	state.allGoodsListId[index] = []

	    	v.new_list.forEach((act,actIndex)=>{
	    		act.act_goods_list.forEach((g,gIndex)=>{
	    			state.allGoodsListId[index].push(g.rec_id)

	    			if(g.is_checked){
	    				state.checkedGoods[index].push(g.rec_id)
	    			}
	    		})
	    	})

	    	state.checkedShop.push(v.checked)
	    })
	},
	[STORE_ALL](state,o){
		for(let i = 0; i<state.goodsCartList.length; i++){
			state.goodsCartList[i].checked = o.type
		}
	},
	[SHIPPING](state,o){
	},
	[SHIPPING_FEE](state,o){
		state.shipping_fee = o
	},
	[CHECKOUT](state,{o,res}){
		if(!res.error){
			state.checkoutInfo = res

			if(res.goods_list){
				res.goods_list.forEach((v)=>{
					if(v.goods.length > 1){
						state.listShow.push(true)
					}else{
						state.listShow.push(false)
					}
				})
			}
		}else{
			state.checkoutInfo = res.error

			if(res.error === 'address'){
				if(o.rec_type || o.type_id){
					router.push({
	                    name: 'addAddressForm',
	                    query: {
	                        routerLink: 'checkout',
	                        entrance:'first',
	                        rec_type: o.rec_type,
                            type_id: o.type_id,
                            team_id: o.team_id
	                    }
	                })
				}else{
					router.push({
	                    name: 'addAddressForm',
	                    query: {
	                        routerLink: 'checkout',
	                        entrance:'first'
	                    }
	                })
                }
			}else if(res.error === 'excess'){
				Dialog.alert({
					message: res.msg,
                    className: 'text-center',
                    confirmButtonText:i18n.t('lang.back_cart')
				}).then(() => {
                    router.push({
	                    name: 'cart',
	                })
                })
			}
		}
	},
	[CHECKOUT_TOTAL](state,o){
		state.checkoutInfo.total = o
	},
	[DONEINFO](state,o){
		state.doneinfo = o
	},
	[PAYLIST](state,o){
		state.pay_list = o
		state.pay_id = ''
		state.pay_list.forEach((v)=>{
			if(v.selected){
				state.pay_id = v.pay_id
			}
		})
	},
	[GOODS_GUESS_LIST](state,o){
		state.goodsGuessList = o.data
	},
	[CART_COUPONS_LIST](state,o){
		state.cartCouponsList = o.data
	},
	[COUDAN_GOODS_LIST](state,o){
		if(o.page == 1){
			state.coudanGoodsList = o.data
		}else{
			if(o.data.length != 0){
				for(let i= 0;i<o.data.length;i++){
					state.coudanGoodsList.push(o.data[i])
				}
			}else{
				state.coudanGoodsList.push('')
			}
		}
	},
	[COUDAN_INFO](state,o){
		state.coudanInfo = o.data
	}
}

const actions = {
	async setAddCart({ commit }, o){
		return apiShopping.getAddCart(o)
	},
	async setGoodsCart({ commit }, o){
		apiShopping.getCartList(o).then(res=>{
			commit(GOODS_CART_LIST,res)
		})
	},
	setUpdateNumber({ commit }, o){
		return apiShopping.getUpdateNumber(o)
	},
	setGiftList({ commit }, o){
		return apiShopping.getGiftList(o)
	},
	setGiftChecked({ commit }, o){
		return apiShopping.getGiftChecked(o)
	},
	setFavourable({ commit }, o){
		return apiShopping.getFavourable(o)
	},
	setChangefav({ commit }, o){
		return apiShopping.getChangefav(o)
	},
	setCoupons({ commit }, o){
		apiShopping.getCoupons(o).then(res=>{
			commit(CART_COUPONS_LIST,res)
		})
	},
	setCoudanGoodsList({ commit }, o){
		apiShopping.getCoudanGoodsList(o).then(res=>{
			commit(COUDAN_GOODS_LIST,res)
		})
	},
	setCoudan({ commit },o){
		apiShopping.getCoudan(o).then(res=>{
			commit(COUDAN_INFO,res)
		})
	},
	setCartGoodsDelete({ commit }, o){
		return apiShopping.getCartGoodsDelete(o)
	},
	setCartBatchDelete({ commit }, o){
		return apiShopping.getCartBatchDelete(o)
	},
	setShippingFee({ commit }, o){
		apiShopping.getShippingFee(o).then(res=>{
			commit(SHIPPING_FEE,res)
		})
	},
	setShipping({ commit }, o){
		return apiShopping.getShipping(o)
	},
	setCartChecked({ commit }, o){
		return apiShopping.getCartChecked(o)
	},
	setCartDefault({ commit }, o){
		return apiShopping.getCartDefault(o)
	},
	setStoresCart({ commit }, o){
		return apiShopping.getStoresCart(o)
	},
	storeAll({ commit }, o){
		commit(STORE_ALL, o)
	},
	setShoppingCheckout({ commit }, o){
		apiShopping.getShoppingCheckout(o).then(res=>{
			commit(CHECKOUT, {o,res})
		})
	},
	setCheckoutTotal({ commit }, o){
		commit(CHECKOUT_TOTAL,o)
	},
	setCheckoutSubmit({ commit }, o){
		return apiShopping.getCheckoutSubmit(o)
	},
	setDoneInfo({ commit }, o){
		apiShopping.getDoneInfo(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setDoneInfoBalance({ commit }, o){
		apiShopping.getDoneInfoBalance(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setPayList({ commit }, o){
		apiShopping.getPayList(o).then(res=>{
			commit(PAYLIST, res)
		})
	},
	setPayTab({ commit }, o){
		return apiShopping.getPayTab(o)
	},
	setGoodsGuess({ commit }){
		apiShopping.getGoodsGuess().then(res =>{
			commit(GOODS_GUESS_LIST,res)
		})
	},
	setAddPackageCart({ commit }, o){
		return apiShopping.getAddPackageCart(o)
	}
}

export default{
	state,
	mutations,
	actions
}
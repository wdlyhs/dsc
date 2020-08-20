import qs from 'qs'
import axios from 'axios'
import i18n from '@/locales'

import { 
	Toast,
	Dialog
} from 'vant'

import {
    Loading
} from 'element-ui';

async function getLogins(o,oF){
	axios.post(`${window.ROOT_URL}api/v4/user/login`, qs.stringify(o)).then(res => {
		if(res.data.status ==='success'){
			Toast.success({
			  duration: 0,
			  forbidClick: true,
			  loadingType: 'spinner',
			  message: i18n.t('lang.login_success')
			})

			let timer = setInterval(() => {
			    clearInterval(timer)
			    Toast.clear()
			    oF.getLogin({
					token: res.data.data,
					status: res.data.status
				})
			}, 1000);
		}else{
			Toast(res.data.errors.message)
		}
	}).catch(err => {
		console.log(err);
	})
}

/* 注册 */
function getRegister(o){
	return new Promise((reslove,reject) => {
		axios.post(`${window.ROOT_URL}api/v4/user/fast-login`,qs.stringify(o)).then(res=>{
			reslove(res.data)
		})
	}).catch(err => {
  		console.log(err)
	})
}

/* 用户中心首页 数据 */
function getProfiles(o){
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/user/profile`).then(res =>{
			if(res.data.status == 'success'){
				reslove(res.data)
			}
		}).catch(err => {
			console.log(err)
		})
	})
}

/* 修改头像 */
function getUpdateAvatar(o){
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/user/avatar`,{params:o}).then(res =>{
			reslove(res.data)
		}).catch(err => {
			console.log(err)
		})
	})
}

/* 收货地址列表 */
function getAddress(o){
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/address`).then(res =>{
			reslove(res.data)
		}).catch(()=>{
			console.error()
		})
	})
}

/* 设置默认收货地址 */
function getAddressDefault(o){
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/address/default`,qs.stringify(o)).then(res => {
			reslove(res.data.data)
		}).catch(()=>{
			console.error()
		})
	})
}

/* 添加收货地址 */
function getAddressAdd(o){
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/address/store`,qs.stringify(o)).then(res => {
			reslove(res.data)
		}).catch(()=>{
			console.error()
		})
	})
}

/* 删除收货地址 */
function getAddressDelete(o){
	return new Promise((reslove, reject) => {
		Dialog.confirm({
			message:i18n.t('lang.confirm_delete_address')
		}).then(()=>{
			axios.delete(`${window.ROOT_URL}api/v4/address/destroy`,{ params:o }).then(res => {
				reslove({
					data:res.data,
					address_id:o.address_id
				})
			})
		}).catch(()=>{
			console.error()
		})
	})
}

/* 查看收货地址 */
function getAddressInfo(o){
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/address/show`,qs.stringify(o)).then(res => {
			reslove(res.data)
		}).catch(()=>{
			console.error()
		})
	})
}

/* 导入微信收货地址 */
function getwxImportAddress(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/address/wximport`,qs.stringify(o)).then(res => {
            reslove(res.data)
        }).catch(()=>{
            console.error()
        })
    })
}

/* 关注店铺列表 */
function getCollectShopList(o){
	return new Promise((reslove, reject) =>{
		axios.get(`${window.ROOT_URL}api/v4/collect/shop`,{ params:o }).then(res =>{
			reslove({
				data:res.data.data,
				size:o.size,
      			page:o.page
			})
		}).catch(err=>{
			console.error()
		})
	})
}

/* 关注店铺 */
function getCollectShop(o){
	return new Promise((reslove, reject) =>{
		axios.post(`${window.ROOT_URL}api/v4/collect/collectshop`,qs.stringify(o)).then(({ data:{ data } }) =>{
			let status = o.status == 1 ? 0 : 1

			Toast({
				message: data.msg,
				duration: 600
			})

			reslove({
				data:data,
				ru_id:o.ru_id,
				status:status
			})
	    }).catch(err=>{
	      reject(err)
	    })
	})
}

/* 收藏商品列表 */
function getCollectGoodsList(o){
	return new Promise((reslove, reject) =>{
		axios.get(`${window.ROOT_URL}api/v4/collect/goods`,{ params:o }).then(res =>{
			reslove({
				data:res.data.data,
				size:o.size,
      			page:o.page
			})
		}).catch(err=>{
			reject(err)
		})
	})
}

/* 收藏商品 */
function getCollectGoods(o){
	return new Promise((reslove, reject) =>{
		let status = o.status == 1 ? 0 : 1

		axios.post(`${window.ROOT_URL}api/v4/collect/collectgoods`,qs.stringify(o)).then(({ data:{ data } }) => {
			Toast({
				message: data.msg,
				duration: 600
			})

			reslove({
				data:data,
				goods_id:o.goods_id,
				status:status
			})
	    }).catch(err=>{
			reject(err)
	    })
	})
}

/* 订单列表 */
function getOrderList(o){
	return new Promise((reslove, reject) =>{
		axios.post(`${window.ROOT_URL}api/v4/order/list`,qs.stringify(o)).then(res =>{
			if(res.data.status == 'success'){
				reslove({
					data:res.data.data,
					size:o.size,
          			page:o.page
				})
			}
		}).catch(err=>{
			reject(err)
		})
	})
}

/* 订单详情 */
function getOrderDetail(o){
	return new Promise((reslove, reject) =>{
		Toast.loading({ duration: 0, mask: true, forbidClick: true, message: i18n.t('lang.loading') })
		axios.post(`${window.ROOT_URL}api/v4/order/detail`,qs.stringify(o)).then(res =>{
			if(res.data.status == 'success'){
				reslove(res.data)
				Toast.clear()
			}
		}).catch(err=>{
			reject(err)
		})
	})
}

/* 取消订单 */
function getOrderHandler(o){
	return new Promise((reslove, reject) => {
		Dialog.confirm({
			message:i18n.t('lang.confirm_cancel_order'),
			className:'text-center'
		}).then(()=>{
	    axios.post(`${window.ROOT_URL}api/v4/order/cancel`,qs.stringify(o)).then(res => {
	    	if(res.data.status == 'success'){
	    		reslove(res.data)
	    	}
	    })
    })
  })
}

/* 确认收货 */
function getReceivedOrder(o){
	return new Promise((reslove, reject) => {
		Dialog.confirm({
			message:i18n.t('lang.confirm_received_order'),
			className:'text-center'
		}).then(()=>{
	    axios.post(`${window.ROOT_URL}api/v4/order/confirm`,qs.stringify(o)).then(res => {
	    	if(res.data.status == 'success'){
	    		reslove(res.data)
	    	}
	    })
    })
  })
}

/* 延迟收货 */
function getDelayOrder(o){
	return new Promise((reslove, reject) => {
		Dialog.confirm({
			message:i18n.t('lang.is_delay_order'),
			className:'text-center'
		}).then(()=>{
	    axios.post(`${window.ROOT_URL}api/v4/order/delay`,qs.stringify(o)).then(res => {
	    	if(res.data.status == 'success'){
	    		reslove(res.data)
	    	}
	    })
    })
  })
}

/* 删除订单 */
function getDeleteOrder(o){
	return new Promise((reslove, reject) => {
		Dialog.confirm({
			message:i18n.t('lang.is_delete_order'),
			className:'text-center'
		}).then(()=>{
	    axios.post(`${window.ROOT_URL}api/v4/order/delete`,qs.stringify(o)).then(res => {
	    	if(res.data.status == 'success'){
	    		reslove(res.data)
	    	}
	    })
    })
  })
}

/* 还原订单 */
function getRestoreOrder(o){
    return new Promise((reslove, reject) => {
        Dialog.confirm({
            message:i18n.t('lang.is_restore_order'),
            className:'text-center'
        }).then(()=>{
            axios.post(`${window.ROOT_URL}api/v4/order/restore`,qs.stringify(o)).then(res => {
                if(res.data.status == 'success'){
                    reslove(res.data)
                }
            })
        })
    })
}

/* 浏览历史 */
function getHistory() {
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/history/index`).then(res => {
			reslove(res.data)
		})
	})
}

/* 添加浏览历史 */
function getHistoryAdd(o) {
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/history/store`,qs.stringify(o)).then(res => {
			reslove(res.data)
		})
	})
}

/* 清空浏览历史 */
function getHistoryDelete(o) {
  return new Promise((reslove, reject) => {
        if(o){
            axios.delete(`${window.ROOT_URL}api/v4/history/destroy`,{ params:o }).then(res => {
                Toast.loading({
                  message: res.data.msg,
                  duration:1000
                });
                reslove({
                    data:res.data.code
                })
            })
        }else{
      		Dialog.confirm({
    			message:i18n.t('lang.confirm_history_delete'),
    		}).then(()=>{
    			axios.delete(`${window.ROOT_URL}api/v4/history/destroy`).then(res => {
    				Toast.loading({
    				  message: res.data.msg,
    				  duration:1000
    				});
    				reslove({
    					data:res.data.code
    				})
    			})
    		}).catch(()=>{
    			console.error()
    		})
        }
	})
}

/* 退换货申请列表 */
function getRefoundList(o){
	return new Promise((reslove, reject) => {
    axios.get(`${window.ROOT_URL}api/v4/refound`,{params: o}).then(res => {
    	reslove({
    		data:res.data.data,
			size:o.size,
  			page:o.page
    	})
    })
  })
}

/* 单个订单商品退换货列表 */
function getOrderRefound(o){
	return new Promise((reslove, reject) => {
    axios.get(`${window.ROOT_URL}api/v4/refound/returngoods`,{params: o}).then(res => {
    	reslove(res.data)
    })
  })
}

/* 申请退换货 */
function getApplyRefound(o){
	return new Promise((reslove, reject) => {
    axios.get(`${window.ROOT_URL}api/v4/refound/applyreturn`,{params: o}).then(res => {
    	reslove(res.data)
    })
  })
}

/* 退换货详情 */
function getReturnDatail(o){
	return new Promise((reslove, reject) => {
    axios.get(`${window.ROOT_URL}api/v4/refound/returndetail`,{params: o}).then(res => {
    	reslove(res.data)
    })
  })
}

/* 优惠券 */
async function getUserCoupon(o) {
  return new Promise((reslove, reject) => {
      axios.get(`${window.ROOT_URL}api/v4/coupon/coupon`, {
          params: o
      }).then(res => {
          reslove({
              data:res.data.data,
              size:o.size,
              page:o.page
          })
      })
  })
}

/* 评论晒单列表 */
function getCommentList(o){
	return new Promise((reslove, reject) => {
    axios.post(`${window.ROOT_URL}api/v4/comment/commentlist`,qs.stringify(o)).then(res => {
    	reslove({
          data:res.data.data,
          size:o.size,
          page:o.page
      })
    })
  })
}

/* 评论详情商品信息 */
function getAddcomment(o){
	return new Promise((reslove, reject) => {
    axios.post(`${window.ROOT_URL}api/v4/comment/addcomment`,qs.stringify(o)).then(res => {
    	reslove(res.data)
    })
  })
}

/* 添加商品评论 */
function getAddgoodscomment(o){
	return new Promise((reslove, reject) => {
    axios.post(`${window.ROOT_URL}api/v4/comment/addgoodscomment`,qs.stringify(o)).then(res => {
    	reslove(res.data)
    })
  })
}

//上传图片
function getMaterial(o){
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/user/material`,qs.stringify(o)).then(res =>{
			reslove(res.data)
		})
  	})
}

/* 帮助 */
function getArticleHelp(){
	return new Promise((reslove, reject) => {
		axios.post(`${window.ROOT_URL}api/v4/user/help`).then(res => {
			reslove(res.data)
		})
	})
}

/* 资金管理 */
function getAccount(){
	Toast.loading({ duration: 0, mask: true, forbidClick: true, message: i18n.t('lang.loading') })
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/account`).then(res => {
			reslove(res.data)
			Toast.clear()
		})
	})
}

//会员中心红包
async function bonusList(o) {
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/bonus/bonus`, {
            params: o
        }).then(res => {
            reslove({
                data:res.data.data,
                size:o.size,
                page:o.page
            })
        })
    })
}

//会员添加红包
function addBonus(o) {
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/bonus/store`, qs.stringify(o)).then(res => {            
            if(res.data.status == 'success'){
                reslove(res.data)
            }
        })
    })
}

//储值卡列表
function valueCardList(o) {
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/valuecard`, {
            params: o
        }).then(res => {            
             reslove({
                data:res.data.data,
                size:o.size,
                page:o.page
            })
        })
    })
}

//领取储值卡
function addValueCard(o) {
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/valuecard/addvaluecard`, qs.stringify(o)).then(res => {            
            if(res.data.status == 'success'){
                reslove(res.data)
            }
        })
    })
}

//储值卡详情
function valueCardInfo(o) {
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/valuecard/detail`, {
            params: o
        }).then(res => {            
            if(res.data.status == 'success'){
                reslove(res.data)
            }
        })
    })
}

//充值储值卡
function getDepositValueCard(o) {
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/valuecard/deposit`, qs.stringify(o)).then(res => {            
            if(res.data.status == 'success'){
                reslove(res.data)
            }
        })
    })
}

//供应链 采购单列表
function getSupplierOrderList(o){
	return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/suppliers/orderlist`, {
            params: o
        }).then(res => {            
             reslove({
                data:res.data.data,
                size:o.size,
                page:o.page
            })
        })
    })
}

//供应链 采购单列表
function getSupplierAffirmorder(o){
	return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/suppliers/affirmorder`, {
            params: o
        }).then(res => {            
             reslove(res.data)
        })
    })
}

/* 再次购买 */
function getbuyAgain(o){
	return new Promise((reslove, reject) => {
		axios.get(`${window.ROOT_URL}api/v4/trade/buyagain`, {
			params: o
		}).then(res => {
			reslove(res.data)
		})
	})
}

/* 手机端商家入驻 信息 */
function getMerchants(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}

/* 手机端商家入驻 入驻须知 */
function getMerchantsGuide(){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/guide`).then(res => {
            reslove(res.data)
        })
    })
}

/* 手机端商家入驻 同意协议 */
function getMerchantsAgree(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/agree`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 一级分类列表 */
function getMerchantsShop(){
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/merchants/shop`).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 获取下级分类 */
function getMerchantsChildCate(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/get_child_cate`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 添加分类 */
function getMerchantsAddCate(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/add_child_cate`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 删除分类 */
function getMerchantsDeleteCate(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/delete_child_cate`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 提交店铺审核 */
function getMerchantsAddShop(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/merchants/add_shop`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端商家入驻 等待审核 */
function getMerchantsAudit(){
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/merchants/audit`).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端供应商入驻 供应商信息 */
function getSupplierApplyInfo(o){
    return new Promise((reslove, reject) => {
        axios.get(`${window.ROOT_URL}api/v4/suppliers/apply`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}
/* 手机端供应商入驻 提交店铺审核 */
function getSupplierApply(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/suppliers/do_apply`,qs.stringify(o)).then(res => {
            reslove(res.data)
        })
    })
}

export default {
	getLogins,
	getRegister,
	getProfiles,
	getUpdateAvatar,
	getAddress,
	getAddressDefault,
	getAddressDelete,
	getAddressInfo,
    getwxImportAddress,
	getAddressAdd,
	getCollectShopList,
	getCollectShop,
	getCollectGoodsList,
	getCollectGoods,
	getOrderList,
	getOrderDetail,
	getOrderHandler,
	getReceivedOrder,
	getDelayOrder,
	getDeleteOrder,
    getRestoreOrder,
	getHistory,
	getHistoryAdd,
	getHistoryDelete,
	getRefoundList,
	getOrderRefound,
	getApplyRefound,
	getApplyRefound,
	getReturnDatail,
	getUserCoupon,
	getCommentList,
	getMaterial,
	getAddcomment,
	getAddgoodscomment,
	getArticleHelp,
	getAccount,
	bonusList,
	addBonus,
	valueCardList,
	addValueCard,
	valueCardInfo,
	getDepositValueCard,
	getSupplierOrderList,
	getSupplierAffirmorder,
	getbuyAgain,
    getMerchants,
    getMerchantsGuide,
    getMerchantsAgree,
    getMerchantsShop,
    getMerchantsChildCate,
    getMerchantsAddCate,
    getMerchantsDeleteCate,
    getMerchantsAddShop,
    getMerchantsAudit,
    getSupplierApplyInfo,
    getSupplierApply
}
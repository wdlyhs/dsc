<template>
    <div class="con">
        <template v-if="card_id">
            <div class="vip-buy">
                <div class="purchase-card">
                    <div class="swiper-card">
                        <div class="purchase-card-item">
                            <div class="left">
                                <div class="rank">{{drpRightsCard.name}}</div>
                                <span class="period" v-if="drpRightsCard.expiry_type == 'forever'">{{$t('lang.term_of_validity')}}：{{$t('lang.permanence')}}</span>
                                <span class="period" v-else-if="drpRightsCard.expiry_type == 'days'">{{$t('lang.term_of_validity')}}：{{drpRightsCard.expiry_type_format}}</span>
                                <span class="period" v-else-if="drpRightsCard.expiry_type == 'timespan'">{{$t('lang.term_of_validity')}}：{{drpRightsCard.expiry_date_end}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="protection" v-if="drpRightsCard.user_membership_card_rights_list && drpRightsCard.user_membership_card_rights_list.length > 0">
                    <div class="title">{{$t('lang.vip_protection')}}</div>
                    <div class="items">
                        <div class="item" v-for="(card,cardIndex) in drpRightsCard.user_membership_card_rights_list" :key="cardIndex" @click="protectionHref(card.membership_card_id,cardIndex)">
                            <div class="icon"><div class="img-box"><img :src="card.icon" class="img" /></div></div>
                            <div class="text">{{card.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="head" v-if="drpRightsCard.description">
                    <div class="title">{{$t('lang.vip_card')}}</div>
                    <div class="notice">
                        <p>{{drpRightsCard.description}}</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <swiper :options="swiperOption" ref="slideSwiper" class="apply-swiper">
                <swiper-slide v-for="(item,index) in drpChangeCard.list" :key="index">
                    <div class="list" :class="{'list-active':type != 'goods'}">
                        <div class="vip-buy">
                            <div class="purchase-card">
                                <div class="swiper-card">
                                    <div class="purchase-card-item">
                                        <div class="left">
                                            <div class="rank">{{item.name}}</div>
                                            <span class="period" v-if="item.expiry_type == 'forever'">{{$t('lang.term_of_validity')}}：{{$t('lang.permanence')}}</span>
                                            <span class="period" v-else-if="item.expiry_type == 'days'">{{$t('lang.term_of_validity')}}：{{item.expiry_type_format}}</span>
                                            <span class="period" v-else-if="item.expiry_type == 'timespan'">{{$t('lang.term_of_validity')}}：{{item.expiry_date_end}}</span>
                                        </div>
                                        <div class="right" v-if="type != 'goods'">{{item.receive_value_arr.value_format}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="protection" v-if="item.user_membership_card_rights_list && item.user_membership_card_rights_list.length > 0">
                                <div class="title">{{$t('lang.vip_protection')}}</div>
                                <div class="items">
                                    <div class="item" v-for="(card,cardIndex) in item.user_membership_card_rights_list" :key="cardIndex" @click="protectionHref(card.membership_card_id,cardIndex)">
                                        <div class="icon"><div class="img-box"><img :src="card.icon" class="img" /></div></div>
                                        <div class="text">{{card.name}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="head" v-if="item.description">
                                <div class="title">{{$t('lang.vip_card')}}</div>
                                <div class="notice">
                                    <p>{{item.description}}</p>
                                </div>
                            </div>
                            <div class="bg-color-write" v-if="type == 'integral'">
                                <div class="cell-box">
                                    <div class="cell-title">{{$t('lang.receive_value_integral')}}</div>
                                    <div class="cell-content">{{item.receive_value_arr.value}}</div>
                                </div>
                            </div>
                            <div class="bg-color-write" v-if="type == 'order'">
                                <div class="cell-box">
                                    <div class="cell-title">{{$t('lang.receive_value_order')}}</div>
                                    <div class="cell-content">{{item.receive_value_arr.value_format}}</div>
                                </div>
                            </div>
                            <div v-if="type == 'goods'">
                                <div class="head" v-if="item.description">
                                    <div class="title">{{$t('lang.receive_value_goods')}}</div>
                                </div>
                                <ul class="apply-goods-list clearfix">
                                    <li class="item" v-for="(goodsitem,index2) in item.goods_list" :key="index2">
                                        <div class="item-wapper">
                                            <div class="img"><router-link :to="{name:'goods',params:{id:goodsitem.goods_id}}"><img :src="goodsitem.goods_thumb" alt=""></router-link><div class="tag">{{$t('lang.drp_apply_goods_label')}}</div></div>
                                            <div class="tit"><router-link :to="{name:'goods',params:{id:goodsitem.goods_id}}">{{goodsitem.goods_name}}</router-link></div>
                                            <div class="info">
                                                <div class="price">{{goodsitem.shop_price_formated}}</div>
                                                <div class="i-btn" v-if="goodsitem.is_buy==0" @click="onAddCartClicked(goodsitem.goods_id,10)">{{$t('lang.drp_apply_btn_2')}}</div>
                                                <div class="i-btn" v-else>{{$t('lang.drp_apply_goods_bought')}}</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="vip-fixed-bottom" v-if="type != 'goods'">
                            <div class="item article-confirm">
                                <div class="radio-wrap" @click="toggleConfirm"><i class="radio-icon" :class="{'active': confirm}"></i>{{$t('lang.checkout_help_article')}}</div>
                                <span @click="articleHref(drpChangeCard.agreement_id)">{{ drpChangeCard.agreement_article_title }}</span>
                            </div>
                            <div class="item vip-btn" @click="onSubmit">
                                <template v-if="type == 'goods'">
                                    <span>{{$t('lang.drp_apply_btn_1')}}</span>
                                </template>
                                <template v-else-if="type == 'buy'">
                                    <span>{{$t('lang.immediate_pay')}}</span>
                                    <span class="number">{{ item.receive_value_arr.value_format }}</span>
                                </template>
                                <template v-else-if="type == 'free'">
                                    <span>{{ $t('lang.immediately_receive') }}</span>
                                </template>
                                <template v-else>
                                    <span>{{$t('lang.immediately_change')}}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
                <div class="swiper-button swiper-button-next" slot="button-prev"><i class="iconfont icon-more"></i></div>
                <div class="swiper-button swiper-button-prev" slot="button-next"><i class="iconfont icon-back"></i></div>
            </swiper>
        </template>

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
                <div class="v-btn" @click='closePopup'>{{$t('lang.close_window')}}</div>
                </template>
                <template v-if="popupStep == 2">
                <div class="v-btn disabled">{{$t('lang.drp_apply_padding')}}</div>
                </template>
                <template v-if="popupStep == 3">
                <div class="v-btn" @click='drpInfoHref'>{{$t('lang.href_drp_center')}}</div>
                </template>
            </div>
        </van-popup>

        <!--初始化loading-->
        <DscLoading :dscLoading="dscLoading"></DscLoading>

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
import qs from 'qs'
import { mapState } from 'vuex'
import {
    Button,
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn,
    Toast,
    Dialog,
    Popup
} from 'vant'

import {
    swiper,
    swiperSlide
} from 'vue-awesome-swiper'

import CommonNav from '@/components/CommonNav'
import DscLoading from '@/components/DscLoading'

let vm = null

export default{
    data(){
        return{
            routerName:'drp',
            confirm: false,
            formValid: true,
            validMsg: '',
            validNumber: '',
            validTip: '',
            popupStep: 1,
            applySuccess: false,
            applyPopupShow: false,
            dscLoading:true,
            index:0,
            swiperOption:{
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on:{
                    init(){
                        vm.index = this.activeIndex;
                    },
                    slideChange(){
                        vm.index = this.activeIndex;
                    }
                },
                autoHeight:true
            },
            point:this.$route.query.point ? this.$route.query.point : '',
            type:this.$route.query.receive_type,
            card_id:this.$route.query.card_id ? this.$route.query.card_id : '',
        }
    },
    components:{
        [Button.name]:Button,
        [GoodsAction.name] : GoodsAction,
        [GoodsActionBigBtn.name] : GoodsActionBigBtn,
        [GoodsActionMiniBtn.name] : GoodsActionMiniBtn,
        [Toast.name]:Toast,
        [Popup.name]:Popup,
        [Dialog.name]:Dialog,
        swiper,
        swiperSlide,
        CommonNav,
        DscLoading
    },
    computed:{
        ...mapState({
            drpChangeCard: state => state.drp.drpChangeCard,
            drpRightsCard: state => state.drp.drpRightsCard
        })
    },
    created(){
        vm = this;

        // 续费
        let membership_card_id_renew = this.$route.query.membership_card_id_renew ? this.$route.query.membership_card_id_renew : null
        // 重新领取
        let membership_card_id_repeat = this.$route.query.membership_card_id_repeat ? this.$route.query.membership_card_id_repeat : null

        if(this.card_id){
            this.onRightsCard();
        }else{
            if (membership_card_id_renew) {
                this.$store.dispatch('setDrpChangeCard',{
                    receive_type:this.type,
                    membership_card_id_renew: membership_card_id_renew
                })
            } else if (membership_card_id_repeat) {
                this.$store.dispatch('setDrpChangeCard',{
                    receive_type:this.type,
                    membership_card_id_repeat: membership_card_id_repeat
                })
            } else {
                this.$store.dispatch('setDrpChangeCard',{
                    receive_type:this.type
                })
            }
        }
    },
    methods:{
        onSubmit(){
            let that = this
            let o = {
                receive_type: this.type,
                membership_card_id: this.drpChangeCard.list[this.index].id
            }

            if(!this.confirm){
                Toast(this.$t('lang.drp_agreement_please'));
                return false
            }

            if(this.type == 'integral'){
                o = {
                    receive_type: this.type,
                    membership_card_id: this.drpChangeCard.list[this.index].id,
                    pay_point:this.drpChangeCard.list[this.index].receive_value_arr.value
                }
            }

            if(this.type == 'buy'){
                this.$router.push({
                    name:'drp-done',
                    query:{
                        membership_card_id:this.drpChangeCard.list[this.index].id,
                    }
                })

                return false
            }

            // 续费
            let membership_card_id_renew = this.$route.query.membership_card_id_renew ? this.$route.query.membership_card_id_renew : null

            if (membership_card_id_renew) {
                Dialog.confirm({
                    message:'是否确定续费？',
                    className:'text-center'
                }).then(()=>{
                    this.$http.post(`${window.ROOT_URL}api/v4/drp/renew`,qs.stringify(o)).then(({data:data})=>{
                        if(data.status == 'success'){
                            this.validTip = data.data.msg;
                            if(data.data.error == 0){
                                this.formValid = true;
                                this.popupStep = 3;
                                setTimeout(function(){
                                    that.$router.push({
                                        name:'drp-info'
                                    })
                                }, 2000)
                            }else{
                                this.formValid = false;
                                this.popupStep = 1;
                            }

                            this.applyPopupShow = true;
                        }else{
                            Toast(this.$t('lang.interface_error_reporting'))
                        }
                    })
                })
            } else {
                Dialog.confirm({
                    message:'是否申请成为分销商？',
                    className:'text-center'
                }).then(()=>{
                    this.$http.post(`${window.ROOT_URL}api/v4/drp/apply`,qs.stringify(o)).then(({data:data})=>{
                        if(data.status == 'success'){
                            this.validTip = data.data.msg;
                            if(data.data.error == 0){
                                this.formValid = true;
                                this.popupStep = 3;
                                setTimeout(function(){
                                    that.$router.push({
                                        name:'drp-info'
                                    })
                                }, 2000)
                            }else{
                                this.formValid = false;
                                this.popupStep = 1;
                            }

                            this.applyPopupShow = true;
                        }else{
                            Toast(this.$t('lang.interface_error_reporting'))
                        }
                    })
                })

            }

        },
        onRightsCard(){
            this.$store.dispatch('setDrpRightsCard',{
                membership_card_id:this.card_id
            })
        },
        toggleConfirm(){
            this.confirm = !this.confirm
        },
        closePopup(){
            this.applyPopupShow = false
        },
        articleHref(id){
            this.$router.push({
                name:'articleDetail',
                params:{
                    id:id
                }
            })
        },
        protectionHref(id,index){
            this.$router.push({
                name:'drp-protection',
                query:{
                    card_id:id,
                    index:index
                }
            })
        },
        drpInfoHref(){
            this.$router.push({
                name:'drp-info'
            })
        },
        onAddCartClicked(goods_id,type){
            this.$store.dispatch('setAddCart', {
                goods_id: goods_id,
                num: 1,
                spec: [],
                rec_type: type
            }).then(res => {
                if (res == true) {
                    this.$router.push({
                        name: 'checkout',
                        query: {
                            rec_type: type
                        }
                    })
                } else {
                    Toast(res.msg)
                }
            })
        }
    },
    watch:{
        drpChangeCard(){
            setTimeout(()=>{
                this.dscLoading = false
            },1000)
        },
        drpRightsCard(){
            setTimeout(()=>{
                this.dscLoading = false
            },1000)
        }
    }
}
</script>

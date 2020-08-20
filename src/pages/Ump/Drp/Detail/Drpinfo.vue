<template>
    <div class="con drp-info">
        <template v-if="drpdata.error == 0 || drpdata.audit == 1">
            <div class="warp">
                <div class="tip" v-if="drpdata.expiry && drpdata.expiry.expiry_status > 0 && drpdata.expiry.card_expiry_status == 1">{{drpdata.expiry.expiry_time_notice}}</div>
                <div class="tip" v-if="drpdata.expiry.card_expiry_status != 1">{{drpdata.expiry.card_status_notice}}</div>
                <div class="header">
                    <div class="header-top">
                        <div class="header-img">
                            <router-link :to="{ name: 'drp-set' }">
                                <img :src="drpdata.shop_info.user_picture" alt="" class="img" v-if="drpdata.shop_info.user_picture">
                                <img src="../../../../assets/img/user_default.png" alt="" class="img" v-else>
                            </router-link>
                        </div>
                        <div class="header-right">
                            <h4>{{drpdata.shop_info.shop_name}}</h4>

                            <template v-if="drpdata.expiry.expiry_status == 1">
                                <span class="time" >{{$t('lang.membership_of_validity')}}：{{$t('lang.have_expired')}}</span>
                            </template>
                            <template v-else>
                                <span class="time" v-if="drpdata.expiry.expiry_type == 'forever'">{{$t('lang.membership_of_validity')}}：{{$t('lang.permanence')}}</span>
                                <span class="time" v-else-if="drpdata.expiry.expiry_type == 'days'">{{$t('lang.membership_of_validity')}}：{{drpdata.expiry.expiry_time_format}}</span>
                                <span class="time" v-else-if="drpdata.expiry.expiry_type == 'timespan'">{{$t('lang.membership_of_validity')}}：{{drpdata.expiry.expiry_time_format}}</span>
                            </template>

                            <div class="hang">
                                <div class="vip">
                                    <i><img src="../../../../assets/img/newuser/icon-vip.png" class="img"></i>
                                    <span>{{drpdata.user_rank}}</span>
                                </div>
                                <span class="user-more" @click="drpApplyHref">{{$t('lang.detail')}}<i class="iconfont icon-more"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="header-bottom" :class="{'bor':drpdata.expiry.card_expiry_status == 1 || (drpdata.expiry.expiry_status == 1 || (drpdata.expiry.expiry_status == 1 && drpdata.expiry.card_expiry_status == 2))}" v-if="drpdata.expiry && drpdata.expiry.expiry_status != 0 || drpdata.expiry.card_expiry_status == 2">
                        <div class="drp-button">
                             <div class="item" @click="drpRenew" v-if="drpdata.expiry.card_expiry_status == 1">
                                 <p>{{$t('lang.renew')}}</p>
                             </div>
                             <div class="item" v-if="drpdata.expiry.expiry_status == 1 || (drpdata.expiry.expiry_status == 1 && drpdata.expiry.card_expiry_status == 2)" @click="applyAgain">
                                 <p>{{$t('lang.re_purchase')}}</p>
                             </div>
                        </div>
                    </div>
                </div>
                <div class="section protection" v-if="card && protectionList.length > 0">
                    <div class="tit">
                        <div>{{$t('lang.enjoy_equity')}}</div>
                        <span class="user-more" @click="protectionHref(0)">{{$t('lang.more')}}<i class="iconfont icon-more"></i></span>
                    </div>
                    <div class="value">
                        <div class="item-list" v-for="(item,index) in protectionList" :key="index" @click="protectionHref(index)">
                            <div class="icon"><div class="img-box"><img :src="item.icon" class="img" /></div></div>
                            <div class="text">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="section section-money">
                    <div class="tit">{{$t('lang.my_assets')}}</div>
                    <div class="value">
                        <div class="item" @click="Withdraw">
                            <p>{{drpdata.surplus_amount}}</p>
                            <span>{{$t('lang.deposit_brokerage')}}</span>
                        </div>
                        <div class="item">
                            <p>{{drpdata.totals}}</p>
                            <span>{{$t('lang.drp_totals')}}</span>
                        </div>
                        <div class="item">
                            <p>{{drpdata.today_total}}</p>
                            <span>{{$t('lang.today_income')}}</span>
                        </div>
                        <div class="item">
                            <p>{{drpdata.total_amount}}</p>
                            <span>{{$t('lang.drp_total_amount')}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="drp-info-team">
                <div class="tit">
                    <i class="row"></i>
                    <span>{{$t('lang.my_team_alt')}}</span>
                </div>
                <div class="items">
                    <div class="item item1">
                        <div class="num">{{drpdata.sum_count}}</div>
                        <div class="link"></div>
                        <div class="text">{{$t('lang.user_total')}}</div>
                    </div>
                    <div class="item item2">
                        <div class="num">{{drpdata.team_count}}</div>
                        <div class="link"></div>
                        <div class="text">{{$t('lang.directly_user')}}</div>
                    </div>
                    <div class="item item3">
                        <div class="num">{{drpdata.user_count}}</div>
                        <div class="link"></div>
                        <div class="text">{{$t('lang.directly_user_lower_level')}}</div>
                    </div>
                </div>
                <div class="button" @click="inviteFriends()">{{$t('lang.team_rule_tit_3')}}<i class="iconfont icon-more"></i></div>
            </div>
            <div class="nav-items">
                <div class="nav-item" @click="teamClick">
                    <i><img src="../../../../assets/img/newuser/info-icon1.png" class="img"></i>
                    <span>{{$t('lang.my_team_alt')}}</span>
                </div>
                <router-link :to="{name:'drp-drplog'}" class="nav-item">
                    <i><img src="../../../../assets/img/newuser/info-icon2.png" class="img"></i>
                    <span>{{$t('lang.commission_detail')}}</span>
                </router-link>
                <router-link :to="{name:'drp-rank'}"  class="nav-item">
                    <i><img src="../../../../assets/img/newuser/info-icon3.png" class="img"></i>
                    <span>{{$t('lang.rich_list')}}</span>
                </router-link>
                <div class="nav-item" @click="drpshopLink">
                    <i><img src="../../../../assets/img/newuser/info-icon4.png" class="img"></i>
                    <span>{{$t('lang.my_drp')}}</span>
                </div>
            </div>
            <div class="adv" v-if="drpdata.banner && drpdata.banner.length > 0">
                <Swiper v-if="drpdata.banner" :data="drpdata.banner" :autoplay='3000'></Swiper>
            </div>
        </template>
        <template v-else>
            <div class="ectouch-notcont">
                <div class="img">
                    <img class="img" src="../../../../assets/img/no_content.png" />
                </div>
                <template v-if="viewStatus == 1">
                    <template v-if="viewAudit == 0">
                        <span class="cont">{{$t('lang.drp_status_propmt_1')}}</span>
                    </template>
                    <template v-if="viewAudit == 2">
                        <span class="cont">{{$t('lang.drp_status_propmt_7')}}</span>
                    </template>
                </template>
                <template v-if="viewStatus == 2">
                    <span class="cont">{{$t('lang.drp_status_propmt_3')}}<router-link :to="{name:'drp-register'}" class="color-red">{{$t('lang.to_apply')}}</router-link></span>
                </template>
                <template v-if="viewStatus == 3">
                    <span class="cont">{{$t('lang.drp_status_propmt_8')}}</span>
                </template>
            </div>
        </template>
        <ec-tab-down></ec-tab-down>

        <!--续费方式-->
        <van-popup class="show-popup-bottom" v-model="renewShow" position="bottom">
            <div class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.fill_in_renew')}}</h3>
                <i class="iconfont icon-close fr" @click="renewClose"></i>
            </div>
            <div class="s-g-list-con">
                <div class="select-two">
                    <ul>
                        <li class="ect-select" v-for="(item,index) in card.receive_value" :key="index"
                            :class="{'active':renew_type == item.type}"
                            @click="renew_method_select(item.type)">
                            <label class="dis-box">
                                <span class="box-flex" v-if="item.type == 'integral'">{{$t('lang.drp_apply_title_1')}}</span>
                                <span class="box-flex" v-if="item.type == 'order'">{{$t('lang.drp_apply_title_2')}}</span>
                                <span class="box-flex" v-if="item.type == 'buy'">{{$t('lang.drp_apply_title_3')}}</span>
                                <span class="box-flex" v-if="item.type == 'goods'">{{$t('lang.drp_apply_title_4')}}</span>
                                <span class="box-flex" v-if="item.type == 'free'">{{$t('lang.drp_apply_title_5')}}</span>
                                <i class="iconfont icon-gou"></i>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>

        <!--初始化loading-->
        <DscLoading :dscLoading="dscLoading"></DscLoading>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import {
        Button,
        Toast,
        Popup
    } from 'vant'
    import Swiper from '@/components/Swiper'
    import CommonNav from '@/components/CommonNav'
    import EcTabDown from '@/components/tab-down/Frontend'
    import DscLoading from '@/components/DscLoading'
    export default {
        components: {
            Swiper,
            CommonNav,
            EcTabDown,
            DscLoading,
            [Button.name]: Button,
            [Toast.name]: Toast,
            [Popup.name]: Popup,
        },
        data() {
            return {
                viewStatus:0,
                routerName:'drp',
                activityRouterPath:'',
                dscLoading:true,
                renewShow:false,
                renew_type:''
            }
        },
        //初始化加载数据
        created() {
            this.$store.dispatch('setDrp')
        },
        //计算属性
        computed: {
            ...mapState({
                drpdata: state => state.drp.drpData
            }),
            card(){
                return this.drpdata.membership_card_info ? this.drpdata.membership_card_info : ''
            },
            protectionList(){
                return this.card ? this.card.user_membership_card_rights_list : ''
            }
        },
        methods: {
            teamClick(){
                let that = this
                that.$router.push({
                    name: "drp-team",
                    params: {
                        user_id: that.drpdata.shop_info.user_id
                    }
                });
            },
            drpshopLink(){
                if(this.viewStatus != 3){
                    this.$router.push({
                        name:'drp'
                    })
                }else{
                    Toast(this.$t('lang.drp_status_propmt_8'))
                }
            },
            inviteFriends(){
                this.$router.push({
                    name:'drp-card'
                })
            },
            //提现金额
            Withdraw() {
                let that = this
                that.$router.push({
                    name: 'drp-withdraw'
                });
            },
            protectionHref(index){
                this.$router.push({
                    name:'drp-protection',
                    query:{
                        card_id:this.card.id,
                        index:index
                    }
                })
            },
            drpApplyHref(){
                this.$router.push({
                    name:'drp-apply',
                    query:{
                        card_id:this.card.id
                    }
                })
            },
            drpRenew(){
                this.renewShow = true
            },
            applyAgain(){
                // 重新申请
                let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null

                let membership_card_id_repeat = this.drpdata.shop_info.membership_card_id

                this.$router.push({
                    name: "drp-register",
                    query: {
                        membership_card_id_repeat: membership_card_id_repeat
                    }
                });
            },
            renewClose(){
                this.renewShow = false
            },
            renew_method_select(type){
                let o = {}

                this.renew_type = type;

                if(this.card.id){
                    o = {
                        receive_type: type,
                        membership_card_id_renew:this.card.id
                    }
                }else{
                    o = {
                        receive_type: type
                    }
                }

                this.$router.push({
                    name:'drp-apply',
                    query:o
                });
            }
        },
        watch:{
            drpdata(){
                setTimeout(()=>{
                    this.dscLoading = false
                },1000)

                this.viewStatus = this.drpdata.error
                this.viewAudit = this.drpdata.audit

                if(this.viewStatus == 2){
                    this.$router.push({
                        name:'drp-register',
                        query:{
                            back:this.activityRouterPath
                        }
                    });
                }
            }
        },
        beforeRouteEnter(to,form,next){
            next(vm=>{
                vm.activityRouterPath = form.fullPath
            })
        }
    }
</script>
<style scoped>


</style>

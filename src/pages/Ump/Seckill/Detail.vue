<template>
    <div class="con">
        <div class="con_main goods">
            <!--轮播图-->
            <van-swipe :autoplay="3000" class="swipe">
                <van-swipe-item v-for="(item, index) in goodsInfo.pictures" :key="index" v-if="goodsInfo.pictures.length > 0">
                    <img class="img" :src="item.img_url" />
                </van-swipe-item>
                <van-swipe-item v-else><img :src="goodsInfo.goods_img" class="img"></van-swipe-item>
            </van-swipe>

            <!--title-->
            <div class="cont-box">
                <div class="dis-box price-box">
                    <div class="left box-flex">
                        <h4 class="color-white">
                            <div class="f-weight">{{goodsInfo.sec_price_format}}</div>
                            <div class="tag-price dis-box">
                                <div class="left-tag dis-box">
                                    <div class="left-icon">
                                        <i class="iconfont icon-lightning f-01"></i>
                                    </div>
                                    <div class="box-flex tag-right-cont f-01">{{$t('lang.seckill')}}</div>
                                </div>
                                <div class="box-flex">
                                    <label class="p-l05 f-01">{{$t('lang.market_price')}}
                                        <del>{{goodsInfo.market_price}}</del>
                                    </label>
                                </div>
                            </div>
                        </h4>
                    </div>
                    <div class="right">
                        <template v-if="goodsInfo.status">
                        <div class="time-title f-02 text-center m-top06">{{$t('lang.were_still_end')}}</div>
                        </template>
                        <template v-else>
                        <div class="time-title f-02 text-center m-top06">{{$t('lang.from_start')}}</div>
                        </template>
                        <div class="f-02 color-white time m-top02">
                            <div v-if="goodsInfo.formated_start_date != undefined && goodsInfo.formated_end_date != undefined">
                                <count-down :endTime="goodsInfo.formated_end_date" :endText="$t('lang.activity_end')"></count-down>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title bg-color-write f-06 color-3 padding-all">
                    <van-tag type="danger" class="m-r05 f-03" v-if="goodsInfo.rz_shopName">{{goodsInfo.rz_shopName}}</van-tag>
                    <span class="f-05 color-3 f-weight">{{goodsInfo.goods_name}}</span>
                    <div class="color-red f-03 m-top04">{{goodsInfo.goods_shipai}}</div>
                    <div class="dis-box color-9 f-03 m-top08">
                        <div class="box-flex">{{$t('lang.sales_volume')}} {{goodsInfo.sales_volume}}</div>
                        <div class="box-flex text-center">{{$t('lang.stock')}} {{goodsInfo.sec_num}}</div>
                        <div class="box-flex">
                            <p class="text-right">{{$t('lang.gb_limited')}}{{goodsInfo.sec_limit}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ect-group dis-box m-top08">
                <div class="left-cell">{{$t('lang.number')}}：</div>
                <div class="box-flex right-cell">
                    <div class="div-num dis-box  fr">
                        <a class="num-less" @click="reduceGoodsNum"></a>
                        <input class="box-flex price_times" type="tel" v-model="num" name="price_times" autocomplete="off">
                        <a class="num-plus" @click="addGoodsNum"></a>
                    </div>
                </div>
            </div>
            <!--详情-->
            <van-tabs v-model="active" class="m-top08">
                <van-tab v-for="(item,index) in tabs" :title="item" :key="index">
                    <template v-if="index == 0">
                        <template v-if="goodsInfo.goods_desc">
                            <div v-html="goodsInfo.goods_desc" class="goods_desc"></div>
                        </template>
                        <template v-else>
                            <NotCont />
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="goodsInfo.attr_parameter">
                            <div class="goods_attr_parameter">
                            <table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable param_table">
                                <tbody>
                                    <tr><td>{{$t('lang.goods_sn')}}</td><td>{{ goodsInfo.goods_sn }}</td></tr>
                                </tbody>
                                <tbody>
                                    <tr><th class="tdTitle" colspan="2">{{$t('lang.subject')}}</th></tr>
                                    <tr><td>{{$t('lang.brand')}}</td><td>{{ goodsInfo.brand_name }}</td></tr>
                                    <tr><td>{{$t('lang.goods_weight')}}</td><td>{{ goodsInfo.goods_weight }}kg</td></tr>
                                    <tr><th class="tdTitle" colspan="2">{{$t('lang.attr_parameter')}}</th></tr>
                                    <tr v-for="item in goodsInfo.attr_parameter"><td>{{ item.attr_name }}</td><td>{{ item.attr_value }}</td></tr>
                                </tbody>
                            </table>
                            </div>
                        </template>
                        <template v-else>
                            <NotCont />
                        </template>
                    </template>
                </van-tab>
            </van-tabs>
            <van-goods-action>
                <van-goods-action-mini-btn icon="chat" :text="$t('lang.customer_service')" @click="onChat(goodsInfo.goods_id,goodsInfo.user_id)" />
                <van-goods-action-mini-btn :icon="collect_icon" :text="$t('lang.collect')" :class="{'curr':is_collect == 1}" @click="collection" />
                <van-goods-action-big-btn v-if="goodsInfo.status && goodsInfo.is_end ===0" :text="$t('lang.snapped_immediately')" primary @click="seckillCheckout" />
                <van-goods-action-big-btn v-if="!goodsInfo.status && goodsInfo.is_end ===0" :text="$t('lang.begin_minute')" />
                <van-goods-action-big-btn v-if="!goodsInfo.status && goodsInfo.is_end !=0" :text="$t('lang.has_ended')" />
            </van-goods-action>
        </div>
        <CommonNav/>
    </div>
</template>
<script>
	import { mapState } from 'vuex'
	import {
		swiper,
		swiperSlide
	} from 'vue-awesome-swiper'
    
    import {
        Swipe,
        SwipeItem,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        Actionsheet,
        Cell,
        CellGroup,
        Tab,
        Tabs,
        Tag,
        Toast,
        Dialog
    } from 'vant'

    import CommonNav from '@/components/CommonNav'
    import NotCont from '@/components/NotCont'
    import CountDown from '@/components/CountDown'
    import formProcessing from '@/mixins/form-processing'

    export default {
        name: "auction-detail",
        mixins: [formProcessing],
        data() {
            return {
                tabs: [this.$t('lang.goods_detail_info'), this.$t('lang.specification_parameter')],
                num:1,
                content: '',
                serviceShow: false,
                processShow: false,
                PriceShow: false,
                active: 2,
				//轮播图滑动
				swiperOption: {
					scrollbarHide: true,
					slidesPerView: 'auto',
					centeredSlides: false,
					grabCursor: true,
					autoplay: 2500,
				},
                seckill_id:this.$route.query.seckill_id,
                tomorrow:this.$route.query.tomorrow,
                back:this.$route.query.back
            }
        },
        components: {
            CommonNav,
            CountDown,
            NotCont,
            swiper,
            swiperSlide,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [GoodsAction.name]: GoodsAction,
            [GoodsActionBigBtn.name]: GoodsActionBigBtn,
            [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
            [Actionsheet.name]: Actionsheet,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Tag.name]: Tag,
            [Toast.name]: Toast,
            [Dialog.name] : Dialog,
        },
        //初始化加载数据
		created() {
            this.$store.dispatch('setSeckillDetail',{
                seckill_id: this.seckill_id,
                tomorrow: this.tomorrow
            })
		},
        mounted(){
            if (window.history && window.history.pushState && this.back) {
                // 向历史记录中插入了当前页
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.goBack, false);
            }
        },
        destroyed(){
            window.removeEventListener('popstate', this.cancel, false);
        },
		computed: {
			...mapState({
                goodsInfo: state => state.other.seckillDetailData,
			}),
            isLogin(){
 			    return localStorage.getItem('token') == null ? false : true
             },
            goodsCollectStatue(){
                return this.$store.state.user.goodsCollectStatue
            },
            is_collect:{
                get(){
                    return this.$store.state.other.seckillDetailData.is_collect
                },
                set(val){
                    this.$store.state.other.seckillDetailData.is_collect = val
                }
            },
            collect_icon(){
                return this.is_collect == 1 ? 'like' : 'like-o'
            },
		},
        methods: {
            goBack(){
                this.$router.replace({
                    path: this.back
                })
            },
            //立即购买
            seckillCheckout(){
                let cur_number = Number(this.goodsInfo.order_number) + Number(this.num)
                if(this.goodsInfo.sec_limit === 0 || (this.goodsInfo.sec_limit >= cur_number)){
                    this.$store.dispatch('setSeckillBuy',{
                        sec_goods_id: this.seckill_id,
                        number:this.num,
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                        goods_spec:0
                    }).then(({ data:data })=>{
                        if(data.error == 1){
                            Toast(data.mesg)
                        }else{
                            this.$router.push({
                              name:'checkout',
                              query:{
                                rec_type:data.flow_type,
                                type_id:data.extension_id
                              }
                            })
                        }
                    })
                }else{
                    if(this.goodsInfo.order_number > 0){
                        Toast(this.$t('lang.groupbuy_propmt_1') + this.goodsInfo.order_number +this.$t('lang.groupbuy_propmt_2'))
                    }else{
                        Toast(this.$t('lang.groupbuy_propmt_4'))
                    }
                }
            },
            auctionProcess() {
                this.processShow = !this.processShow
            },
            auctionPrice() {
                this.PriceShow = !this.PriceShow
            },
            //数量加
            addGoodsNum() {
                var num = this.num
                if(num < this.goodsInfo.sec_limit){
                    this.num ++
                }else{
                    Toast(this.$t('lang.limit_cannot_exceeded'))
                }
            },
            //数量减
            reduceGoodsNum() {
                var num = this.num
                if (num > 1) {
                    this.num--
                } else {
                    Toast(this.$t('lang.min_can_less_than'))
                }
            },
            //收藏
            collection(){
    			if(this.isLogin){
    				this.$store.dispatch('setCollectGoods',{
                        goods_id:this.goodsInfo.goods_id,
                        status:this.is_collect
                    })
    			}else{
    				let msg = this.$t('lang.fill_in_user_collect_goods')
                    this.notLogin(msg)
    			}
    		},
            notLogin(msg) {
                let url = window.location.href;
                Dialog.confirm({
                    message: msg,
                    className: 'text-center'
                }).then(() => {
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: {
                                name: 'seckill-detail',
                                query: {
                                    seckill_id: this.seckill_id,
                                    tomorrow: this.tomorrow
                                },
                                url:url
                            }
                        }
                    })
                }).catch(() => {

                })
            },
        },
        watch:{
            goodsCollectStatue(){
                //关注跟踪变化
                this.goodsCollectStatue.forEach((v)=>{
                    if(v.id == this.goodsInfo.goods_id){
                        this.is_collect = v.status
                    }
                })
            },
            goodsInfo(){
                //设置title
                document.title = this.goodsInfo.goods_name;

                //单独设置微信分享信息
                this.$wxShare.share({
                    title:this.goodsInfo.goods_name,
                    desc:this.goodsInfo.goods_brief,
                    link:`${window.ROOT_URL}mobile/#/seckill/detail?seckill_id=` + this.seckill_id +'&tomorrow='+this.tomorrow,
                    imgUrl:this.goodsInfo.goods_thumb
                })
            }
        }
    }
</script>

<template>
    <div class="team con_main">
        <van-tabs :active="active" class="team-tabs">
            <van-tab>
                <div slot="title" class="nav_active" @click="teamNavAll">{{$t('lang.all')}}</div>
            </van-tab>
            <van-tab v-for="(item,index) in teamIndexData.team_categories" :key="index">
                <div slot="title" class="nav_active" @click="teamNav(item)">{{item.name}}</div>
            </van-tab>
        </van-tabs>
        <!--拼团首页-->
        <div v-if="tc_id==0">
            <!--轮播图-->
            <div class="p-r">
                <Swiper v-if="teamIndexData.banner" :data="teamIndexData.banner" :autoplay='3000'></Swiper>
                <div class="v-order">
                    <swiper class="swiper-virtual" :options="swiperOption2" ref="announSwiper">
                        <!-- 幻灯内容 -->
                        <swiper-slide class="swiper-slide swiper-no-swiping" v-for="(item,index) in virtual_order" :key="index">
                            <section>
                                <div class="pic"><img :src="item.user_picture" class="img" /></div>
                                <div class="name">{{ item.user_name }}</div>
                                <div class="sec">{{ item.seconds }}</div>
                            </section>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
            </div>
            <!--首页 s-->
            <van-row class="banner_bottom" v-if='teamIndexData.banner_bottom'>
                <van-col span="12" v-for="(item,index) in teamIndexData.banner_bottom" :key="index" class="li">
                    <a :href="item.link"><img class="img" :src="item.pic" /></a>
                </van-col>
            </van-row>
            <!--热门活动-->
            <div class="m-top10">
                <van-cell-group>
                    <van-cell :title="$t('lang.hot_activate')" />
                </van-cell-group>
                <van-row class="ad_hot_left">
                    <van-col span="12" v-for="(item,index) in teamIndexData.ad_hot_left" :key="index">
                       <a :href="item.link"><img class="img" :src="item.pic" /></a>
                    </van-col>
                    <van-col span="12" class="hot-img">
                        <div class=" li" v-for="(item,index) in teamIndexData.ad_hot_right" :key="index">
                           <a :href="item.link"><img class="img" :src="item.pic" /></a>
                        </div>
                    </van-col>
                </van-row>
            </div>
            <!--广告位-->
            <Swiper v-if="teamIndexData.hotBottom" :data="teamIndexData.hotBottom" :autoplay='2600'></Swiper>
            <!--精选商品-->
            <div class="m-top10">
                <van-cell-group>
                    <van-cell :title="$t('lang.selection_activate')" />
                </van-cell-group>
                <van-row class="ad_hot_left">
                    <van-col span="12" v-for="(item,index) in teamIndexData.ad_best_left" :key="index">
                        <a :href="item.link"><img class="img" :src="item.pic" /></a>
                    </van-col>
                    <van-col span="12" class="hot-img">
                        <div class=" li" v-for="(item,index) in teamIndexData.ad_best_right" :key="index">
                            <a :href="item.link"><img class="img" :src="item.pic" /></a>
                        </div>
                    </van-col>
                </van-row>
            </div>
            <div class="goods-li m-top10" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="200">
                <a hred="javascript:;" @click="detailLink(item.goods_id)" class="show bg-color-write li" v-for='(item,index) in teamGoodsData' :key="index">
                    <div class="left">
                        <img v-if="item.goods_thumb" class="img" :src="item.goods_thumb" />
                        <img v-else class="img" src="../../../assets/img/not_goods.png" />
                    </div>
                    <div class="right">
                        <h4 class="f-05 color-3 twolist-hidden">{{item.goods_name}}</h4>
                        <div class="dis-box cont">
                            <div class="f-02 color-9 box-flex">{{$t('lang.single_purchase_price')}}<span v-html="item.shop_price"></span></div>
                            
                        </div>
                        <div class="dis-box m-top10">
                            <div class=" f-05 color-red">{{item.team_num}}{{$t('lang.one_group')}}</div>
                            <div class="box-flex f-06 color-red f-weight p-l1" v-html="item.team_price"></div>
                            <div>
                                <span class="min-btn tag-gradients-color br-100 color-white f-03">{{$t('lang.up_group')}}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div v-else>
            <div v-if="teamCateData">
                <Swiper v-if="teamCateData.banner" :data="teamCateData.banner" :autoplay='3000'></Swiper>
    
                <!--内页内容 s-->
                <van-row class="bg-color-write nav-list" v-if='teamCateData.team_categories_child'>
                    <van-col span="6" v-for="(item,index) in teamCateData.team_categories_child" :key="index">
                        <router-link :to="{ name: 'team-list', params: { id: item.tc_id }}">
                            <div class="nav-img ">
                                <img class="img" :src="item.tc_img" />
                            </div>
                            <p class="text-center f-03 color-3">{{item.name}}</p>
                        </router-link>
                    </van-col>
                </van-row>
                <van-row class="banner_bottom m-top08">
                    <van-col span="12" v-for="(item,index) in teamCateData.ads_left" :key="index" class="li">
                        <img class="img" :src="item.pic" />
                    </van-col>
                </van-row>
                <van-row class="activity-list m-top10" v-if='teamCateData.banner'>
                    <van-col span="12" v-for="(item,index) in teamCateData.banner" :key="index" class="li">
                        <img class="img" :src="item.imgurl" />
                    </van-col>
                </van-row>
                <div class="goods-li" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
                    <a hred="javascript:;" @click="detailLink(item.goods_id)" class="show bg-color-write li" v-for='(item,index) in teamGoodsData'
                        :key="index">
                        <div class="left">
                            <img v-if="item.goods_thumb" class="img" :src="item.goods_thumb" />
                            <img v-else class="img" src="../../../assets/img/not_goods.png" />
                        </div>
                        <div class="right">
                            <h4 class="f-05 color-3 twolist-hidden">{{item.goods_name}}</h4>
                            <div class="dis-box cont">
                                <div class="f-02 color-9 box-flex">{{$t('lang.single_purchase_price')}}<span v-html="item.shop_price"></span></div>
                            </div>
                            <div class="dis-box m-top10">
                                <div class=" f-05 color-red">{{item.team_num}}{{$t('lang.one_group')}}</div>
                                <div class="box-flex f-06 color-red f-weight p-l1" v-html="item.team_price"></div>
                                <div>
                                    <span class="min-btn btn-submit br-100 color-white f-03">{{$t('lang.up_group')}}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div v-else>
            </div>
            <!--内页内容 e-->
        </div>
        <!--拼团首页 e-->
        <TeamTabbar/>
        <CommonNav :routerName="routerName"></CommonNav>
        <template v-if="loading">
            <van-loading type="spinner" color="black" />
        </template>
    </div>
</template>
<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import { mapState } from 'vuex'
    import {
        Loading,
        Tab,
        Tabs,
        Swipe,
        SwipeItem,
        Row,
        Col,
        Cell,
        CellGroup,
        Toast,
        Waterfall
    } from 'vant'

    import CommonNav from '@/components/CommonNav'
    import Swiper from '@/components/Swiper'
    import TeamTabbar from './Detail/TeamTabbar'
    import arrRemove from '@/mixins/arr-remove'

    export default {
        name: "team",
        components: {
            CommonNav,
            Swiper,
            TeamTabbar,
            swiper,
            swiperSlide,
            [Loading.name]: Loading,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Toast.name]: Toast,
        },
        directives: {
			WaterfallLower: Waterfall('lower')
		},
        data() {
            return {
                routerName:'team',
                disabled:false,
			    loading:true,
				size:10,
				page:1,
                active: 0,
                team_id:0,
                virtual_order:[],
                swiperOption2: {
                    notNextTick: true,
                    direction: 'vertical',
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper 
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper 
                    loop:true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false
                    }
                },
            };
        },
        created() {
            let that = this

            setTimeout(() => {
                uni.getEnv(function(res){
                    if(res.plus || res.miniprogram){
                        uni.redirectTo({  
                            url:'../../pagesA/team/team'
                        })
                    }
                })
            },100)
            
            that.loadingData(that.teamNavAll());

            this.virtualOrder();
        },
        computed: {
            ...mapState({
                teamIndexData: state => state.team.teamIndexData,
                teamCateData: state => state.team.teamCateData,
            }),
            teamGoodsData:{
                get(){
                    return this.$store.state.team.teamGoodsData
                },
                set(val){
                    this.$store.state.team.teamGoodsData = val
                }
            },
            swiper() {
                return this.$refs.announSwiper.swiper
            },
        },
        methods: {
            //全部
            teamNavAll() {
                this.$store.dispatch('setTeamIndex')
                let tc_id = this.tc_id = 0
                this.getGoodsList(tc_id);
            },
            teamNav(item) {
                let that = this
                that.tc_id = item.tc_id
                that.$store.dispatch({
                    type: 'setTeamCate',
                    tc_id: that.tc_id
                })
                that.getGoodsList(that.tc_id)
            },
            //商品列表
            getGoodsList(tc_id) {
                this.$store.dispatch({
                    type: 'setTeamGoods',
                    size: this.size,
                    page: this.page,
                    tc_id: tc_id
                });
            },
            loadMore(){
				setTimeout(() => {
					this.disabled = true
					if(this.page * this.size == this.teamGoodsData.length){
						this.page ++
                        this.getGoodsList(this.tc_id)
					}
				},200);
			},
            //加载动画
            loadingData(url) {
                Toast.loading({
                    duration: 600,
                    mask: true,
                    message: this.$t('lang.loading')
                }, url);
            },
            detailLink(goods_id){
                this.$router.push({
                    name:'team-detail',
                    query:{
                        goods_id:goods_id,
                        team_id:this.team_id
                    }
                })
            },
            virtualOrder(){
                this.$http.get(`${window.ROOT_URL}api/v4/team/virtual_order`).then(res => {
                    if(res.data.status == "success"){
                        this.virtual_order = res.data.data
                    }else{
                        Toast('数据错误')
                    }
                })
            }
        },
        watch:{
			teamGoodsData(){
				if(this.page * this.size == this.teamGoodsData.length){
					this.disabled = false
					this.loading = true
				}else{
					this.loading = false
				}

                this.teamGoodsData = arrRemove.trimSpace(this.teamGoodsData)
			}
		}
    };
</script>
<style>
.v-order{ 
    height: 5rem;
    position: absolute;
    top: 2rem;
    left: 1rem;
}
.swiper-virtual {
    font-size: 1.3rem;
    height: 100%;
    @include flex1-1();
}

.swiper-virtual .swiper-slide {
    overflow: hidden;
    position: relative;
    @include box-pack(center, start);
    @include direction(center, flex-start);
}

.swiper-virtual .swiper-slide section {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background:rgba(0,0,0,.2);
    border-radius: 5rem;
    padding-right: 1rem;
}
.swiper-virtual .swiper-slide section .pic{ width: 3rem; height: 3rem; border-radius: 50%; overflow: hidden; margin-right: 1rem; }
.swiper-virtual .swiper-slide section .pic img{ border-radius: 50%; }
.swiper-virtual .swiper-slide section .name{ margin-right: 1rem; color: #fff; }

</style>

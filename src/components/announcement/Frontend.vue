<template>
    <div class='announcement' :class="{'date-height':!bDateSel && bNews,'announ':!bNews}">
        <img class="icon" :src="data.allValue.img" v-if="data.allValue.img" />
        <img class="icon" src="../../assets/img/default-img.jpg" alt="" v-else>
        <template v-if="bNews">
            <swiper class="swiper" :options="swiperOption" ref="announSwiper">
                <!-- 幻灯内容 -->
                <swiper-slide class="swiper-slide swiper-no-swiping" :class="{'date-height':bDateSel}" v-for="(item,index) in announcementList" :key="item.article_id">
                    <section>
                        <router-link :to="{name:'articleDetail',params:{id:item.article_id}}" v-if="authority == 'view'"></router-link>
                        <p>{{item.title}}</p>
                        <p class="last" v-if="bDateSel">{{item.date}}</p>
                    </section>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <template v-if="authority == 'view'">
                <router-link :to="{name:'article'}" class="more-link">{{$t('lang.more')}}
                    <i class="iconfont icon-more"></i>
                </router-link>
            </template>
            <template v-else>
                <a href="javascript:void(0)" class="more-link">{{$t('lang.more')}}
                    <i class="iconfont icon-more"></i>
                </a>
            </template>
        </template>
        <template v-else>
            <section class="">
                <div class="seamless-scroll" v-seamless-scroll="{winObj:winScrollObj,preview:preview}">
                    <p class="seamless-scroll-wrapper">{{ data.allValue.announContent }}</p>
                </div>
            </section>
        </template>
    </div>
</template>

<script>
//node library
import qs from 'qs'

// third party components
import Vue from 'vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    name: 'announcement',
    props: ['data', 'preview', 'modulesIndex'],
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            swiperOption: {
                notNextTick: true,
                direction: 'vertical',
                observer:true,//修改swiper自己或子元素时，自动初始化swiper 
                observeParents:true,//修改swiper的父元素时，自动初始化swiper 
                loop:true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                }
            },
            scroll: true,
            winScrollObj: 'announ' + this.modulesIndex,
            announcementList: []
        }
    },
    created() {
        if (this.bNews) {
            this.$http
                .post(`${window.ROOT_URL}api/v4/visual/article`,
                    qs.stringify({
                        cat_id: this.catId || 0,
                        num: this.nNumber
                    })
                )
                .then(res => {
                    this.announcementList = res.data.data
                })
                .catch(err => {
                    console.error(err)
                })
        }
    },
    mounted() {},
    computed: {
        swiper() {
            return this.$refs.announSwiper.swiper
        },
        catId() {
            let arr = [],
                len = 0
            this.data.allValue.optionCascaderVal
                ? (arr = this.data.allValue.optionCascaderVal.split(','))
                : (arr = [])
            len = arr.length
            return arr[len - 1]
        },
        nNumber() {
            return this.data.allValue.number
        },
        bNews() {
            if (this.data.isStyleSel == '0' && this.bStore == 0) {
                this.scroll = false
                return true
            } else {
                this.scroll = true
                return false
            }
        },
        bDateSel() {
            return this.data.isDateSel == '0' ? true : false
        },
        authority(){
            return window.apiAuthority
        },
        bStore() {
            if(this.authority == 'view'){
               return this.$route.params.id ? this.$route.params.id : 0
            }else{
                return window.shopInfo.ruid
            }
        },
    },
    watch: {
        scroll(val, oldVal) {
            if (!val) {
                clearInterval(window[this.winScrollObj])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/config.scss';
@import '../../assets/style/mixins/common.scss';
.announcement {
    background: #fff;
    vertical-align: middle;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0.7rem $padding-all;
    height: 5rem;
    @include box-pack(center, start);
    @include direction(center, initial);
}

.announcement .icon {
    height: 86%;
    margin-right: 0.8rem;
    display: block;
}

.swiper {
    font-size: 1.3rem;
    height: 100%;
    @include flex1-1();
}

.swiper-slide {
    overflow: hidden;
    position: relative;
    @include box-pack(center, start);
    @include direction(center, flex-start);
}

.swiper-slide section {
    width: 100%;
}

.swiper-slide p {
    white-space: nowrap;
    font-size: 1.4rem;
    font-weight: 400;
    @include ellipses();
}

.swiper-slide p.last {
    font-size: 1.2rem;
    font-weight: normal;
    color: $subsidiary-color;
}

.swiper .swiper-slide a {
    @include urlAbsolute();
}

.announcement.date-height,
.announcement.announ {
    font-size: 1.2rem;
    height: 4rem;
}

.announcement.date-height section,
.announcement.announ section {
    position: relative;
    @include flex1-1();
    overflow: hidden;
    height: 2.2rem;
    line-height: 2.2rem;
}
</style>
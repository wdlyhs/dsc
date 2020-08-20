<template>
    <swiper class="scroll-prolist" :options="swiperOption" ref="mySwiper">
        <swiper-slide class="spike-swiper-slide" v-for="(item,index) in prolist" :key="item.id">
            <a :href="item.url"></a>
            <div v-box-product-w="{bSizeSel:true,preview}" class="img-box">
                <template v-if="index > 3">
                     <img v-lazy="item.goods_thumb || item.goods_img" class="img swiper-lazy" alt="">
                     <!-- <div class="swiper-lazy-preloader"></div> -->
                </template>
                <template v-else>
                    <img v-lazy="item.goods_thumb || item.goods_img" class="img swiper-lazy" alt="">
                </template>
            </div>
            <h4 v-if="bTitle" class="twolist-hidden">{{ item.title || item.goods_name }}</h4>
            <span class="price">
                {{ item.shop_price_formated }}
            </span>
            <span class="rebate-price">
                {{item.rebate_price && item.rebate_price !== '0' ? '返:' + item.rebate_price : ''}}
            </span>
            <del>
                {{ item.market_price_formated }}
            </del>
        </swiper-slide>
    </swiper>
</template>

<script>
import {
    swiper,
    swiperSlide
} from 'vue-awesome-swiper'

export default {
    name: "scroll-prolist",
    props: {
        prolist: {},
        scrollNumber: {
            default: 3.4
        },
        bTitle: {},
        preview: {}
    },
    components: {
        swiper,
        swiperSlide,
    },
    data() {
        return {
            swiperOption: {
                notNextTick: true,
                slidesPerView: 3.4,
                watchSlidesProgress: true,
                watchSlidesVisibility: true,
                lazyLoading: true,
            },
        }
    },
    created() {
    },
    computed: {
        authority(){
            return window.apiAuthority
        }
    },
    methods:{
    }
}

</script>

<style lang="scss" scoped>
@import '../../assets/style/config.scss';
@import '../../assets/style/mixins/common.scss';
.scroll-prolist {
    background: #fff;
}

.spike-swiper-slide {
    min-height: 4rem;
}

.spike-swiper-slide .price,
.spike-swiper-slide del {
    text-align: center;
    display: block;
}


.scroll-prolist {
    padding: 0 .4rem;
}

.spike-swiper {
    margin-top: -1px;
    border-top: 1px solid $body-background;
}

.spike-swiper-slide {
    text-align: center;
    padding: 1rem .4rem;
    a {
        @include urlAbsolute();
        z-index: 1;
    }
}

.spike-swiper-slide:last-child {
    padding-right: .4rem;
}

.spike-swiper-slide img {
    display: block;
    width: 100%;
}

.spike-swiper-slide h4 {
    font-size: 1.2rem;
    margin-top: .2rem;
    font-weight: 400;
    line-height: 1.5rem;
    height: 3rem;
    @include ellipses();
}

.spike-swiper-slide .price {
    color: $color;
    font-size: 1.4rem;
}
.spike-swiper-slide .rebate-price{
    color: $color;
    font-size:1.3rem;
}
.spike-swiper-slide del {
    color: $subsidiary-color;
    font-size: 1.1rem;
}
</style>
<template>
    <div class="home-store">
        <swiper class="store-swiper" :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide class="store-swiper-slide" v-for="(item ,index) in storeList" :key="index">
                <router-link :to="{name:'shopHome',params:{id:item.user_id}}"  v-if="authority == 'view'"></router-link>
                
				<div class="box">
                    <h4><img v-lazy="item.logo_thumb" alt=""></h4>
                    <div v-box-product-w="{bSizeSel:'0',preview,type:'store'}" class="img-box" v-lazy:background-image="item.street_thumb" :style="'background: center 0%; background-repeat:no-repeat; background-size: 116%;'">
                    </div>
                    <div class="box_info">
                        <h2>{{ item.rz_shopName }}</h2>
                        <span>{{$t('lang.sum_to')}} <em>{{ item.goods.length }}</em> {{$t('lang.goods_letter')}}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
//node library
import qs from 'qs'

import {
    swiper,
    swiperSlide
} from 'vue-awesome-swiper'
export default {
    name: "store",
    props: ['data', 'preview'],
    components: {
        swiper,
        swiperSlide,
    },
    data() {
        return {
            swiperOption: {
                notNextTick: true,
                slidesPerView: 1.8
            },
            storeList: []
        }
    },
    created() {
        this.$http.post(`${window.ROOT_URL}api/v4/visual/store`, qs.stringify({
            number: this.nNumber < 1 ? 1 : this.nNumber
        })).then(({ data: { data } }) => {
            if (data || data.length > 0) {
                this.storeList = data
            }else{
                this.storeList = []
            }
        }).catch(err => {
            console.error(err)
        })
    },
    methods: {
        getShopUrl(id) {
            return ``
        }
    },
    computed: {
        nNumber() {
            return this.data.allValue.number
        },
        authority(){
            return window.apiAuthority
        }
    }

}

</script>

<style lang="scss" scoped>
@import '../../assets/style/config.scss';
@import '../../assets/style/mixins/common.scss';
.home-store .store-swiper{ 
    background: none;
}
.store-swiper .swiper-slide{
    background-color: #fff;
}
.store-swiper .box{
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    margin-left: .8rem;
}

.store-swiper-slide{
    a{
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 999;
    }
}

.store-swiper .swiper-slide{
    background: none;
}

.store-swiper h4{
    position: absolute;
    width: 25%;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
    border:1px solid #f5f5f5;
    bottom:30%;
    left: 38%;
    z-index: 9;
    img{
        width:100%;
    }
}

.box_info{
    background-color: #fff;
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 40%;
    text-align: center;

    h2{
        margin-top: 2.5rem;
        font-size: 1.6rem;
        color: #000;
    }
    span{
        color: #888;
        font-size: 1.4rem;
        margin-top: .5rem;
        display: block;
        em{
            color: #000;
        }
    }
}

</style>
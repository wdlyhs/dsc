<template>
    <footer class='tab-down' :style="oPosition">
        <ul>
            <template v-if="authority == 'view'">
                <li v-for="(item,index) in list" :key="index" :class="{active:routeName == item.url}" @click.stop="outerHref(item.url)">
                    <i></i>
                    <span>{{ item.desc }}</span>
                </li>
            </template>
            <template v-else>
                <li v-for="(item,index) in list" :key="index" :class="{active:aActive[index]}">
                    <i></i>
                    <span>{{ item.desc }}</span>
                </li>
            </template>
        </ul>
    </footer>
</template>

<script>
//nodes library
import qs from 'qs'

// custom components

// third party components

//mixins

export default {
    name: 'tab-down',
    props: ['data', 'preview'],
    mixins: [],
    components: {

    },
    data() {
        return {
            list:[{
                url:"home",
                desc:this.$t('lang.home')
            },{
                url:"catalog",
                desc:this.$t('lang.category')
            },{
                url:"search",
                desc:this.$t('lang.search')
            },{
                url:"cart",
                desc:this.$t('lang.cart')
            },{
                url:"user",
                desc:this.$t('lang.my_alt')
            }]
        }
    },
    created() {

    },
    mounted() {
    },
    methods: {
        
    },
    computed: {
        aActive() {
            let arr = []
            this.list.forEach(v => {
                arr.push(false)
            })
            arr[0] = true
            return arr
        },
        routeName() {
            return this.authority == 'view' ? this.$route.name : ''
        },
        aImgList() {

        },
        oPosition() {
            let o = {}
            this.preview ? o.position = "relative" : o.position = "fixed"
            return o
        },
        authority(){
            return window.apiAuthority
        }
    },
    methods:{
        outerHref(val){
            let that = this
            if(that.authority == 'view'){
                if(val == 'home' || val == 'catalog' || val == 'search' || val == 'user'){
                    setTimeout(() => {
                        uni.getEnv(function(res){
                            if(res.plus || res.miniprogram){
                                if(val == 'home'){
                                    uni.reLaunch({  
                                        url: '../../pages/index/index'
                                    })
                                }else if(val == 'catalog'){
                                    uni.reLaunch({  
                                        url: '../../pages/category/category'
                                    })
                                }else if(val == 'search'){
                                    uni.reLaunch({  
                                        url: '../../pages/search/search'
                                    })
                                }else if(val == 'user'){
                                    uni.reLaunch({  
                                        url: '../../pages/user/user'
                                    })
                                }
                            }else{
                                that.$router.push({
                                    name:val
                                })
                            }
                        })
                        uni.postMessage({
                            data: {
                                action: 'postMessage'
                            }
                        })
                    },100)
                }else{
                    that.$router.push({
                        name:val
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/config.scss';
@import '@/assets/style/mixins/common.scss';

.tab-down{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 111;
    background: #fff;
    border-top: 1px solid $border-color-split;
    padding-bottom: env(safe-area-inset-bottom);
    height: 5rem;
    box-sizing: content-box;
}

.tab-down ul {
    height: 5rem;
    @include disFlex();
}

.tab-down ul li {
    position: relative;
    padding: .4rem 0;
    text-align: center;
    @include flex1-1();
    &:nth-child(2) i{
        background-position: -2.701rem 0rem
    }
    &:nth-child(3) i{
        background-position: -13.9rem 0rem
    }
    &:nth-child(4) i{
        background-position: -5.78rem 0rem
    }
    &:nth-child(5) i{
        background-position: -8.38rem 0rem
    }
}

.tab-down ul li.active {
    color: $color;
}

.tab-down ul li a {
    @include urlAbsolute();
}

.tab-down ul li i {
    display: block;
    margin: 0 auto;
    width: 2.7rem;
    height: 2.7rem;
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: 0 0;
    background:url("../../assets/img/ec-icon.png");
    background-size: 32.1rem;
}


.tab-down ul li.active i {
    background-position-y: -2.99rem;
}

.tab-down ul li span {
    font-size: 1.2rem;
    display: block;
}

@media only screen and (width: 375px) and (height: 690px){
  .tab-down{
    
  }
}

</style>
<template>
  <div class="user-evaluation" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
    <template v-if="commentList.length > 0">
    <div class="product-list">
        <ul>
          <li v-for="(item,index) in commentList" :key="index">
            <div class="product-div">
              <div class="product-list-img">
                <router-link :to="{ name: 'goods', params: { id: item.goods_id }}">
                  <img class="img" :src="item.goods_thumb" v-if="item.goods_thumb">
                  <img class="img" src="../../../assets/img/no_image.jpg" v-else>
                </router-link>
              </div>
              <div class="product-info product-info-btn">
                <h4><router-link :to="{ name: 'goods', params: { id: item.goods_id }}">{{ item.goods_name }}</router-link></h4>
                <router-link :to="{name:'commentDetail',params:{id:item.rec_id}}" class="btn-default-new current fr br-5">{{$t('lang.evaluation_list')}}</router-link>
              </div>
            </div>
          </li>
        </ul>
    </div>
    <template v-if="loading">
        <van-loading type="spinner" color="black" />
    </template>
    </template>
    <template v-else>
        <NotCont />
    </template>
    <CommonNav></CommonNav>
  </div>
</template>

<script>
import qs from 'qs'
import { mapState } from 'vuex'
import {
    Waterfall,
    Loading
} from 'vant'
import NotCont from '@/components/NotCont'
import CommonNav from '@/components/CommonNav'
import arrRemove from '@/mixins/arr-remove'

export default{
	data(){
		return {
            apart:'comment',
            sign:0,
            page:1,
            size:10,
            loading:true,
        }
	},
    directives: {
        WaterfallLower: Waterfall('lower')
    },
    components:{
        [Loading.name] : Loading,
        NotCont,
        CommonNav
    },
    created(){
        this.commentListHandle()
    },
    computed:{
        commentList:{
            get(){
                return this.$store.state.user.commentList
            },
            set(val){
                this.$store.state.user.commentList = val  
            }
        }
    },
    methods:{
        commentListHandle(page){
            if(page){
                this.page = page
                this.size = Number(page) * 10
            }

            this.$store.dispatch('setCommentList',{
                sign:this.sign,
                page:this.page,
                size:this.size 
            })
        },
        //瀑布流加载分页
        loadMore(){
            setTimeout(() => {
                this.disabled = true
                if(this.page * this.size == this.commentList.length){
                    this.page ++
                    this.commentListHandle() 
                }
            },200);
        }
    },
    watch:{
        commentList(){
            if(this.page * this.size == this.commentList.length){
                this.disabled = false
                this.loading = true
            }else{
                this.loading = false
            }

            this.commentList = arrRemove.trimSpace(this.commentList)
        },
    }
}
</script>
<template>
	<div class="con" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
		<header class="header-nav-content">
	      <van-nav-bar :left-arrow="leftArrow" @click-left="onClickLeft">
	          <ul class="nav-con-warp" slot="title">
	              <li><router-link :to="{name:'goods',params:{id:goods_id}}">{{$t('lang.goods')}}</router-link></li>
	              <li><router-link :to="{name:'goods',params:{id:goods_id}}">{{$t('lang.detail')}}</router-link></li>
	              <li class="active">{{$t('lang.comment_alt')}}</li>
	          </ul>
	          <!-- <i class="iconfont icon-share-alt" slot="right"></i> -->
	      </van-nav-bar>
	  </header>
	  <div class="goods-comment m-top08 ">
      <van-tabs>
          <van-tab>
          	<div class="comment_nav" @click="handleTabComment('all')" slot="title">
          		<span>{{$t('lang.all_comment')}}</span>
          		<em>{{ number.all }}</em>
          	</div>
          </van-tab>
          <van-tab>
          	<div class="comment_nav" @click="handleTabComment('good')" slot="title">
          		<span>{{$t('lang.good_comment')}}</span>
          		<em>{{ number.good }}</em>
          	</div>
          </van-tab>
          <van-tab>
          	<div class="comment_nav" @click="handleTabComment('in')" slot="title">
          		<span>{{$t('lang.medium_comment')}}</span>
          		<em>{{ number.in }}</em>
          	</div>
          </van-tab>
          <van-tab>
          	<div class="comment_nav" @click="handleTabComment('rotten')" slot="title">
          		<span>{{$t('lang.negative_comment')}}</span>
          		<em>{{ number.rotten }}</em>
          	</div>
          </van-tab>
          <van-tab>
          	<div class="comment_nav" @click="handleTabComment('img')" slot="title">
          		<span>{{$t('lang.have_pictures')}}</span>
          		<em>{{ number.img }}</em>
          	</div>
          </van-tab>
      </van-tabs>
      <div class="comment-tab-content">
      	<template v-if="goodsComment && goodsComment.length > 0">
        <div class="comment-info" v-for="(item,index) in goodsComment" :key="index">
            <div class="evaluation-list">
                <div class="dis-box comment-list-box">
                    <div class="box-flex p-r">
                        <div class="comment-header">
                          <img :src="item.user_picture" class="img-height" v-if="item.user_picture">
                          <img src="../../assets/img/get_avatar.png" class="img-height" v-else>
                        </div>
                        <span class="f-05 col-7 comment-admin">{{ item.user_name }}</span>
                    </div>
                    <div class="box-flex"><div class="fr t-remark">{{ item.add_time }}</div></div>
                </div>
                <div class="grade-star" :class="'grade-star-'+ item.rank"></div>
                <p class="clear f-05 col-3">{{ item.content }}</p>
                <p class="clear m-top08 t-remark"></p>
                <div class="g-e-p-pic">
                    <div class="my-gallery">
                        <figure v-for="(imgItem,imgIndex) in item.comment_img" :key="imgIndex">
                            <div class="comment-img">
                              <a :href="imgItem">
                                <img class="img" :src="imgItem" v-if="imgItem" />
                                <img class="img" src="../../assets/img/no_image.jpg" v-else />
                              </a>
                            </div>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-cont" v-if="footerCont">{{$t('lang.no_more')}}</div>
        </template>
        <template v-else>
        	<NotCont></NotCont>
        </template>
      </div>
		</div>
    <!--初始化loading-->
    <DscLoading :dscLoading="dscLoading"></DscLoading>
	</div>
</template>

<script>
import qs from 'qs'
import { mapState } from 'vuex'

import {
  NavBar,
  Tab,
  Tabs,
  Waterfall,
  Loading
} from 'vant'

import NotCont from '@/components/NotCont'
import arrRemove from '@/mixins/arr-remove'
import DscLoading from '@/components/DscLoading'

export default{
	data(){
		return{
			commentTabs: [this.$t('lang.all_comment'), this.$t('lang.good_comment'), this.$t('lang.medium_comment'), this.$t('lang.negative_comment'), this.$t('lang.have_pictures')],
			rank:'all',
			number:Object,
      goods_id:this.$route.params.id,
      leftArrow:true,
      page:1,
      size:10,
      footerCont:false,
      dscLoading:true,
		}
	},
	components:{
		[NavBar.name]:NavBar,
		[Tab.name]:Tab,
		[Tabs.name]:Tabs,
    [Loading.name] : Loading,
		NotCont,
    DscLoading
	},
  directives: {
      WaterfallLower: Waterfall('lower')
  },
	created(){
    let that = this

    setTimeout(() => {
      uni.getEnv(function(res){
          if(res.plus || res.miniprogram){
              that.leftArrow = false
          }
      })
    },100)
		//评论接口
		this.onNumber()
    this.onGoodsComment()
	},
	computed: {
    goodsComment:{
      get(){
        return this.$store.state.goods.goodsComment
      },
      set(val){
        this.$store.state.goods.goodsComment = val
      }
    }
  },      
	methods:{
		onClickLeft() {
      this.$router.go(-1);
    },
    onGoodsComment(page){
      if(page){
        this.page = page
        this.size = Number(page) * 10
      }
      //商品评论接口
      this.$store.dispatch('setGoodsComment',{
        goods_id:this.$route.params.id,
        rank:this.rank,
        page:this.page,
        size:this.size
      })
    },
    onNumber(){
    	this.$http.post(`${window.ROOT_URL}api/v4/comment/title`,qs.stringify({
    		goods_id:this.$route.params.id
    	})).then(({data:{ data }})=>{
    		this.number = data
    	})
    },
    handleTabComment(val){
    	this.rank = val
      this.onGoodsComment(1)
    },
    loadMore(){
      setTimeout(() => {
        this.disabled = true
          if(this.page * this.size == this.goodsComment.length){
            this.page ++
            this.onGoodsComment() 
          }
      },200)
    }
	},
  watch:{
    goodsComment(){
      this.dscLoading = false
      if(this.page * this.size == this.goodsComment.length){
        this.disabled = false
        this.loading = true
      }else{
        this.loading = false
        this.footerCont = this.page > 1 ? true : false
      }

      this.goodsComment = arrRemove.trimSpace(this.goodsComment)
    }
  }
}
</script>
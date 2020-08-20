<template>
	<div class="user-detail">
		<div class="product-list">
        <ul>
          <li>
            <div class="product-div">
              <div class="product-list-img">
                <router-link :to="{ name: 'goods', params: { id: commentInfo.goods_id }}">
                  <img class="img" :src="commentInfo.goods_thumb" v-if="commentInfo.goods_thumb">
                  <img class="img" src="../../../assets/img/no_image.jpg" v-else>
                </router-link>
              </div>
              <div class="product-info product-info-btn">
                <h4><router-link :to="{ name: 'goods', params: { id: commentInfo.goods_id }}">{{ commentInfo.goods_name }}</router-link></h4>
                <div class="price">
                  <em>{{ commentInfo.shop_price }}</em>
                  <span>x{{ commentInfo.goods_number }}</span>
              	</div>
              	<div class="p-t-remark" v-if="commentInfo.goods_attr">{{ commentInfo.goods_attr }}</div>
              </div>
            </div>
          </li>
        </ul>
    </div>
		<div class="comment-form">
			<div class="commont-hd">
				<div class="commont-level">
					<label class="t-remark">{{$t('lang.comment')}}</label>
					<div class="evaluation-all-r">
						<span class="evaluation-star" :class="{'active':rank > 0}" @click="evaluation(1)"><i class="iconfont icon-wujiaoxing"></i></span>
						<span class="evaluation-star" :class="{'active':rank > 1}" @click="evaluation(2)"><i class="iconfont icon-wujiaoxing"></i></span>
						<span class="evaluation-star" :class="{'active':rank > 2}" @click="evaluation(3)"><i class="iconfont icon-wujiaoxing"></i></span>
						<span class="evaluation-star" :class="{'active':rank > 3}" @click="evaluation(4)"><i class="iconfont icon-wujiaoxing"></i></span>
						<span class="evaluation-star" :class="{'active':rank > 4}" @click="evaluation(5)"><i class="iconfont icon-wujiaoxing"></i></span>
					</div>
				</div>
			</div>
			<div class="commont-bd">
				<div class="text-area1">
					<ec-input type="textarea" :rows="4" :maxlength="100" name="content" :placeholder="$t('lang.comment_content_propmt')" v-model="textarea"></ec-input>
					<span>{{ textareaLength }}</span>
				</div>
			</div>
			<div class="commont-ft">
				<div class="commont-file">
					<h4>{{$t('lang.pic_info')}}</h4>
					<div class="goods-info-img-box" v-if="materialList.length > 0">
						<div class="goods-info-img" v-for="(item,index) in materialList" :key="index">
							<img :src="item" />
              <i class="iconfont icon-delete" @click="deleteImg(index)"></i>
						</div>
					</div>
					<div class="form-group">
						<van-uploader :after-read="onRead()" accept="image/jpg, image/jpeg, image/png, image/gif" multiple>
		          <div class="user-return-img">
								<h5><i class="iconfont icon-jiahao"></i></h5>
								<p>{{$t('lang.pic_picture')}}</p>
							</div>
		        </van-uploader>
					</div>
				</div>
			</div>
		</div>
		<div class="ect-button">
			<a href="javascript:;" class="btn btn-submit" @click="btnSubmit">{{$t('lang.comment_submit')}}</a>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import qs from 'qs'

import {
  Uploader,
  Toast,
  Dialog
} from 'vant'
import { Input } from 'element-ui'

export default{
	data(){
		return {
      textarea:'',
      type:0,
      rank:0,
      server:0,
      delivery:0
    }
	},
  components:{
  	'EcInput':Input,
  	[Uploader.name]:Uploader,
  	[Toast.name]:Toast,
    [Dialog.name]:Dialog
  },
  created(){
  	this.$store.dispatch('setAddcomment',{
  		rec_id:this.$route.params.id
  	})

    this.$store.dispatch('setMaterial',{
      file:[]
    })
  },
  computed:{
  	...mapState({
  		materialList: state => state.user.materialList,
  		commentInfo: state => state.user.commentInfo
  	}),
    textareaLength(){
      return 100 - this.textarea.length
    }
  },
  methods:{
  	evaluation(val){
  		this.rank = val
  	},
  	onRead(){
  		return file => {
	  		this.$store.dispatch('setMaterial',{
	  			file:file
	  		})
	  	}
  	},
  	btnSubmit(){
      if(this.textarea == ''){
        Toast(this.$t('lang.comment_not_null'))
        return false
      }else if(this.rank == 0){
        Toast(this.$t('lang.fill_in_comment_rank'))
        return false
      }else{
    		this.$store.dispatch('setAddgoodscomment',{
    			type:this.type,
    			id:this.commentInfo.goods_id,
    			content:this.textarea,
    			rank:this.rank,
    			server:this.server,
    			delivery:this.delivery,
    			order_id:this.commentInfo.order_id,
    			rec_id:this.commentInfo.rec_id,
    			pic:this.materialList
    		}).then(res=>{
          if(res.data.error == 0){
            Toast.success({
              duration: 1000,
              forbidClick: true,
              loadingType: 'spinner',
              message: this.$t('lang.comment_success')
            })

            this.$router.push({
              name:'order'
            })
          }else{
            Toast(this.$t('lang.comment_fail'))
          }
        })
      }
  	},
    deleteImg(val){
      Dialog.confirm({
          message: this.$t('lang.confirm_delete_pic'),
          className: 'text-center'
      }).then(() => {
        this.$store.dispatch('setDeleteImg',{
          index:val
        })
      })
    }
  }
}
</script>
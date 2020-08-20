<template>
	<div class="drp-set">
		<div class="padding-all f-06 color-7">{{$t('lang.basic_set')}}</div>
		<van-uploader :after-read="onRead('drpAvatar')" class="show">
			<div class="header padding-all bg-color-write p-r dis-box">
				<div class="user-img img-common">
					<img v-if="drpSetData.user_picture" class="img" :src="drpSetData.user_picture" />
					<img src="../../../../assets/img/user_default.png" v-else />
				</div>
				<div class="box-flex title">
					<h3>{{$t('lang.shop_image')}}</h3>
				</div>
				<i class="iconfont icon-more p-a f-03 color-9"></i>
			</div>
		</van-uploader>
		<div class="input-list">
			<van-field class="f-04" v-model="drpSetData.shop_name" clearable :label="$t('lang.shop_name')" :placeholder="$t('lang.shop_name_placeholder')" />
			<van-field class="f-04" v-model="drpSetData.real_name" clearable :label="$t('lang.truename')" :placeholder="$t('lang.truename_placeholder')" />
			<van-field class="f-04" v-model="drpSetData.mobile" clearable :label="$t('lang.phone_number')" maxlength="11" :placeholder="$t('lang.enter_mobile')" />
			<van-field class="f-04" v-model="drpSetData.qq" clearable label="QQ" :placeholder="$t('lang.qq_placeholder')" />
		</div>
		<div class="padding-all f-02 color-7">{{$t('lang.upload_bg_image')}}</div>
        <van-uploader :after-read="onShop('drpBg')" class="show">
            <div class="bg-color-write padding-all">
                <div class="img-common">
                    <img :src="pic" v-if="pic" />
                    <img :src="drpSetData.shop_img" v-else />
                </div>
            </div>
        </van-uploader>
		<div class="padding-all f-02 color-7">{{$t('lang.advanced_setup')}}</div>
        <div class="dis-box drp-model bg-color-write f-04">
            <div class="left-title">{{$t('lang.drp_select')}}</div>
            <van-radio-group v-model="radio" class="dis-box">
                <van-radio name="0" class="box-flex">{{$t('lang.all')}}</van-radio>
                <van-radio name="1" class="box-flex">{{$t('lang.category')}}</van-radio>
                <van-radio name="2" class="box-flex">{{$t('lang.goods')}}</van-radio>
            </van-radio-group>
        </div>
		<div class="padding-all">
			<van-button class="br-5 f-06" @click="drpSetClick" type="primary" bottom-action>{{$t('lang.confirm_update')}}</van-button>
		</div>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import {
		Toast,
		Field,
		Button,
		RadioGroup,
		Radio,
		Uploader
	} from 'vant'
	
	export default {
		name: "drp-set",
		components: {
			[Field.name]: Field,
			[Button.name]: Button,
			[Radio.name]: Radio,
			[RadioGroup.name]: RadioGroup,
			[Uploader.name]: Uploader,
			[Toast.name]: Toast
		},
		data() {
			return {
				pic:'',
				radio:'0'
			}
		},
		computed: {
			...mapState({
				drpSetData: state => state.drp.drpSetData,
			})
		},
		mounted() {
			this.onLoad()
		},
		methods: {
			onLoad(){
				this.$store.dispatch('setDrpSet')
			},
			//头像上传
			onRead(item){
		      return file => {
		        if(file.length > 1){
		            Toast(this.$t('lang.only_one_image_can_be_selected'))
		        }else{
		            this.$store.dispatch('setMaterial',{
		                file:file,
		                type:item
		            }).then(res=>{
		                this.$store.dispatch('setDrpUpdateAvatar',{
		                    pic:res.data[0],
		                    id:this.$store.state.drp.drpSetData.id
		                })
		            })
		        }
		      }      
		    },
			//店招上传
			onShop(item) {
				return file => {
			      	if(file.length > 1){
			      		Toast(this.$t('lang.only_one_image_can_be_selected'))
			      	}else{
				      	this.$store.dispatch('setMaterial',{
				            file:file,
				            type:item
				        }).then(res=>{
				        	this.pic = res.data[0]
				        })
			        }
				}
			},
			drpSetClick() {
				this.$store.dispatch('setDrpUpdate',{
					id: this.$store.state.drp.drpSetData.id,
					shop_name: this.$store.state.drp.drpSetData.shop_name,
					real_name: this.$store.state.drp.drpSetData.real_name,
					mobile: this.$store.state.drp.drpSetData.mobile,
					qq: this.$store.state.drp.drpSetData.qq,
					pic:this.pic,
					type:this.radio
				}).then(({data:data})=>{
					Toast(data.msg)
					this.$router.push({
						name:'drp'
					})
				})
			}
		},
		watch:{
			drpSetData(){
				this.radio = this.drpSetData.type.toString();
			}
		}
	};
</script>

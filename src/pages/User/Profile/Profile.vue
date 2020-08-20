<template>
  <div id="profile">
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <div class="s-user-top">
            <div class="user-bg-box-1"><img src="../../../assets/img/user-1.png" class="img"></div>
            <div class="user-bg2-box-1"><img src="../../../assets/img/user-2.png" class="img"></div>
            <div class="user_profile_box">
              <div class="user-img">
                <van-uploader :after-read="onRead('avatar')" accept="image/jpg, image/jpeg, image/png, image/gif" class="user-img-box" multiple>
                  <img :src="userInfo.avatar" alt="" class="img-height" v-if="userInfo.avatar">
                  <img src="../../../assets/img/user_default.png" alt="" class="img-height" v-else>
                </van-uploader>
              </div>
              <div class="profile-index-top">
                <h3 v-if="userInfo.name != ''">{{ userInfo.name }}</h3>
                <h3 v-else>{{ userInfo.username }}</h3>
                <p><span>{{$t('lang.username')}} </span>{{ userInfo.username }}</p>
              </div>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell :title="$t('lang.nickname')" @click="isShow('name')" v-model="userInfo.name" is-link />
      <van-cell :title="$t('lang.sex')" @click="isShow('isSex')" :value="isSex" is-link />
      <van-cell :title="$t('lang.birthday')" @click="isShow('birthday')" v-model="userInfo.birthday" is-link />
      <van-cell :title="$t('lang.address')" :to="{ name: 'address' }" is-link />
    </van-cell-group>
    <van-cell-group class="m-top10">
      <van-cell :title="$t('lang.real_name')" :to="{ name: 'realname' }" is-link />
      <van-cell :title="$t('lang.account_security')" :to="{ name: 'accountsafe' }" is-link />
    </van-cell-group>
    <van-cell-group class="m-top10">
      <van-cell :title="$t('lang.use_help')" :to="{ name: 'help' }" is-link />
    </van-cell-group>
    <!-- <div class="ect-button-more padding-all" v-if="!isWeiXin"> -->
	<div class="ect-button-more padding-all">
      <van-button size="large" tag="a" @click="handelLogout">{{$t('lang.drop_out')}}</van-button>
    </div>
    <section class="demo-popup" :class="{'active': show == true}">
      <div class="my-box">
        <template v-if="type == 'name'">
        <div class="my-box-item">
          <div class="text-all dis-box">
            <label>{{$t('lang.nickname')}}</label>
            <div class="input-text box-flex">
              <input class="j-input-text inputcard" type="text" name="name" :placeholder="$t('lang.nickname')" autocomplete="off" v-model="nick_name" />
            </div>
          </div>
        </div>
        </template>
        <template v-else-if="type == 'isSex'">
        <div class="my-box-item">
          <ul class="user-sex dis-box">
            <li class="box-flex">
              <label for="sex_1">
                <input type="radio" name="sex" value="1" id="sex_1" v-model="isSexNum">
                <i class="iconfont icon-nan my-sex-size"></i>
                <h4>{{$t('lang.male')}}</h4>
              </label>
            </li>
            <li class="box-flex">
              <label for="sex_2">
                <input type="radio" name="sex" value="2" id="sex_2" v-model="isSexNum">
                <i class="iconfont icon-nv my-sex-size"></i>
                <h4>{{$t('lang.woman')}}</h4>
              </label>
            </li>
          </ul>
        </div>
        </template>
        <template v-else>
        <div class="my-box-item">
          <div class="text-all dis-box">
            <label>{{$t('lang.birthday')}}</label>
            <div class="input-text box-flex">
              <input class="j-input-text inputcard" type="date" name="birthday" placeholder="1970-01-01" autocomplete="off" v-model="birthday" />
            </div>
          </div>
        </div>
        </template>
        <div class="ect-button-more">
          <button class="btn btn-submit" @click="updateInfo">{{$t('lang.confirm')}}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'

import { mapState } from 'vuex'
import {
  Cell,
  CellGroup,
  Button,
  Popup,
  Field,
  RadioGroup,
  Radio,
  Toast,
  Uploader
} from 'vant'

import isApp from '@/mixins/is-app'

export default{
	name:'profile',
  mixins: [isApp],
	data(){
		return{
      show:false,
      type:'name'
    }
	},
  components: {
      [Cell.name]: Cell, 
      [CellGroup.name]: CellGroup,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Toast.name]: Toast,
      [Uploader.name]: Uploader,
  },
  created(){
    this.$store.dispatch('userProfile');
  },
  computed:{
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isSexNum:{
      get(){
        return this.userInfo.sex;
      },
      set(val){
        this.$store.dispatch('userUpdateText',{
          type:'sex',
          val:val
        });
      }
    },
    nick_name:{
      get(){
        return this.userInfo.name;
      },
      set(val){
        this.$store.dispatch('userUpdateText',{
          type:'name',
          val:val
        });
      }
    },
    birthday:{
      get(){
        return this.userInfo.birthday;
      },
      set(val){
        this.$store.dispatch('userUpdateText',{
          type:'birthday',
          val:val
        });
      }
    },
    isSex(){
      let sexArr = [this.$t('lang.secrecy'), this.$t('lang.male'), this.$t('lang.woman')];
      return sexArr[this.isSexNum];
    },
    isWeiXin(){
      return isApp.isWeixinBrowser()
    }
  },
  methods:{
    isShow(val){
      this.show = true;
      this.type = val;
    },
    handelLogout(){
      this.$store.dispatch('userLogout');
      Toast.loading({
        mask: true,
        message: this.$t('lang.loading'),
        duration:1000
      },this.$router.push({path: '/login'}));
    },
    updateInfo(){
      let o = {
        sex:this.isSexNum,
        name:this.nick_name,
        birthday:this.birthday
      }

      this.$http.put(`${window.ROOT_URL}api/v4/user/profile`,qs.stringify(o)).then(res=>{
        if(res.data.status == 'success'){
          Toast.loading({
            duration:1000,
            message:this.$t('lang.edit_success') 
          })
          this.show = false
        }else{
           Toast(this.$t('lang.edit_fail'))
        }
      })
    },
    onRead(item){
      return file => {
        if(file.length > 1){
            Toast(this.$t('lang.only_one_image_can_be_selected'))
        }else{
            this.$store.dispatch('setMaterial',{
                file:file,
                type:item
            }).then(res=>{
                this.$store.dispatch('userUpdateAvatar',{
                    pic:res.data[0]
                })
            })
        }
      }      
    }
  }
}
</script>

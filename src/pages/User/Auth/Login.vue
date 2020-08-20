<template>
    <section class="con bg-color-write">
        <template v-if="!isWeiXinSta">
        <div class="user-login-box">
            <ec-form ref="loginForm" :model="loginForm" :rules="loginRules" class="user-login-form">
                <div class="user-login-head">
                    <i class="iconfont icon-back" @click="onClickHome"></i>
                    <h1>{{$t('lang.title')}}</h1>
                </div>
                <div class="user-login-ul">
                    <ec-form-item prop="username">
                        <div class="item-input dis-box">
                            <div class="label">
                                <i class="iconfont icon-user"></i>
                            </div>
                            <div class="value box-flex">
                                <ec-input type="text" size="username" v-model="loginForm.username" :placeholder="$t('lang.enter_username')"></ec-input>
                            </div>
                        </div>
                    </ec-form-item>

                    <ec-form-item prop="password">
                        <div class="item-input dis-box">
                            <div class="label">
                                <i class="iconfont icon-pwd"></i>
                            </div>
                            <div class="value box-flex">
                                <template v-if="pwdshow === true">
                                    <ec-input type="password" size="password" v-model="loginForm.password" :placeholder="$t('lang.enter_password')"></ec-input>
                                </template>
                                <template v-else>
                                    <ec-input type="input" size="password" v-model="loginForm.password" :placeholder="$t('lang.enter_password')"></ec-input>
                                </template>
                            </div>
                            <i class="iconfont icon-liulan1" :class="{'disabled' : pwdshow === true}"
                               @click="handlePwdShow()"></i>
                        </div>
                    </ec-form-item>
                    <router-link :to="{name:'register'}" class="new-register" v-if="shop_reg_closed == 0">{{$t('lang.register')}}</router-link>
                    <router-link :to="{name:'forget'}" class="list-password">{{$t('lang.forget_password')}}?</router-link>
                </div>
                <button type="button" class="btn btn-submit border-radius-top05" @click="handleLogin('loginForm')">{{$t('lang.login')}}</button>
            </ec-form>
            <div class="user-login-list" v-if="shop_reg_closed == 0">
                <router-link :to="{name:'loginMobile'}" class="list-new">{{$t('lang.sms_code_login')}}<i class="iconfont icon-more"></i></router-link>
            </div>
        </div>
        <div class="quick-login" v-if="oauthList && oauthList.length > 0 && oauthHidden && shop_reg_closed == 0">
            <p><span>{{$t('lang.thirdparty_login')}}</span></p>
            <div class="quick-login-items">
                <a href="javascript:;" @click="thirdPartyLink(item.type)" v-for="(item,index) in oauthList" :key="index"><img :src="thirdPartyImg[index]" class="img">
                </a>
            </div>
        </div>
        </template>
        <template v-else>
            <van-loading type="spinner" style="position: absolute; left: 48%; "/>
        </template>
    </section>
</template>
<script>
    import {mapState} from 'vuex'
    import {Form, Input, FormItem} from 'element-ui'
    import {Toast,Loading} from 'vant'
    import { Base64 } from 'js-base64'

    import axios from 'axios'

    import isApp from '@/mixins/is-app'
    import formProcessing from '@/mixins/form-processing'

    export default {
        name: 'login',
        mixins:[isApp,formProcessing],
        data() {
            const validateUsername = (rule, value, callback) => {
                if (value.trim().length < 1) {
                    Toast({
                        duration: 1000,
                        message: this.$t('lang.username_notic')
                    })
                } else {
                    callback()
                }
            };

            const validatePass = (rule, value, callback) => {
                if (value.trim().length < 1) {
                    Toast({
                        duration: 1000,
                        message: this.$t('lang.password_notic')
                    })
                } else {
                    callback()
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'click', validator: validateUsername}],
                    password: [{required: true, trigger: 'click', validator: validatePass}]
                },
                pwdshow: true,
                isWeiXinSta:false,
                oauthList:[],
                shop_reg_closed:''
            }
        },
        components: {
            'EcForm': Form,
            'EcFormItem': FormItem,
            'EcInput': Input,
            [Toast.name]: Toast,
            [Loading.name]: Loading
        },
        created() {
			
            let self = this
            let url = ''
            let redirect = ''
           
            if(localStorage.getItem('token')) {
                self.$router.push({
                    name:'user'
                })
            }else if(isApp.isWeixinBrowser()) {
				 // }else if(false) {
			    
                this.isWeiXinSta = true
                //如果路由上有带redirect返回目标URL
                if(this.$route.query.redirect && this.$route.query.redirect.url){
                    redirect = Base64.encode(this.$route.query.redirect.url)
					
                    url = window.API_URL + '/oauth/code?type=wechat&target_url=' + redirect
                }else{
                    url = window.API_URL + '/oauth/code?type=wechat'
                }
              
                window.location.href = url
            }else{
                //判断是否是ecjiahash
                if(this.$route.query.ecjiahash){
                    this.$store.dispatch('userRegister',{
                        ecjiahash:this.$route.query.ecjiahash
                    }).then((res)=>{
                        localStorage.setItem('token', res.data)
                        this.token = res.data
                        self.$router.push({
                            path:this.$route.query.redirect
                        })
                    })
                }

                //第三方登录
                this.thirdParty()

                this.colseRegister()
            }
        },
        mounted(){
            this.onresize()
        },
        computed: {
            ...mapState({
                status: state => state.user.status
            }),
            thirdPartyImg(){
                let arr = []
                this.oauthList.forEach((v)=>{
                    arr.push(require('../../../assets/img/'+v.type+'.png'))
                })
                return arr
            }
        },
        methods: {
            handleLogin(loginForm) {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.$store.dispatch('userLogin', this.loginForm)
                    } else {
                        Toast(this.$t('lang.username_notic'))
                        return false
                    }
                })
            },
            handlePwdShow() {
                this.pwdshow = this.pwdshow === true ? false : true
            },
            onClickHome() {
                this.$router.push({name: 'home'})
            },
            thirdParty(){
                this.$http.get(`${window.ROOT_URL}api/v4/user/oauth_list`).then(({data:{ data }})=>{
                    this.oauthList = data
                })
            },
            thirdPartyLink(type){
                window.location.href = window.API_URL + '/oauth/code?type=' + type
            },
            colseRegister(){
                this.$http.get(`${window.ROOT_URL}api/v4/user/login_config`).then(({data:{ data }})=>{
                    this.shop_reg_closed = data.shop_reg_closed
                })
            },
        },
        watch: {
            status(val, oldVal) {
                if (val === 'success') {
                    this.$router.push(this.$route.query.redirect || '/user')
                }
            },
            showHeight(){
                if(this.docmHeight > this.showHeight){
                    this.oauthHidden = true
                }else{
                    this.oauthHidden = false
                }
            }
        }
    }
</script>

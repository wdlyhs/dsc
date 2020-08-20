<template>
    <div>
        <van-cell-group>
			<van-field
			        v-model="username"
			        required
			        clearable
					type="text"
        	        maxlength="20"
			        label="用户名"
			        placeholder="请输入用户名"
			/>
			<van-field
			        v-model="password"
					type="password"
			        required
			        clearable
				
			        maxlength="20"
			        label="密码"
			        placeholder="请输入密码"
			/>
			
            <van-field
                    v-model="mobile"
                    required
                    clearable
                    type="tel"
                    maxlength="11"
                    :label="$t('lang.phone_number')"
                    :placeholder="$t('lang.enter_mobile')"
            />
            <van-field v-model="imgverifyValue" type="tel" required center clearable :label="$t('lang.pic_code')" maxlength="4" :placeholder="$t('lang.captcha_img')" v-if="captcha">
                <span class="code-box" slot="button" @click="clickCaptcha"><img :src="captcha"></span>
            </van-field>
            <van-field
                    v-model="code"
                    required
                    center
                    clearable
                    type="tel"
                    :label="$t('lang.sms_code')"
                    :placeholder="$t('lang.get_sms_code')"
                    maxlength="6"
            >   
                <template v-if="button_type">
                    <van-button slot="button" size="small" type="primary" @click="sendVerifyCode">{{$t('lang.send_sms_code')}}</van-button>
                </template>
                <template v-else><van-button slot="button" size="small">{{ button_text }}</van-button></template>
            </van-field>
        </van-cell-group>

        <van-row style="margin: 15px 0;" type="flex" justify="center">
            <van-col span="22">
                <van-button type="primary" size="large" @click="register">{{$t('lang.confirm')}}</van-button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
    import {Row, Col, Field, CellGroup, Button, Toast, Dialog, Popup} from 'vant'
    import { Base64 } from 'js-base64'
    window.API_URL = window.API_URL || '/api/v4'

    export default {
        name: 'callback',
        data() {
            return {
				username:"",
				password:"",
                mobile: '', // 手机号码
                code: '', // 短信验证码
                token: '', // 用户token
                isLoading: false,
                imgverifyValue: '', // 验证码
		        type: '', // 社会化登录类型
                unionid: '', // 用户unionid
                button_text:this.$t('lang.send_again_60'),
                button_type:true,
                target_url:''
            }
        },
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [Button.name]: Button,
            [CellGroup.name]: CellGroup,
            [Field.name]: Field,
            [Popup.name]: Popup,
        },
        computed:{
            captcha() {
                return this.$store.state.imgVerify.captcha
            },
            client() {
                return this.$store.state.imgVerify.client
            }
        },
        created() {
            let self = this
            self.isLoading = true
            self.fetchData().then(function () {
                self.isLoading = false
            })

            self.$store.dispatch('setImgVerify')
        },
        methods: {
            fetchData() {
                let self = this
                let params = self.$route.query
                if(!params.parent_id){
                    let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : null
                    if(parent_id !== null){
                        eval("params.parent_id" + "='" + parent_id + "'")
                    }
                }
                return self.$http.get(window.API_URL + '/oauth/callback', {params:params })
                    .then(function (response) {
                        let res = response.data
                        self.target_url = Base64.decode(res.data.url)
                        if (res.status === 'failed') {
                            Toast.fail({
                                duration:1000,
                                message: self.$t('lang.authorization_fail_notic')
                            })

                            setTimeout(()=>{
                                self.$router.push({name: 'login'})
                            },1000)
                        }

                        if (res.data.login === 1) {
                            localStorage.setItem('token', res.data.token)
                            window.location.href = self.target_url
                        } else {
                            self.type = res.data.type
                            self.unionid = res.data.unionid
                        }
                    })
            },
            sendVerifyCode(){
                let self = this
                let o = {
                    captcha: self.imgverifyValue,
                    client: self.client,
                    mobile: self.mobile,
					h5weixin:1
                }

                self.$store.dispatch('setSendVerify', o).then(res => {
                    if (res == 'success') {
                        self.button_type = false
                        let second = 60
                        const timer = setInterval(() => {
                            second--
                            if (second) {
                                self.button_text = self.$t('lang.send_again') + '('+ second +'s)'
                            } else {
                                this.button_type = true
                                clearInterval(timer);
                            }
                        }, 1000)
                    }else{
                        Toast.fail({
                            duration:1000,
                            message: res.errors.message
                        })
                        self.button_type = true
                        self.clickCaptcha()
                        return false
                    }
                })
            },
            register() {
                let self = this
                let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null

                let o = {
					h5weixin:1,
					password: self.password,
					username: self.username,
                    client: self.client,
                    mobile: self.mobile,
                    code: self.code,
                    type: self.type,
                    unionid: self.unionid,
                    parent_id:parent_id
                }

                if(!self.checkMobile()){
                    Toast(self.$t('lang.phone_number_format'))
                    return false
                }

                if(self.client == ''){
                    Toast(self.$t('lang.captcha_img'))
                    return false
                }

                if(self.code == ''){
                    Toast(self.$t('lang.get_sms_code_notic'))
                    return false
                }

                self.$store.dispatch('userRegister', o).then((res)=>{
                    if(res.status == 'success'){
                        self.$store.dispatch('userFastLogin', {
                            token: res.data,
                            status: res.status
                        });
                        window.location.href = self.target_url
                    }else{
                        Toast(res.errors.message)
                    }
                })
            },
            clickCaptcha() {
                this.$store.dispatch('setImgVerify')
            },
            checkMobile() {
                let rule = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
                if (rule.test(this.mobile)) {
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            'isLoading': function () {
                let self = this
                if (self.isLoading) {
                    Toast.loading({
                        mask: true,
                        message: self.$t('lang.loading')
                    })
                } else {
                    Toast.clear()
                }
            }
        }
    }
</script>
<style>
.verify .van-cell__value{ border:1px solid #dddddd; }
</style>

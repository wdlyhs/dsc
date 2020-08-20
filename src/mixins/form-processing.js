import { Toast } from 'vant'
import isApp from '@/mixins/is-app'

export default {
    mixins: [isApp],
    data(){
        return {
            docmHeight:0,
            showHeight:0,
            isResize:false,
            oauthHidden:true,
            isGuide:false
        }
    },
    methods: {
        /**
         * 点击切换单选按钮
         * @param {单选按钮属性名称} sName
         * @param {新的值} sValue
         */
        updateRadioSel(sName, sValue) {
            this.$store.dispatch('updateRadioSel', {
                modulesIndex: this.modulesIndex,
                sName: sName,
                newValue: sValue
            })
        },
        /**
         * 修改list或allValuevalue值
         * @param {*} o
         */
        updateText(o) {
            if (!isNaN(o.listIndex)) {
                o.modulesIndex = this.modulesIndex
            }
            this.$store.dispatch('updateText', o)
        },
        /**
         * 根据属性删除data.list当前索引值
         * @param { list索引值 } index
         */
        removeList(iIndex) {
            this.$store.dispatch('removeList', {
                modulesIndex: this.modulesIndex,
                listIndex: iIndex
            })
        },
        /**
         * 增加data.list一个数组
         * @param { 根据传入不同的值判断类型 } sType
         */
        addList(sType) {

            if (sType == "imgList") {
                if (localStorage.getItem("aPicture"))
                    localStorage.removeItem("aPicture")
                let o = {
                    bShowDialog: true,
                    currentPage: 1,
                    pageSize: 12,
                    oneOrMore: "more",
                    bAlbum: true,
                    modulesIndex: this.modulesIndex,
                    maxLength: this.maxLength,
                    residueLength: this.maxLength - this.onlineData.list.length
                }
                this.$store.dispatch('setDialogPicture', o)
            } else {
                let o = {
                    modulesIndex: this.modulesIndex,
                    url: "",
                    urlCatetory: "",
                    urlName: "",
                    desc: ""
                }
                this.$store.dispatch('addList', o)
            }
        },
        /**
         * 修改指定title allValue中的属性值
         * @param { 当前被修改属性 } sName
         * @param { 新的value } sValue
         */
        updateTitleText(sName, sValue) {
            let o = {
                modulesIndex: this.modulesIndex,
                dataNext: "allValue",
                attrName: sName,
                newValue: sValue
            }
            this.updateText(o)
        },
        //客服
        onChat(goods_id, shop_id, type) {
            if(localStorage.getItem('token') != null){
                this.$store.dispatch('setChat', {
                    goods_id: goods_id,
                    shop_id: shop_id ? shop_id : 0,
                    type:type
                }).then((res) => {
                    if (res.status == 'success') {
                        let url = res.data.url
                        let reg = RegExp(/wpa.qq.com/);
                        let isUrl = reg.test(url);         //判断是否是qq客服
                        let u = navigator.userAgent;
                        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

                        if(isUrl){
                            let index1 = url.indexOf("&uin="); //截取字符串位置1
                            let index2 = url.indexOf("&site="); //截取字符串位置2
                            let qq = url.substring((index1+5),index2); //客服qq号
                            if(isiOS){
                                if(isApp.isWeixinBrowser()){
                                    window.location.href = url;
                                }else{
                                    window.location.href = 'mqq://im/chat?chat_type=wpa&uin='+ qq +'&version=1&src_type=web';
                                }
                            }else{
                                window.location.href = url;
                            }
                        }else{
                            window.location.href = url;
                        }
                    } else {
                        Toast(res.errors.message)
                    }
                })
            }else{
                Toast(this.$t('lang.login_user_not'));
            }
        },
        onresize(){
            window.onresize = () => {
                console.log(111)
                return (() => {
                    if(!this.isResize){
                        this.docmHeight = document.documentElement.clientHeight
                        this.isResize = true
                    }
                    this.showHeight = document.body.clientHeight
                })()
            }
        },
        clickGuide(){
            //wx浏览器指引到普通浏览器
            this.isGuide = false
        }
    },

}

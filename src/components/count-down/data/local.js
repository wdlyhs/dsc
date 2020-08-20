import i18n from '@/locales'
export default {
    module: "count-down",
    componentName: "秒杀活动",
    suggest: "",
    setting: "0",
    data: {
        showStyle: [{
            key: "0",
            type: "radio",
            title: i18n.t('lang.default'),
        }, {
            key: "1",
            type: "radio",
            title: "图文",
        }],
        allValue:{
            number:10
        },
        list:[],
        isShowStyle:"0"
    }
}

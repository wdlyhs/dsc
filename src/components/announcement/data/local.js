import i18n from '@/locales'
export default {
    module: "announcement",
    componentName: i18n.t('lang.announcement'),
    suggest: "",
    setting: "1",
    data: {
        showStyle: [{
            key: "0",
            type: "radio",
            title: i18n.t('lang.news_model'),
        }, {
            key: "1",
            type: "radio",
            title: i18n.t('lang.notice_patterns'),
        }],
        showDate: [{
            key: "0",
            type: "radio",
            title: i18n.t('lang.show')
        }, {
            key: "1",
            type: "radio",
            title: i18n.t('lang.hide')
        }],
        allValue: {
            number: 10,
            img: "",
            announContent: i18n.t('lang.content'),
            optionCascaderVal:""
        },
        img: "",
        isStyleSel: "0",
        isDateSel: "0",
    }
}

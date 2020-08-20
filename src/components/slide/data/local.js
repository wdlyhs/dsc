import i18n from '@/locales'
export default {
    module: "slide",
    componentName: i18n.t('lang.slide'),
    suggest: "",
    setting: "0",
    data: {
        showStyle: [{
            key: "0",
            type: "radio",
            title: i18n.t('lang.slide_show_1'),
            picSizeKey: ["0"]
        }, {
            key: "1",
            type: "radio",
            title: i18n.t('lang.slide_show_2'),
            picSizeKey: ["0", "1"]
        }, 
        // {
        //     key: "2",
        //     type: "radio",
        //     title: i18n.t('lang.slide_show_3'),
        //     picSizeKey: ["0"]
        // }
        ],
        picSize: [{
            key: "0",
            type: "radio",
            title: i18n.t('lang.max_image')
        }, {
            key: "1",
            type: "radio",
            title: i18n.t('lang.min_image'),
        }, {
            key: "3",
            type: "radio",
            title: i18n.t('lang.min_image'),
        }],
        allValue:{
            number:1
        },
        list: [],
        isStyleSel: "0",
        isSizeSel: "0"
    }
}

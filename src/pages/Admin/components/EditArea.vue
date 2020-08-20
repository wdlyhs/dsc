<template>
    <div id='edit-area'>
        <header>
            <h4>{{ editArea.text }}</h4>
            <div class="compontent-tool">
                <label @click="removeModules" for="">
                    <i class="iconfont" :class="'icon-'+editArea.function.clear.icon"></i>{{$t('lang.empty')}}
                </label>
                <label for="" v-if="!bStore && sDefault != 0" @click.stop="restoreModules">
                    <i class="iconfont" :class="'icon-'+editArea.function.restore.icon"></i>{{$t('lang.restore')}}
                </label>
                <label @click="saveModules" for="">
                    <i class="iconfont" :class="'icon-'+editArea.function.save.icon"></i>{{$t('lang.storage')}}
                </label>
            </div>
        </header>
        <div class="edit-area-con" :class="{no:!isMoudles}">
            <div style="height:auto">
                <draggable v-model="modules" style="min-height:10rem; height:auto;" :options="{group:'people',handle:'.handle'}" @start="isDragging=true" @add="onDraggAdd($event)" :move="onDraggMove" @end="isDragging=false">
                    <component class="component" v-for="(item,index) in modules" :key="index" :is="'b-'+item.module" :modules-index="index" :onlineData="item.data" :setting="item.setting" :data-index="index">
                    </component>
                </draggable>
            </div>
        </div>
    </div>
</template>
<script>
//node library
import qs from 'qs'
// mapActions mapState
import {
    mapActions,
    mapState
} from 'vuex'

// third party libraries
import html2canvas from 'html2canvas'

// custom components
import BSlide from '@/components/slide/Backend'
import BTitle from '@/components/title/Backend'
import BAnnouncement from '@/components/announcement/Backend'
import BNav from '@/components/nav/Backend'
import BLine from '@/components/line/Backend'
import BBlank from '@/components/blank/Backend'
import BJigsaw from '@/components/jigsaw/Backend'
import BProduct from '@/components/product/Backend'
import BCoupon from '@/components/coupon/Backend'
import BCountDown from '@/components/count-down/Backend'
import BButton from '@/components/button/Backend'
import BSearch from '@/components/search/Backend'
import BStore from '@/components/store/Backend'
import BShopSigns from '@/components/shop-signs/Backend'
import BTabDown from '@/components/tab-down/Backend'

// third party components
import {
    MessageBox,
    Message,
    Loading
} from 'element-ui'

import draggable from 'vuedraggable'

export default {
    name: 'edit-area',
    components: {
        draggable,
        MessageBox,
        Message,
        BSlide,
        BTitle,
        BAnnouncement,
        BNav,
        BLine,
        BBlank,
        BJigsaw,
        BProduct,
        BCoupon,
        BCountDown,
        BButton,
        BSearch,
        BStore,
        BShopSigns,
        BTabDown,
        Loading,
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        generateImage() {
            return new Promise((resolove, reject) => {
                let divImg = document.getElementById("j-phone-edit")
                html2canvas(divImg, {
                    proxy: window.ROOT_URL + `html2canvasproxy.php`, //跨域支持
                    width: 318,
                    height: 366,
                    background: "#fff",
                    useCORS: true
                }).then(canvas => {
                    resolove(canvas.toDataURL())
                }).catch(err => {
                    reject(false)
                    console.log(err)
                })
            })
        },
        loadImage() {
        },
        onDraggMove({ relatedContext, draggedContext }) {
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element

        },
        onDraggAdd(e) {
            let moduleName = e.item.getAttribute("data-module")
            e.item.outerHTML = "" //拖拽添加后删除该内容'
            this.$store.dispatch('navHiddenTab')//拖拽放置结束影藏下拉框
            this.$store.dispatch('addModules', {
                newIndex: e.newIndex,
                module: this.cloneModules(moduleName)
            })
        },
        cloneModules(moduleName) {
            delete require.cache[require.resolve(`@/components/${moduleName}/data/online`)];
            return require(`@/components/${moduleName}/data/online`);
        },
        removeModules() {
            if (this.isMoudles) {
                MessageBox.confirm(this.$t('lang.remove_modules_confirm'), this.$t('lang.hint'), {
                    confirmButtonText: this.$t('lang.confirm'),
                    cancelButtonText: this.$t('lang.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('removeAllModules')
                    Message.success(this.$t('lang.empty_success'))
                }).catch(err => {
                    Message.info(this.$t('lang.cancelled_operation_1'))
                });
            } else {
                Message.warning(this.$t('lang.no_data'))
            }
        },
        saveModules() {
            let sModules = JSON.stringify(this.modules)
            let localModules = ""
            if (localStorage.getItem("modules")) {
                localModules = localStorage.getItem("modules")
            }
            if (sModules != localModules) {
                MessageBox.confirm(this.$t('lang.is_save_current_mod'), this.$t('lang.hint'), {
                    confirmButtonText: this.$t('lang.confirm'),
                    cancelButtonText: this.$t('lang.cancel'),
                    type: 'warning'
                }).then(() => {
                    let loadingInstance = Loading.service({ fullscreen: true, text: this.$t('lang.data_passing') });
                    this.generateImage().then(resImage => {
                        this.$http.post(`/${window.apiAuthority}/touch_visual/save`, qs.stringify({
                            id: this.modulesId,
                            data: sModules,
                            pic: resImage
                        })).then(res => {
                            if (res.data.error == 0) {
                                Message.success(this.$t('lang.save_success_1'))
                                this.$store.dispatch('updatePagePic', {
                                    pic: resImage,
                                    id: this.modulesId,
                                })
                                loadingInstance.close()
                                localStorage.setItem("modules", JSON.stringify(this.modules))
                            } else {
                                Message.error(this.$t('lang.save_fail_1'))
                            }
                        }).catch(err => {
                            Message.error(this.$t('lang.save_fail_1'))
                        })
                    }, rej => {
                        Message.error(this.$t('lang.pic_generat_fail'))
                    })
                }).catch(() => {
                    Message.info(this.$t('lang.cancelled_operation_1'))
                })
            } else {
                Message.warning({
                    message:this.$t('lang.current_page_not_edit')
                })
            }
        },
        restoreModules() {
            MessageBox.confirm(this.$t('lang.restore_modules_confirm'), this.$t('lang.hint'), {
                confirmButtonText: this.$t('lang.confirm'),
                cancelButtonText: this.$t('lang.cancel'),
                type: 'warning'
            }).then(() => {
                let loadingInstance = Loading.service({ fullscreen: true, text: this.$t('lang.data_passing') });
                this.$http.post(`/${window.apiAuthority}/touch_visual/restore`).then(({ data: { keep: { data } } }) => {
                    loadingInstance.close()
                    this.$store.dispatch('updateModules', {
                        modules: JSON.parse(data)
                    })
                })
            }).catch(err => {
                console.error()
            })
        }
    },
    computed: {
        isMoudles() {
            return 0 < this.modules.length ? true : false
        },
        ...mapState({
            editArea: state => state.dashboard.configInfo.editArea,
            bUpdateModules: state => state.dashboard.bUpdateModules,
            modulesId: state => state.pageSetting.modulesId,
            menuComponent: state => state.dashboard.configInfo.headerMenu.menuComponent,
            sDefault: state => state.pageSetting.default
        }),
        bStore() {
            return window.shopInfo.ruid != 0
        },
        modules: {
            get() {
                return this.$store.state.modules
            },
            set(value) {
                this.$store.dispatch('updateModules', {
                    modules: value
                })
            }
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../../../assets/style/config';
@import '../../../assets/style/mixins/common';
header {
    height: ($tab-height+.4rem);
    background: $tool-bg;
    padding: 0 1rem;
    @include direction(center, space-between)
}

header h4 {
    float: left;
    font-weight: normal;
    font-size: $tool-title-size
}

header .compontent-tool {
    float: right;
}

header .compontent-tool label {
    margin-left: $icon-margin * 1.5;
    color: #555;
    cursor: pointer;
    font-size: 1.4rem;
}

header .compontent-tool label i.iconfont {
    margin-right: ($icon-margin)
}

.edit-area-con {
    background: $write-color;
    position: absolute;
    width: 100%;
    padding: 1.4rem;
    top: ($tab-height+.4rem);
    bottom: 0rem;
    overflow-y: scroll;
}

.edit-area-con.no {
    background: url('../../../assets/img/admin_edit.jpg') no-repeat center center;
}

.component {
    margin-bottom: .8rem
}

.component:last-child {
    margin-bottom: 0;
}

.component.hidden {
    visibility: hidden;
}

.flip-list-move {
    transition: transform 0.5s;
}
</style>
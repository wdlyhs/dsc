<template>
    <div class='b-store'>
        <component-con :modules-index="modulesIndex" :component-name="componentName" :setting="setting">
            <div class="form-group">
                <label class="group-l">
                    {{$t('lang.label_display_number')}}
                </label>
                <div class="group-r">
                    <ec-input type="number" size="small" v-model="number" :placeholder="$t('lang.store_number_placeholder')"></ec-input>
                    <p class="ec-remark">{{$t('lang.store_prompt_1')}}</p>
                </div>
            </div>
        </component-con>
    </div>
</template>

<script>
// custom components
import ComponentCon from '../element/ComponentCon'

// third party components
import {
    CheckboxGroup,
    Checkbox,
    Radio,
    RadioGroup,
    Input,
    DatePicker
} from 'element-ui'

// minxin
import formProcessing from '@/mixins/form-processing'

// localData
import localData from './data/local'

export default {
    name: 'b-store',
    props: ['setting', 'onlineData', 'modulesIndex'],
    mixins: [formProcessing],
    data() {
        return {
            componentName: localData.componentName
        }
    },
    components: {
        Radio,
        Checkbox,
        CheckboxGroup,
        RadioGroup,
        ComponentCon,
        "EcInput": Input,
        DatePicker,
    },
    mounted() {

    },
    computed: {
        number: {
            get() {
                return this.data.allValue.number < 1 ? 1 : this.data.allValue.number
            },
            set(value) {
                if (value < 1) {
                    value = 1
                }
                this.updateTitleText('number', Number(value))
            }
        },
        data() {
            return Object.assign({}, localData.data, this.onlineData)
        }
    }
}

</script>

<style scoped>

</style>
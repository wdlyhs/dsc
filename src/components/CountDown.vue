<template>
    <div :endTime="endTime" :callback="callback" :endText="endText">
        <slot>
            <p v-html="content"></p>
        </slot>
    </div>
</template>
<script>
import i18n from '@/locales'
export default {
    data(){
      return {
        content: '',
      }
    },
    props:{
        endTime:{
          type:Number,
          default:''
        },
        endText:{
          type:String,
          default: i18n.t('lang.has_ended')
        },
        callback:{
          type:Function,
          default:function(){}
        }
    },
    mounted(){
      this.countdowm(this.endTime)
    },
    methods: {
       countdowm(timestamp){
        let self = this;
        let timer = setInterval(function(){
            let nowTime = new Date();
            let endTime = new Date((timestamp+3600*8) * 1000); //加8小时
            let t = endTime.getTime() - nowTime.getTime();
            if(t>0){
                let day = Math.floor(t/86400000);
                let hour= Math.floor((t/3600000)%24);
                let min = Math.floor((t/60000)%60);
                let sec = Math.floor((t/1000)%60);
                day = day < 10 ? "0" + day : day;
                hour = hour < 10 ? "0" + hour : hour;
                min = min < 10 ? "0" + min : min;
                sec = sec < 10 ? "0" + sec : sec;
                let format = '';
                if(day > 0){
                   format =  `<span>${day}</span><i>:</i><span>${hour}</span><i>:</i><span>${min}</span><i>:</i><span>${sec}</span>`;
                }
                if(day <= 0 && hour > 0 ){
                   format = `<span>${hour}</span><i>:</i><span>${min}</span><i>:</i><span>${sec}</span>`;
                }
                if(day <= 0 && hour <= 0){
                   format =`<span>${min}</span><i>:</i><span>${sec}</span>`;
                }
                self.content = format;
                }else{
                  clearInterval(timer);
                  self.content = self.endText;
                  self._callback();
                }
             },1000);
           },
           _callback(){
           if(this.callback && this.callback instanceof Function){
            this.callback(...this)
            }
        }
    }
}
</script>
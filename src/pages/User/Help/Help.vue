<template>
	<div class="user_help">
		<section v-for="(item,index) in articleHelpList" :key="index">
			<h2 class="van-title">{{ item.cat_name }}</h2>
			<van-cell-group>
		    <van-cell :title="listItem.title" :to="{name:'articleDetail',params:{id:listItem.article_id}}" is-link v-for="(listItem,listIndex) in item.list" :key="listIndex" />
		  </van-cell-group>
	  </section>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import {
  Cell,
  CellGroup,
  Button,
  Popup,
  Field,
  RadioGroup,
  Radio,
  Panel
} from 'vant'

export default{
	data(){
		return{}
	},
  components: {
    [Cell.name]: Cell, 
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Panel.name]: Panel,
  },
  created(){
  	this.$store.dispatch('setArticleHelp')
  },
  computed:{
  	...mapState({
  		articleHelpList: state => state.user.articleHelpList
  	})
  },
  watch:{
  	articleHelpList(){
  		console.log(this.articleHelpList)
  	}
  }
}
</script>
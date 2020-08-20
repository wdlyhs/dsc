<template>
	<section class="secrch">
		<form @submit.prevent>
			<div class="secrch-warp">
				<div class="back" @click="onClickLeft" v-if="!app"><i class="iconfont icon-back"></i></div>
				<div class="input-text">
					<template v-if="isSearch">
						<input class="j-input-text" type="search" name="keyword" autocomplete="off" v-model="keyword" v-focus :placeholder="placeholder" @keypress="search">
					</template>
					<template v-else>
						<input class="j-input-text" type="search" name="keyword" autocomplete="off" :placeholder="placeholder" readonly="!isSearch" @keypress="search" @click="routeSearch">
					</template>
					<label class="search-check"><i class="iconfont icon-search"></i></label>
				</div>
				<template v-if="isFilter">
					<div class="mode-switch" @click="viewSwitch">
						<template v-if="myMode === 'small'">
							<i class="iconfont icon-viewlist"></i>
						</template>
						<template v-else>
							<i class="iconfont icon-pailie"></i>
						</template>
					</div>
				</template>
				<template v-else>
					<a href="javascript:void(0);" class="btn-submit search-btn" @click="secrchBtn" v-if="isSearch">{{$t('lang.search')}}</a>
				</template>
			</div>
		</form>
	</section>
</template>

<script>
export default{
	props:['mode','isFilter','placeholder','placeholderState','app'],
	data(){
		return{
			myMode:this.mode,
			keyword:'',
			arr:[]
		}
	},
	created(){
	},
	directives:{
		focus:{
			inserted:(el)=>{
				el.focus()
			}
		}
	},
	computed:{
		isSearch(){
			return this.$route.name == 'search' ? true : false
		}
	},
	methods:{
		getGoodGroup(arr){
			let hash = {};
			let col = 0;
			let res = [];

			arr.forEach(function(item){
				var goods_id = item.goods_id;

				if(hash[goods_id]){
					res[hash[goods_id]-1].price.push(item.price)
				}else{
					hash[goods_id] = ++ col
					res.push({
						goods_id:goods_id,
						price:[item.price]
					})
				}
			})

			return res
		},
		viewSwitch(){
			this.myMode = this.myMode === 'small' ? 'medium' : 'small'
			this.$emit('getViewSwitch',this.myMode)
		},
		search(event){
			if (event.keyCode == 13) {
                event.preventDefault(); //禁止默认事件（默认是换行）
                this.keyword = event.target.value;
                this.secrchBtn();
            }
		},
		secrchBtn(){
			this.keyword = this.keyword.replace(/\s*/g,"");

			if(!this.keyword && this.placeholderState == 1){
				this.$router.push({
					name:'searchList',
					query:{
						keywords:this.placeholder
					}
				})
				
				return 
			}
			
			if(this.keyword){
				this.arr.push(this.keyword)
			}

			let latelyKeyword = JSON.parse(localStorage.getItem('LatelyKeyword'))

			if(latelyKeyword){
				this.arr = this.unique(this.arr.concat(latelyKeyword))
			}

			if(this.arr.length > 0){
				localStorage.setItem('LatelyKeyword',JSON.stringify(this.arr))

				this.$router.push({
					name:'searchList',
					query:{
						keywords:this.keyword
					}
				})
			}
		},
		onClickLeft(){
			this.$router.go(-1);
		},
		routeSearch(){
			this.$router.push({ name:'search' })
		},
	    unique(arr){
	      //去除重复项
	      var result = [], hash = {};
	      // for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	      //   if (!hash[elem]) {
	      //     result.push(elem);
	      //     hash[elem] = true;
	      //   }
	      // }

	      for(var i = 0;i<arr.length;i++){
	      	if(!hash[arr[i]]){
	      		hash[arr[i]] = true
	      		result.push(arr[i])
	      	}
	      }

	      return result;
	    },
	    quickSort(arr){
	    	if(arr.length<=1){
	    		return arr
	    	}

	    	var index = Math.floor(arr.length/2);
	    	var temp = arr.splice(index,1);
	    	var left = [];
	    	var right = [];

	    	for(var i = 0; i<arr.length; i++){
	    		if(arr[i]<temp){
	    			left.push(arr[i]);
	    		}else{
	    			right.push(arr[i]);
	    		}
	    	}

	    	return this.quickSort(left).concat(temp,this.quickSort(right))
	    }
	}
}
</script>
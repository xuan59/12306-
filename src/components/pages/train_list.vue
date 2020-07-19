<template>
    <div class="list">
        <div class="top">
            <div style="padding:10px;height:20px;">
                <van-icon name="arrow-left" @click="back" style="float:left" color="#fff" size="20px" />
                <span style="color:#fff;">
                    {{ this.fromData.startStation }}
                    <img src="@/assets/image/arrow.png">
                    {{ this.fromData.endStation }}
                </span>
                <span style="float:right;color:#fff;">抢票</span>
            </div>
        </div>
        <div class="list-content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell class="train-detail" v-for="item in list" :key="item" :title="item" />
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>
        
<script>
export default {
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            refreshing: false,
            student: false,
            fromData:{
                'trains': '',
                'startStation': '',
                'endStation':'',
                'startTime': ''
            }

            
        };
    },
    watch: {},
    methods: {
        back(){
            this.$router.go(-1)
        },
        onLoad() {
            setTimeout(() => {
                if (this.refreshing) {
                    this.list = [];
                    this.refreshing = false;
                }

                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1);
                }
                this.loading = false;

                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 1000);
        },
        onRefresh() {
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.onLoad();
        }
    },
    created() {
        
        this.fromData.startStation = this.cookie.get('origin')
        this.fromData.endStation = this.cookie.get('destination')
        var dates = this.cookie.get('date')
        this.student = this.$route.params.student
        if(this.$route.params.bulletTrain == true){
            this.fromData.trains = 'G,D'
        }
        console.log(dates)
        if(this.cookie.get('oneWay') == '单程'){
            this.fromData.startTime = new Date(dates)
            var now = new Date()
            now.setTime(now.getTime + 1000 * 60 * 30)
            if(this.fromData.startTime < now){
                this.fromData.startTime = now
            }
            this.axios.post('/trainInfo/selectList', this.fromData).then(data => {
                console.log(data)
            })
        }else{
            this.fromData.startStation = this.cookie.get('destination')
            this.fromData.endStation = this.cookie.get('origin')
        }

        console.log(this.fromData)
    }
};
</script>

<style scoped>
    .list{
        background: #f7f7f7;
        overflow: hidden;
        height: 100%;
    }
    .top{
        width: 100%;
        height: 100px;
        background: #3464ff;
    }
    .list-content{
        overflow-y: scroll;
        height: calc(100% - 100px);
    }
    .train-detail{
        border-radius: 5px;
        margin: 5px;
        width: calc(100% - 10px);

    }
    .arrow{
        
        transform: rotate(-90deg);
        width: 11px;
    }


</style>
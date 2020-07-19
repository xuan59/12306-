<template>
    <div style="height:100%;background:#f5f5f5;">
        <div class="main">
            <div style="z-index:1;position:fiexd;">
                <van-swipe :autoplay="3000" style="height:200px">
                    <van-swipe-item v-for="(image, index) in images" :key="index">
                        <img v-lazy="image" :src="image" class="lunbo" />
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="main-search">
                <van-tabs
                    v-model="type"
                    class="type"
                    type="card"
                    color="#fff"
                    background="rgba(191, 3, 3, 0.83)"
                    title-active-color="#000"
                >
                    <van-tab title="机票"></van-tab>
                    <van-tab title="国内火车"></van-tab>
                    <van-tab title="汽车票"></van-tab>
                </van-tabs>

                <van-tabs @click="trip">
                    <van-tab title="单程"></van-tab>
                    <van-tab title="往返"></van-tab>
                </van-tabs>
                <div>
                    <div class="city left" @click="changeShowCity(1)" v-text="origin"></div>
                    <van-icon @click="changeTrip" class="travel-switch" name="exchange" />
                    <div class="city right" @click="changeShowCity(2)" v-text="destination"></div>
                </div>
                <div style="height:40px;">
                    <div class="city left" @click="showDate1 = true" v-text="originDate"></div>
                    <div
                        class="city right"
                        @click="showDate1 = true"
                        v-text="destinationDate"
                        v-show="oneWay=='往返'"
                    ></div>
                </div>
                <div>
                    <van-checkbox class="left" v-model="student" checked-color="#07c160">学生票</van-checkbox>
                    <van-checkbox class="right" v-model="bulletTrain" checked-color="#07c160">高铁动车</van-checkbox>
                </div>
                <div style="padding:10px;">
                    <van-button
                        class="search"
                        color="rgba(191, 3, 3, 0.83)"
                        round
                        block
                        type="info"
                        size="small"
                        @click="toList"
                    >查询</van-button>
                </div>
            </div>

            <div class="recommend">
                <van-divider content-position="left">为您推荐</van-divider>
                <div class="attractions" v-for="(tem, index) in recommendData" :key="index">
                    <img width="100%" height="100px" :src="tem.url" />
                    <div class="attractions-city">
                        <b v-text="tem.city"></b>
                    </div>
                    <div class="attractions-describe" v-text="tem.describe"></div>
                </div>
            </div>
        </div>
        <van-calendar
            v-if="this.oneWay=='单程'"
            v-model="showDate1"
            :show-confirm="false"
            @confirm="onConfirm"
        />
        <van-calendar
            v-else
            v-model="showDate1"
            type="range"
            :show-confirm="false"
            @confirm="onConfirm"
        />

        <van-popup
            v-model="showCity"
            position="bottom"
            sticky
            :style="{ height: '100%' , width: '100%', background: '#f5f5f5'}"
        >
            <div>
                <van-icon class="back" name="arrow-left" @click="showCity = false" />
                <van-search
                    v-model="searchCity"
                    style="calc(100% - 40px);height:54px"
                    shape="round"
                    placeholder="请输入搜索关键词"
                />
            </div>
            <van-index-bar :index-list="indexList">
                <div v-for="(city, index) in cityList" :key="index">
                    <van-index-anchor  :index="city.name" ></van-index-anchor>
                    <div style="background:#fff;width:100%;" v-if="index<2&&searchCity==''">
                     <van-button type="default" style="background-color:#f6f6f6;margin:5px;border:none;" v-for="(tem, index) in city.cities" :key="index" :text="tem.name" @click="changeCity(tem.name)" ></van-button>
                    </div>
                    <div v-else> 
                    <van-cell v-for="(tem, index) in city.cities" :key="index" :title="tem.name" @click="changeCity(tem.name)"></van-cell>
                    </div>
                </div>
            </van-index-bar>
        </van-popup>

        <van-tabbar v-model="active" route>
            <van-tabbar-item badge="3" to="/index">
                <span>自定义</span>
                <template #icon="props">
                    <img :src="props.active ? icon.active : icon.inactive" />
                </template>
            </van-tabbar-item>
            <van-tabbar-item icon="search" to="/home">标签</van-tabbar-item>
            <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { cityData } from "../assets/js/city";
import { IndexBar, IndexAnchor, ContactList } from "vant";
export default {
    data() {
        return {
            oneWay: "单程",
            type: 1,
            active: 0,
            origin: '',
            isOrigin: true,
            destination: '',
            originDate: '',
            destinationDate: '',
            day:['日','一','二','三','四','五','六'],
            date: '',
            showDate1: false,
            showDate2: false,
            showCity: false,
            searchCity: "",
            cityList: [],
            indexList: [],
            icon: {
                active: "https://img.yzcdn.cn/vant/user-active.png",
                inactive: "https://img.yzcdn.cn/vant/user-inactive.png"
            },
            images: [
                "http://localhost:8888/image/dongche.jpg",
                "http://localhost:8888/image/duanwu.jpg"
            ],
            student: false,
            bulletTrain: false,
            recommendData: [
                {
                    city: "重庆",
                    url:
                        "http://localhost:8888/image/hongyadong.jpg",
                    describe:
                        "洪崖洞原名洪崖门，是古重庆城门之一，位于重庆市渝中区解放碑沧白路，地处长江、嘉陵江两江交汇的滨江地带，是兼具观光旅游、休闲度假等功能的旅游区"
                },
                {
                    city: "重庆",
                    url:
                        "http://localhost:8888/image/hongyadong.jpg",
                    describe:
                        "洪崖洞原名洪崖门，是古重庆城门之一，位于重庆市渝中区解放碑沧白路，地处长江、嘉陵江两江交汇的滨江地带，是兼具观光旅游、休闲度假等功能的旅游区"
                }
            ]
        };
    },
    methods: {
        trip(name, title) {
            this.oneWay = title;
        },
        changeTrip() {
            var city = this.origin;
            this.origin = this.destination;
            this.destination = city;
        },
        setDate(date){
            if (this.oneWay == "单程") {
                var week = date.getDay();
                this.originDate =
                    date.getMonth() + 1 + "月" + date.getDate() + "日 周" + this.day[week];
            } else {
                var week = date[0].getDay();
                var week2 = date[1].getDay();
                this.originDate =
                    date[0].getMonth() + 1 + "月" + date[0].getDate() + "日 周" + this.day[week];
                this.destinationDate =
                    date[1].getMonth() + 1 + "月" + date[1].getDate() + "日 周" + this.day[week2];
            }
        },
        onConfirm(date) {
            this.date = date
            this.setDate(date)
            this.showDate1 = false;
        },
        changeShowCity(type){
            this.showCity = true
            if(type == 1){
                this.isOrigin = true
            }else{
                this.isOrigin = false
            }
        },
        changeCity(city){
            if(this.isOrigin){
                this.origin = city
            }else{
                this.destination = city
            }
            this.showCity = false
        },
        toList(){
            this.cookie.set('oneWay', this.oneWay)
            this.cookie.set('origin', this.origin)
            this.cookie.set('destination', this.destination)
            this.cookie.set('date', this.date)
            this.$router.push({
                name:'TrainList',
                params:{
                    'student': this.student,
                    'bulletTrain': this.bulletTrain,
                }
            })
        }
    },
    created() {
        this.cityList = []
        var a = JSON.stringify(cityData)
        this.indexList.push('历史')
        this.cityList.push({
            name: '历史',
            cities: [
                {
                    name: "北京",
                    tags: "BEIJING,北京",
                    cityid: 1
                },
                {
                    name: "重庆",
                    tags: "CHONGQING,重庆",
                    cityid: 18
                },
            ]
        })
        var c = JSON.parse(a)
        c.forEach(data=>{
            this.indexList.push(data.name)
            this.cityList.push(data)
        })

        this.oneWay = this.cookie.get('oneWay')
        this.origin = this.cookie.get('origin')
        this.destination = this.cookie.get('destination')
        var dates = this.cookie.get('date').split(",")
        if(dates.length == 1){
            this.date = new Date(dates[0])
        }else if(dates.length == 2){
            this.date[0] = new Date(dates[0])
            this.date[1] = new Date(dates[1])
        }else{
            this.date = new Date()
        }
        this.setDate(this.date)
    },
    watch: {
        searchCity:function(search){
            this.cityList = []
            this.indexList = []
            var a = JSON.stringify(cityData)
            var data = JSON.parse(a)
            var i = 0
            data.forEach(data => {
                if(i == 0 && search == ''){
                    i = 1
                    this.indexList.push('历史')
                    this.cityList.push({
                            name: '历史',
                            cities: [
                                {
                                    name: "北京市",
                                    tags: "BEIJING,北京市",
                                    cityid: 1
                                },
                                {
                                    name: "重庆市",
                                    tags: "CHONGQING,重庆市",
                                    cityid: 18
                                },
                            ]
                        })
                }
                if(i == 0 && search != ''){
                    i = 1

                }else{
                    var b = data.cities.filter(item => item.name.toLowerCase().includes(search) || item.tags.toLowerCase().includes(search))
                    if(b.length > 0){
                        this.cityList.push({
                            name: data.name,
                            cities: b
                        })
                        this.indexList.push(data.name)
                    }
                }
            });
        
        }
    }

};
</script>

<style scoped>
.main {
    height: calc(100% - 50px);
    /* margin-bottom: 20px; */
    overflow: scroll;
}
.lunbo {
    height: 200px;
    width: 100%;
}

.city {
    width: 30%;
    height: 30px;
    margin-top: 20px;
    border-bottom: 1px solid;
    border-bottom-color: #f7f7f7;
}
.travel-switch {
    font-size: 20px;
    margin-top: 20px;
    color: #01b5ea;
}
.van-checkbox {
    width: 100px;
    margin-top: 10px;
    text-align: center;
}
.left {
    clear: left;
    float: left;
    margin-left: 30px;
    text-align: left;
}
.right {
    float: right;
    margin-right: 30px;
    text-align: right;
}
.search {
    margin-top: 20px;
    display: inline-block;
    width: 80%;
}
.main-search {
    border-radius: 10px;
    background: #fff;
    margin: -20px 10px;
    z-index: 2;
    position: relative;
    width: calc(100% - 20px);
}
.recommend {
    padding: 10px;
}
.attractions {
    width: calc(50% - 20px);
    /* height: 200px; */
    background: #fff;
    overflow: hidden;
    float: left;
    margin: 10px;
}
.attractions-describe {
    text-align: left;
    color: rgb(204, 204, 204);
    font-size: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    padding: 0 5px;
}
.attractions-city {
    text-align: left;
    padding-left: 10px;
}
.back {
    float: left;
    padding: 0 10px;
    line-height: 50px;
    background: #fff;
    height: 54px;
}
.van-index-bar{
    text-align: left;
}
</style>

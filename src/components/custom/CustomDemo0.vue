<template>
    <div class="energy-consumption-info">
        <div style="height:60px"></div>
        <div class="detail">
            <div class="detail-left">
                <div class="custom-panel0">
                    <div class="custom-panel0-title">今日用电</div>
                    <div class="custom-panel0-content">
                        <span class="custom-panel0-value">4,033</span>
                        <span class="custom-panel0-unit">kwh</span>
                    </div>
                </div>
                <div class="custom-panel0">
                    <div class="custom-panel0-title">今日用水</div>
                    <div class="custom-panel0-content">
                        <span class="custom-panel0-value">122</span>
                        <span class="custom-panel0-unit">m³</span>
                    </div>
                </div>
            </div>
            <div class="detail-middle">
                <div class="chart" ref="chart"></div>
            </div>
            <div class="detail-right">
                <div class="custom-panel1">
                    <img src="../../assets/images/ico1.png" alt="" srcset="">
                    <div>
                        <div class="custom-panel1-title">年度总用电(kwh)</div>
                        <div class="custom-panel1-value">2,373,442</div>
                        <div class="custom-panel1-content" :class="{'up':yearElecRate>0}">
                            <span>环比</span>
                            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M528.252661 950.942077l295.703769-289.705148c9.624195-9.380648 9.624195-24.707728 0-34.138518-9.576099-9.381671-25.222451-9.381671-34.848693 0L535.495622 875.592972 535.495622 88.901773c0-13.3214-11.048637-24.142863-24.642237-24.142863-13.597693 0-24.645306 10.821463-24.645306 24.142863l0 786.690176L232.574475 627.098411c-9.603729-9.381671-25.248034-9.381671-34.847669 0-4.836145 4.76349-7.194866 10.939143-7.194866 17.116843 0 6.1777 2.405793 12.355399 7.194866 17.116843l295.723212 289.704125c9.602705 9.383718 25.244964 9.383718 34.850739 0L528.252661 950.942077z" p-id="1456"></path></svg>
                            <span>{{yearElecRate}}%</span>
                        </div>
                    </div>
                </div>
                <div class="custom-panel1">
                    <img src="../../assets/images/ico2.png" alt="" srcset="">
                    <div>
                        <div class="custom-panel1-title">年度总用水(m³)</div>
                        <div class="custom-panel1-value">3573</div>
                        <div class="custom-panel1-content" :class="{'up':yearWaterRate>0}">
                            <span>环比</span>
                            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M528.252661 950.942077l295.703769-289.705148c9.624195-9.380648 9.624195-24.707728 0-34.138518-9.576099-9.381671-25.222451-9.381671-34.848693 0L535.495622 875.592972 535.495622 88.901773c0-13.3214-11.048637-24.142863-24.642237-24.142863-13.597693 0-24.645306 10.821463-24.645306 24.142863l0 786.690176L232.574475 627.098411c-9.603729-9.381671-25.248034-9.381671-34.847669 0-4.836145 4.76349-7.194866 10.939143-7.194866 17.116843 0 6.1777 2.405793 12.355399 7.194866 17.116843l295.723212 289.704125c9.602705 9.383718 25.244964 9.383718 34.850739 0L528.252661 950.942077z" p-id="1456"></path></svg>
                            <span>{{yearWaterRate}}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            yearElecRate:10,
            yearWaterRate:-10,

            elecRate1:81, // 公用用电
            elecRate2:19, // 客用用电

            mychart:null,

            option:{
                // color:[],
                series:[
                    {
                        type:"pie",
                        clockWise: false,
                        radius: ['50%', '52%'],
                        hoverAnimation: false,
                        itemStyle:{
                            borderCap:'round',
                            borderJoin:'round'
                        },
                        label:{
                            formatter:[
                                '{a|{b}}',
                                '{b|{c}%}'
                            ].join('\n'),
                            // rich:{
                            //     a:{
                            //         color:"#ffffff",
                            //         fontSize:14
                            //     },
                            //     b:{
                            //         color:"rgba(70, 187, 255, 1)",
                            //         textAlgin:'left'
                            //     }
                            // }
                        },
                        labelLine:{
                            length:30,
                            length2:10,
                        },
                        data:[]
                    }
                ]
            }
        }
    },
    computed:{
        optionData(){
            return [
                {
                    name:'年度公区用电',
                    value:this.elecRate1,
                    itemStyle:{
                        borderWidth: 5,
                        shadowBlur: 30,
                        borderColor:new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                            offset: 0,
                            color: '#36C4FF'
                        }, {
                            offset: 1,
                            color: '#0195EB'
                        }]),
                        shadowColor: 'rgba(142, 152, 241, 0.6)'
                    },
                    labelLine:{
                        show:true,
                        lineStyle:{
                            color:"rgba(0, 167, 255, 1)"
                        }
                    },
                    label:{
                        rich:{
                            a:{
                                color:"#ffffff",
                                fontSize:14
                            },
                            b:{
                                color:"rgba(70, 187, 255, 1)",
                                align:'left',
                                fontSize:24
                            }
                        }
                    }
                },{
                    name:"",
                    value:4,
                    itemStyle:{
                        color:"rgba(0,0,0,0)",
                        borderColor:'rgba(0,0,0,0)'
                    },
                    label:{
                        show:false,
                    },
                    labelLine:{
                        show:false,
                    }
                },
                {
                    name:'年度客区用电',
                    value:this.elecRate2,
                    itemStyle:{
                        borderWidth: 5,
                        shadowBlur: 30,
                        borderColor:new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                            offset: 0,
                            color: '#FFCA3D'
                        }, {
                            offset: 1,
                            color: '#FF8A00'
                        }]),
                        shadowColor: 'rgba(142, 152, 241, 0.6)'
                    },
                    labelLine:{
                        show:true,
                        lineStyle:{
                            color:"rgba(226, 166, 2, 1)"
                        }
                    },
                    label:{
                        rich:{
                            a:{
                                color:"#ffffff",
                                fontSize:14
                            },
                            b:{
                                color:"rgba(226, 166, 2, 1)",
                                fontSize:24,
                                align:'left'
                            }
                        }
                    }
                },{
                    name:"",
                    value:4,
                    itemStyle:{
                        color:"rgba(0,0,0,0)",
                        borderColor:'rgba(0,0,0,0)'
                    },
                    label:{
                        show:false,
                    },
                    labelLine:{
                        show:false,
                    }
                }
            ]
        }
    },
    methods: {
        initChart(){
            if(!this.mychart){
                let dom = this.$refs.chart;
                this.mychart = echarts.init(dom)
            }
            this.option.series[0].data = this.optionData
            this.mychart.setOption(this.option)

        }
    },
    mounted(){
        this.initChart()
    }
}
</script>

<style lang="scss" scoped>
.energy-consumption-info{
    width: 860px;
    height: 332px;
    display: flex;
    flex-direction: column;
    background-color: rgba(17, 38, 84, 0.2);
    .detail{
        flex: 1;
        display: flex;
        .detail-left{
            width: 160px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding-left: 35px;
            text-align: center;
            .custom-panel0{
                width: 122px;
                height: 71px;
                background-image: url('../../assets/images/nh_bg.png');
                background-size: 100% 100%;
            }
            .custom-panel0-title{
                height: 26px;
                font-family: SourceHanSansCN-Regular, SourceHanSansCN-Regular;
                font-weight: normal;
                font-size: 16px;
                color: #D5F0FF;
                line-height: 26px
            }
            .custom-panel0-content{
                // height: 31px;
                font-family: SourceHanSansCN-Regular, SourceHanSansCN-Regular;
                font-weight: 500;
                font-size: 16px;
                color: #35CCEA;
                line-height: 24px;
                margin-top: 5px;
            }
            .custom-panel0-unit{
                font-size: 14px;
            }
        }
        .detail-right{
            width: 260px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .custom-panel1{
                text-align: left;
                height: 85px;
                display: flex;
                align-items: center;
                img{
                    height: 100%;
                    margin-right: 10px;
                }
                .custom-panel1-title{
                    font-family: Source Han Sans CN, Source Han Sans CN;
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 24px;
                }
                .custom-panel1-value{
                    font-family: Roboto, Roboto;
                    font-weight: 500;
                    font-size: 24px;
                    color: #35CCEA;
                    line-height: 24px;
                }
                .custom-panel1-content{
                    display: flex;
                    align-items: center;
                    font-family: Source Han Sans CN, Source Han Sans CN;
                    font-weight: 400;
                    font-size: 14px;
                    color:#FF0000;
                    fill: #FF0000;
                    &.up{
                        color: #8DFFCD;
                        fill: #8DFFCD;
                        svg{
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
        .detail-middle{
            flex: 1;
            .chart{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
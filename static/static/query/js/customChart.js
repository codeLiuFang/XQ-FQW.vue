$(document).ready(function ($) {
    option = {
        title: {
            text: '数据量图'
        },
        tooltip: {
        	trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        legend: {
            type: 'scroll',
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
//            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name:'数据量',
//            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            itemStyle: {
                normal: {
                    color: '#48a5ce',
                    //以下为是否显示，显示位置和显示格式的设置了
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            },
        }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
});

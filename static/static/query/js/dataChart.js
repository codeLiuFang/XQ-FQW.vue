$(document).ready(function ($) {
    option = {
        tooltip: {
        	trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
        	left:'10%',
        	right:'20%'
        },
        legend: {
            type: 'scroll',
            bottom: 0,
//            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        toolbox: {
            show: true,
            feature: {
//                mark: {
//                    show: true
//                },
//                dataView: {
//                    show: true,
//                    readOnly: false
//                },
//                magicType: {
//                    show: true,
//                    type: ['line', 'bar', 'stack', 'tiled']
//                },
//                restore: {
//                    show: true
//                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
//            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }],
        yAxis: [{
            type: 'value',
            min:100000000,
            position: 'right'
        }, {
            type: 'value',
            min:100000,
//            max:100000000,
            position: 'left'
        }, {
            type: 'value',
            position: 'right',
//            max:100000,
            min:0,
            offset: 100
        }],
        series: []
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
});

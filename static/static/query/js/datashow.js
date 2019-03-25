var hiddenNodes = []; // 用于存储被隐藏的结点

// 查找数组
function getNode(id, array) {
    var node;
    for (var i = 0; i < array.length; i++) {
        if (id == array[i].id) {
            node = array[i];
        }
    }
    return node;
}

function toThousands(num) {
	 result = ''
     num = num + '';
	if(num.indexOf("公里")!= -1){
		var temp = num.split(".")[1];
		num = num.split(".")[0];
		var num = (num || 0).toString();
	    while (num.length > 3) {
	        result = ',' + num.slice(-3) + result;
	        num = num.slice(0, num.length - 3);
	    }
	    if (num) { result = num + result; }
	    result = result+"."+temp;
	}else{
		var num = (num || 0).toString();
	    while (num.length > 3) {
	        result = ',' + num.slice(-3) + result;
	        num = num.slice(0, num.length - 3);
	    }
	    if (num) { result = num + result; }
	}
    
    return result;
}

function init() {
    // 加载学科要素
    var suNodes = [];
    $.post(subjectFactorUrl, function (data) {
        $.each(data, function (index, data) {
            var tnode = getNode(data.subjectCode, suNodes);
            if (null == tnode) {
                tnode = {
                    id: data.subjectCode,
                    name: data.subjectName,
                    children: [{
                        id: data.factorCode,
                        name: data.factorName
                    }]
                };
                suNodes.push(tnode);
            } else {
                var fnode = {
                    id: data.factorCode,
                    name: data.factorName
                };
                tnode.children.push(fnode);
            }
        });

        zTreeObj = $.fn.zTree.init($("#dataTree"), {
            check: {
                enable: true
            }
        }, suNodes);

        var nodes = zTreeObj.getNodes();
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                zTreeObj.expandNode(nodes[i], true, false, false);
            }
        }
        
		var node = zTreeObj.getNodeByParam("name","海洋水文");
		zTreeObj.checkNode(node,true,true,true);
    });

    $("#searchKey").keyup(filter);
    
    $('.left-checkbox').iCheck({
		  checkboxClass: 'icheckbox_flat-blue',
	  });
	 $("#gridFlag").iCheck('check');
};

// 过滤ztree显示数据
function filter() {
    // 显示上次搜索后背隐藏的结点
    zTreeObj.showNodes(hiddenNodes);

    // 查找不符合条件的叶子节点
    function filterFunc(node) {
        var _keywords = $("#searchKey").val();
        if (node.isParent || node.name.indexOf(_keywords) != -1)
            return false;
        return true;
    }
    ;

    // 获取不符合条件的叶子结点
    hiddenNodes = zTreeObj.getNodesByFilter(filterFunc);

    // 隐藏不符合条件的叶子结点
    zTreeObj.hideNodes(hiddenNodes);
};

$(document).ready(function ($) {
	
	$(document).ajaxError(
		
		function(event, xhr, options ,exc){
			if(xhr.status == 'undefined'){
				return;
			}
			if(xhr.statusText == "parsererror"){
				top.location.href="http://"+top.location.host+"/ocean.html";
			}
		}
		
	);
	
	$.fn.dataTable.ext.errMode = 'none';

    //  初始化控件
    $('#startDate,#endDate').datepicker({
        autoclose: true,
        todayBtn: false, //今日按钮
        language: "zh-CN",
        format: "yyyy-mm-dd",
        changeYear: true,
        changeMonth: true,
    });
    
    initStartDate();
    function initStartDate(){
    	var now = new Date();
    	if(now.getMonth() < 11){
    		$("#startDate").datepicker('setDate',new Date(now.getFullYear()-10,now.getMonth()+1,now.getDate()));
    	}else{
    		$("#startDate").datepicker('setDate',new Date(now.getFullYear()-9,0,now.getDate()));
    	}
    }
    
    

    // 淡隐淡现选项卡切换
    $(".chart-title .tit").tabso({
        cntSelect: ".chart-text",
        tabEvent: "click",
        tabStyle: "fade"
    });

    var validate = $("#inputForm").validate({
        rules: {
            north: {
                number: true,
                maxlength: 15
            },
            west: {
                number: true,
                maxlength: 15
            },
            east: {
                number: true,
                maxlength: 15
            },
            south: {
                number: true,
                maxlength: 15
            }
        },
        messages: {
            north: {
                number: '<span style="color:red">请填数字</span>',
                maxlength: '<span style="color:red">长度错误</span>'
            },
            west: {
                number: '<span style="color:red">请填数字</span>',
                maxlength: '<span style="color:red">长度错误</span>'
            },
            east: {
                number: '<span style="color:red">请填数字</span>',
                maxlength: '<span style="color:red">长度错误</span>'
            },
            south: {
                number: '<span style="color:red">请填数字</span>',
                maxlength: '<span style="color:red">长度错误</span>'
            }
        },
        submitHandler: function (form) {
            loading('正在查询，请稍等...');
            form.submit();
        }
    });

    $('#btnClean').click(function () {
    	
        zTreeObj.checkAllNodes(false);
        var node = zTreeObj.getNodeByParam("name","海洋水文");
		zTreeObj.checkNode(node,true,true,true);
		
        document.getElementById("observation").options.selectedIndex = -1;
        document.getElementById("special").options.selectedIndex = -1;
        document.getElementById("monitor").options.selectedIndex = -1;
        document.getElementById("international").options.selectedIndex = -1;
        document.getElementById("polar").options.selectedIndex = -1;
        document.getElementById("ocean").options.selectedIndex = -1;
        document.getElementById("ioType").options.selectedIndex = -1;
        $('.selectpicker').selectpicker('refresh');
       
        initStartDate();
        $("#endDate").datepicker('setDate',new Date());
        
        GV.clearMap();
       	$("#north").val(40.43333333.toFixed(2));
        $("#south").val(16.9483340496563.toFixed(2));
        $("#east").val(140.0016667.toFixed(2));
        $("#west").val(110.2483.toFixed(2));
        
    });

    // 去除重复
    function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

    /**
     * 获得查询条件
     */
    function getPostData() {
        var subjectIds = '', factorIds = '';
        var subjectTree = $.fn.zTree.getZTreeObj("dataTree");
        if (null != subjectTree) {
            var nodes = subjectTree.getCheckedNodes(true);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].isParent) {
                    if (subjectIds.length > 1) {
                        subjectIds += ",";
                    }
                    subjectIds += "'" + nodes[i].id + "'";
                } else {
                    if (factorIds.length > 1) {
                        factorIds += ",";
                    }
                    factorIds += "'" + nodes[i].id + "'";
                }
            }
        }
        
        var bcategoryIds = '';
        var srcategoryIds = isShowBc();

        var queryType = 'day';
        if (null != $("#startDate").val() && null != $("#endDate").val()) {
            var from_date = new Date($("#startDate").val());
            var end_date = new Date($("#endDate").val());
            var time_different = (end_date - from_date) / 86400000;
            if (time_different > 180) {
                queryType = 'month';
                if (time_different > 3650) {
                    queryType = 'year';
                }
            }
        }

        var iotypes='';
        if ($("#ioType").val()) {
            iotypes += $("#ioType").val();
        }

        return {
            startDate: $("#startDate").val().replace(reg, ""),
            endDate: $("#endDate").val().replace(reg, ""),
            queryType: queryType,
            north: $("#north").val(),
            west: $("#west").val(),
            east: $("#east").val(),
            south: $("#south").val(),
            subjectCodes: subjectIds,
            factorCodes: factorIds,
            bcategoryCodes: bcategoryIds,
            srcategoryCodes: srcategoryIds,
            ioType: iotypes,
            voyage: $("#voyage").val(),
            deviceCode: $("#deviceCode").val(),
            investigation: $("#investigation").val(),
            startDeepth:$("#startDeepth").val(),
            endDeepth:$("#endDeepth").val()
        };
    }

    $.extend($.fn.dataTable.defaults, {
        "searching": false,
        "ordering": false
    });

    var dttable;

    function loadJqGrid(queryData) {
        if (dttable) {
            dttable.destroy();
            dttable.clear();
        }
        if (isShowBc() == '') {
            var thead = "<thead><tr><th style='text-align: center;width:100px'>学科</th><th style='text-align: center;width:100px'>要素</th><th style='text-align: center;width:100px'>类型</th><th style='text-align: center;width:100px'>国内/国际</th><th style='text-align: center;width:100px'>资料类型</th><th style='text-align: center;width:100px'>数据量</th><th style='text-align: center;width:100px'>详情</th></tr></thead>";
            $("#example").html(thead);
            dttable = 	$('#example').on( 'error.dt', function ( e, settings, techNote, message ) {
				console.log( 'An error has been reported by DataTables: ', message );
			} ) .DataTable({
            	 "processing": true,
                 //"serverSide": true,
                 "bPaginate": true,
                 "searching": false,
                 "ordering": false,
                 "scrollX": true,
                 "scrollY": "385px",
                 "scrollCollapse": true,
                  "paging":   true,
                 "autoWidth": false,
                 "columnDefs":[{"width":"100px",targets:'_all'}],
	             "scroller":{
	             	"rowHeight":30
	             },
                "ajax": {
                    "url": listUrl,
                    "type": "POST",
                    "dataType": "json",
                    "data": queryData,
                    "dataSrc": "list",
                },
                "columns": [
                    {"data": "subjectName","defaultContent": ""},
                    {"data": "factorName","defaultContent": ""},
                    {"data": "dddmType","defaultContent": ""},
                    
                    {"data": "nationType","defaultContent": ""},
                    {"data": "dataType","defaultContent": ""},
                    {"data": "dataCount", render: function (data, type, row) {
                    	var dataCount = toThousands(data);
                        return "<div class=\'line-limit-length\' width=\'120px\' title="+dataCount.toString().replace(" ","")+">"+dataCount+"<div>";
                    }},
                    {
                        "data": "srcTable", render: function (data, type, row) {
                        var datatmp = "srcTable=" + row.srcTable + "&factorCode=" + row.factorCode+"&dataType="+row.tableType+"&subjectCode="+row.subjectCode+"&dddmType="+row.dddmType+"&nationType="+row.nationType;
                        var html = "<a href='#' datas='" + datatmp;
                        html += "' onclick='viewData(this);return false;'><span style='color:#4baed9'>详情</span></a>";
                        return html;
                    }
                    }
                ],
                "oLanguage": {//语言设置
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                }
            });
        } else {
            var thead = "<thead><tr><th style='text-align: center;width:100px'>学科</th><th style='text-align: center;width:100px'>要素</th><th style='text-align: center;width:100px'>类型</th><th style='text-align: center;width:100px'>来源大类</th><th style='text-align: center;width:100px'>来源子类</th><th style='text-align: center;width:100px'>国内/国际</th><th style='text-align: center;width:100px'>数据量</th><th style='text-align: center;width:100px'>详情</th></tr></thead>";
            $("#example").html(thead);
            dttable = 	$('#example').on( 'error.dt', function ( e, settings, techNote, message ) {
				console.log( 'An error has been reported by DataTables: ', message );
			} ) .DataTable({
            	 "processing": true,
                 //"serverSide": true,
                 "bPaginate": true,//分页工具条显示
                 "searching": false,
                 "ordering": false,
                 "scrollX": true,
                 "scrollY": "385px",
                 "scrollCollapse": true,
                 "autoWidth": false,
                 "columnDefs":[{"width":"100px",targets:'_all'}],
                "ajax": {
                    "url": listUrl,
                    "type": "POST",
                    "dataType": "json",
                    "data": queryData,
                    "dataSrc": "list",
                },
                "columns": [
                    {"data": "subjectName","defaultContent": ""},
                    {"data": "factorName","defaultContent": ""},
                    {"data": "dddmType","defaultContent": ""},
                    {"data": "bcategoryName","defaultContent": "", render: function (data, type, row) {
                    	return "<div class=\'line-limit-length\' width=\'120px\' title="+data+">"+data+"<div>";
                    }},
                    {"data": "srcategoryName","defaultContent": "", render: function (data, type, row) {
                    	return "<div class=\'line-limit-length\' width=\'120px\' title="+data+">"+data+"<div>";
                    }},
                    
                    {"data": "nationType","defaultContent": ""},
                    {"data": "dataCount", render: function (data, type, row) {
                    	var dataCount = toThousands(data);
                        return "<div class=\'line-limit-length\' width=\'120px\' title="+dataCount.toString().replace(" ","")+">"+dataCount+"<div>";
                     }},
                    {
                        "data": "srcTable", render: function (data, type, row) {
                        var datatmp = "srcTable=" + row.srcTable + "&factorCode=" + row.factorCode+"&dataType="+row.tableType+"&subjectCode="+row.subjectCode+"&dddmType="+row.dddmType+"&nationType="+row.nationType+
                            "&srcategoryCode=" + row.srcategoryCode;
                        var html = "<a href='#' datas='" + datatmp;
                        html += "' onclick='viewData(this);return false;'><span style='color:#4baed9'>详情</span></a>";
                        return html;
                    }
                    }
                ],
                "oLanguage": {//语言设置
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                }
            });
        }
    }

    /**
     * 判断是否显示隐藏列，有则返回隐藏查询过滤值
     */
    function isShowBc() {
        var srcategoryIds = '';
        if ($('#observation').val()) {
            srcategoryIds += $('#observation').val();
        }
        if ($('#special').val()) {
            if ('' != srcategoryIds) {
                srcategoryIds += ','
            }
            srcategoryIds += $('#special').val();
        }
        if ($('#ocean').val()) {
            if ('' != srcategoryIds) {
                srcategoryIds += ','
            }
            srcategoryIds += $('#ocean').val();
        }
        if ($('#monitor').val()) {
            if ('' != srcategoryIds) {
                srcategoryIds += ','
            }
            srcategoryIds += $('#monitor').val();
        }
        if ($('#international').val()) {
            if ('' != srcategoryIds) {
                srcategoryIds += ','
            }
            srcategoryIds += $('#international').val();
        }
        if ($('#polar').val()) {
            if ('' != srcategoryIds) {
                srcategoryIds += ','
            }
            srcategoryIds += $('#polar').val();
        }
        return srcategoryIds;
    }

    function getSerie(series, name) {
        var serie;
        $.each(series, function (index, value) {
            if (value.name == name) {
                serie = value;
            }
        });
        return serie;
    }

    function loadCharts(queryData) {
        $.post(countUrl, queryData, function (data) {
            var legenddata = [];
            var xAxisdata = [];
            var seriesdata = [];
            var isshow = isShowBc();
            var dataSum = 0;
	        
            $.each(data, function (index, value) {
            	dataSum += parseInt(value.dataCount);
            	var tname = value.subjectName + value.factorName;
               if(value.dataType){
            		tname =value.dataType + value.subjectName + value.factorName;
                }
                
                if (isshow) {
                    tname += value.bcategoryName + value.srcategoryName;
                }
                legenddata.push(tname);
                xAxisdata.push(value.dateYear);
                // 查找数组对象
                var serie = getSerie(seriesdata, tname);

                if (serie) {
                    serie.data.push(value.dataCount);
                } else {
                    if (value.dataCount < 100000) {
                        serie = {
                            name: tname,
                            type: 'line',
//                            stack: '总量',
                            yAxisIndex: 2,
                            data: []
                        };
                    } else if (value.dataCount > 100000 && value.dataCount < 100000000) {
                        serie = {
                            name: tname,
                            type: 'line',
//                            stack: '总量',
                            yAxisIndex: 1,
                            data: []
                        };
                    } else if(value.dataCount > 100000000) {
                        serie = {
                            name: tname,
                            type: 'line',
//                            stack: '总量',
                            yAxisIndex: 0,
                            data: []
                        };
                    }
                    serie.data.push(value.dataCount);
                    seriesdata.push(serie);
                }
            });
            $("#allCount").html("总共" + toThousands(dataSum) +"条数据");
            var coption = myChart.getOption();
            coption.legend[0].data = unique(legenddata);
            coption.xAxis[0].data = unique(xAxisdata);
            coption.series = seriesdata;
            setTimeout(myChart.setOption(coption, true), 500);
        });
    }

    function loadData(query) {
        if(query == null){
            query = getPostData();
        }
        // 重刷表格数据
        loadJqGrid(query);
        // 重画图
        loadCharts(query);
    }

    $("#btnSubmit").click(function () {
    	if(!checkTime()){
    		return false;
    	}
    	if(!checkLongLatitude()){
    		return false;
    	}
    	if(!checkTree()){
    		return false;
    	}
    	$("#tableTab").trigger("mouseover");
        if ($('#inputForm').valid()) {
        	$("#loading").show();
        	var queryData = getPostData();
            // 加载地图数据
            loadGisData(queryData);
            loadData(queryData);// 加载数据
            $("#btnSubmit").attr("disabled", "disabled");
            setTimeout(function () {// 两秒后跳转
                $("#btnSubmit").attr("disabled", null);
            }, 2000);
        }
    });

    // 重刷gis数据
    function loadGisData(queryData) {
    	 GV.clearMap();
    	 var pointFlag= document.getElementById('gridFlag');
	    if(pointFlag.checked === true){
	    	$.post(gisGridUrl, queryData, function (data) {
	    		
	        	if(data.length >0){
	        		GV.amountQueryEvent(data, true); //网格查询,true
	        		$("#loading").hide();
	        	}
	        	
	            
	        });
	    	
		}
        
        //判断是否选中
        var pointFlag= document.getElementById('pointFlag');
	    if(pointFlag.checked === true){
	    	// 是渲染，false是只画网格
	        $.post(gisPointUrl, queryData, function (data) {
	        	if(data.length >0){
	        		GV.paintPoints(data); //画点
	        		$("#loading").hide();
	        	}
	        });
	        
	        $.post(gisLineUrl, queryData, function (data) {
	        	if(data.length >0){
	        		GV.paintLines(data); //画线
	        	}
	        });
	    }
        
        GV.setMapExtent();
       
        // GW.paintTrack(tracks); //画线
    }
    
    //验证开始结束日期
    function checkTime(){

        var startTime = document.getElementById("startDate").value.trim();
        var endTime   = document.getElementById("endDate").value.trim();
        if(startTime == "" || endTime == ""){
        	bootbox.alert({ 
       		  size: "small",
       		  title: "提示信息",
       		  message: "时间不能为空！"
       		});
            return false;
        }
//        var reg = /^((20|21|22|23|[0-1]\d)\$/;
//        if(!reg.test(startTime) || !reg.test(endTime)){    
//            alert("您输入的时间格式不正确!");  
//            return false;
//        }
        var startTimeArray = startTime.split("-");
        var endTimeArray = endTime.split("-");
        var startDate = new Date(parseInt(startTimeArray[0]),parseInt(startTimeArray[1])-1,parseInt(startTimeArray[2]));
        var endDate = new Date(parseInt(endTimeArray[0]),parseInt(endTimeArray[1])-1,parseInt(endTimeArray[2]));
        var start = startDate.getTime();
        var end = endDate.getTime();

        if (start >= end) {
        	bootbox.alert({ 
         		  size: "small",
         		  title: "提示信息",
         		  message: "开始时间不能大于结束时间！"
         		});
            return false;
        }
        return true;
    }

    //经纬度验证
    function checkLongLatitude(){
    	var north = $("#north").val();
        var west = $("#west").val();
        var east = $("#east").val();
        var south = $("#south").val();
        if(parseInt(north)>90|| parseInt(north) < -90 || parseInt(south) > 90 || parseInt(south) < -90){
        	bootbox.alert({ 
       		  size: "small",
       		  title: "提示信息",
       		  message: "纬度范围不正确，请检查！"
       		});
        	return false;
        }
        if(parseInt(west)>180|| parseInt(west) < -180 || parseInt(east) > 180 || parseInt(east) < -180){
        	bootbox.alert({ 
         		  size: "small",
         		  title: "提示信息",
         		  message: "经度范围不正确，请检查！"
         		});
        	return false;
        }
        /*if(parseInt(east) < parseInt(west)){
        	bootbox.alert({ 
       		  size: "small",
       		  title: "提示信息",
       		  message: "东经应大于西经！"
       		});
        	return false;
        }*/
        if(parseInt(north) < parseInt(south)){
        	bootbox.alert({ 
       		  size: "small",
       		  title: "提示信息",
       		  message: "北纬应大于南纬！"
       		});
        	return false;
        }
        return true;
    }
    
    function checkTree(){
    	 var subjectIds = '', factorIds = '';
         var subjectTree = $.fn.zTree.getZTreeObj("dataTree");
         if (null != subjectTree) {
             var nodes = subjectTree.getCheckedNodes(true);
             for (var i = 0; i < nodes.length; i++) {
                 if (nodes[i].isParent) {
                     if (subjectIds.length > 1) {
                         subjectIds += ",";
                     }
                     subjectIds += "'" + nodes[i].id + "'";
                 } else {
                     if (factorIds.length > 1) {
                         factorIds += ",";
                     }
                     factorIds += "'" + nodes[i].id + "'";
                 }
             }
         }
         
         if(subjectIds == "" || factorIds ==""){
//         	alert("请选择要筛选的要素！");
        	 bootbox.alert({ 
         		  size: "small",
         		  title: "提示信息",
         		  message: "请选择要筛选的要素！"
         		});
         	return false;
         }
         return true;
    }

    dojo.addOnLoad(GE.init);
    //解决表头错位问题
    $("#tableTab").mouseover(function(){
    	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    });
    init();
});
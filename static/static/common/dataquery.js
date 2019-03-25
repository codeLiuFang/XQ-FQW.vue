$(document).ready(function($) {
    // 日期初始化
    $('#startDate,#endDate').datepicker({
	dateFormat : "yy-mm-dd",
    });

    // $('#startDate').datetimepicker('setDate', (new Date()));
    // $('#endDate').datetimepicker('setDate', (new Date()));

    // 淡隐淡现选项卡切换
    $(".chart-title .tit").tabso({
	cntSelect : ".chart-text",
	tabEvent : "click",
	tabStyle : "fade"
    });

    $("#observation").multiselect({
	noneSelectedText : "观测",
	checkAllText : "全选",
	uncheckAllText : '全不选',
	selectedText : "# 选中",
    });
    $("#special").multiselect({
	noneSelectedText : "专项",
	checkAllText : "全选",
	uncheckAllText : '全不选',
	selectedText : "# 选中",
    });
    $("#international").multiselect({
	noneSelectedText : "国际",
	checkAllText : "全选",
	uncheckAllText : '全不选'
    });
    $("#monitor").multiselect({
	noneSelectedText : "监测",
	checkAllText : "全选",
	uncheckAllText : '全不选',
	selectedText : "# 选中",
    });
    $("#ocean").multiselect({
	noneSelectedText : "大洋",
	checkAllText : "全选",
	uncheckAllText : '全不选'
    });
    $("#polar").multiselect({
	noneSelectedText : "极地",
	checkAllText : "全选",
	uncheckAllText : '全不选',
	selectedText : "# 选中",
    });

    var validate = $("#inputForm").validate({
	rules : {
	    north : {
		number : true,
		maxlength : 15
	    },
	    west : {
		number : true,
		maxlength : 15
	    },
	    east : {
		number : true,
		maxlength : 15
	    },
	    south : {
		number : true,
		maxlength : 15
	    }
	},
	messages : {
	    north : {
		number : '<span style="color:red">请填数字</span>',
		maxlength : '<span style="color:red">长度错误</span>'
	    },
	    west : {
		number : '<span style="color:red">请填数字</span>',
		maxlength : '<span style="color:red">长度错误</span>'
	    },
	    east : {
		number : '<span style="color:red">请填数字</span>',
		maxlength : '<span style="color:red">长度错误</span>'
	    },
	    south : {
		number : '<span style="color:red">请填数字</span>',
		maxlength : '<span style="color:red">长度错误</span>'
	    }
	},
	submitHandler : function(form) {
	    loading('正在查询，请稍等...');
	    form.submit();
	}
    });

    $('#btnClean').click(function() {
	validate.resetForm();
	zTreeObj.checkAllNodes(false);
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
	var reg = new RegExp("-", "g");
	return {
	    startDate : $("#startDate").val().replace(reg, ""),
	    endDate : $("#endDate").val().replace(reg, ""),
	    queryType : queryType,
	    north : $("#north").val(),
	    west : $("#west").val(),
	    east : $("#east").val(),
	    south : $("#south").val(),
	    subjectCodes : subjectIds,
	    factorCodes : factorIds,
	    bcategoryCodes : bcategoryIds,
	    srcategoryCodes : srcategoryIds,
	};
    }
    
    

    function editLink(cellValue, options, rowdata, action) {
	var html = "";
	html += "<a href='#' onclick='viewData();return false;'>";
	html += "<span style='color:#4baed9'>" + rowdata.dataCount + "</span></a>&nbsp;";
	return html;
    }

    var modelAll = [ {
	name : 'subjectName',
	index : 'subjectName',
	width : '20%',
	sortable : false
    }, {
	name : 'factorName',
	index : 'factorName',
	width : '20%',
	sortable : false
    }, {
	name : 'bcategoryName',
	index : 'bcategoryName',
	width : '20%',
	hidden : true,
	sortable : false
    }, {
	name : 'srcategoryName',
	index : 'srcategoryName',
	width : '20%',
	hidden : true,
	sortable : false
    }, {
	name : 'dataCount',
	index : 'dataCount',
	width : '10%',
	align : "center",
	sortable : false,
	formatter : editLink
    } ];

    $("#listtable").jqGrid({
	url : listUrl,
	mtype : "POST",
	datatype : "json",
	styleUI : 'Bootstrap',
	colNames : [ '学科', '要素', '来源', '来源子项', '数据量' ],
	colModel : modelAll,
	rowNum : 10,
	rowList : [ 10, 50, 100 ],
	pager : '#listpager',
	viewrecords : true,
	width : "100%",
	autowidth : true,
	height : "300px",
	jsonReader : {
	    root : "list",
	    page : "pageNo",
	    total : "pageSize",
	    records : "count",
	    repeatitems : false,
	},
	prmNames : {
	    page : "pageNo",
	    rows : "pageSize",
	},
    });

    $("#listtable").jqGrid('navGrid', '#listpager', {
	edit : false,
	add : false,
	del : false,
	search : false
    });

    function loadJqGrid(queryData) {
		var srcategoryIds = isShowBc();
		if (srcategoryIds != '') {
			$("#listtable").jqGrid('setGridParam', {
				postData : queryData,
			}).showCol("bcategoryName").showCol("srcategoryName").trigger("reloadGrid");
            // $("#listtable").setGridWidth($(window).width()*0.5);
		} else {
			$("#listtable").jqGrid('setGridParam', {
				postData : queryData,
			}).hideCol("bcategoryName").hideCol("srcategoryName").trigger("reloadGrid");
            // $("#listtable").setGridWidth($(window).width()*0.5);
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
	    srcategoryIds += $('#observation').val();
	}
	if ($('#ocean').val()) {
	    if ('' != srcategoryIds) {
		srcategoryIds += ','
	    }
	    srcategoryIds += $('#observation').val();
	}
	if ($('#monitor').val()) {
	    if ('' != srcategoryIds) {
		srcategoryIds += ','
	    }
	    srcategoryIds += $('#observation').val();
	}
	if ($('#international').val()) {
	    if ('' != srcategoryIds) {
		srcategoryIds += ','
	    }
	    srcategoryIds += $('#observation').val();
	}
	if ($('#polar').val()) {
	    if ('' != srcategoryIds) {
		srcategoryIds += ','
	    }
	    srcategoryIds += $('#observation').val();
	}
	return srcategoryIds;
    }

    function getSerie(series, name) {
	var serie;
	$.each(series, function(index, value) {
	    if (value.name == name) {
		serie = value;
	    }
	});
	return serie;
    }

    function loadCharts(queryData) {
	$.post(countUrl, queryData, function(data) {
	    var legenddata = [];
	    var xAxisdata = [];
	    var seriesdata = [];
	    var isshow = isShowBc();
	    $.each(data, function(index, value) {
		var tname = value.subjectName + value.factorName;
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
		    serie = {
			name : tname,
			type : 'line',
			stack : '总量',
			data : []
		    };
		    serie.data.push(value.dataCount);
		    seriesdata.push(serie);
		}
	    });
	    var coption = myChart.getOption();
	    coption.legend[0].data = unique(legenddata);
	    coption.xAxis[0].data = unique(xAxisdata);
	    coption.series = seriesdata;
	    setTimeout(myChart.setOption(coption, true), 500);
	});
    }

    $("#btnSubmit").click(function() {
	if ($('#inputForm').valid()) {
	    var queryData = getPostData();
	    // 重刷表格数据
	    loadJqGrid(queryData);
	    // 重画图
	    loadCharts(queryData);

	    // 重刷gis数据
	    GV.amountQueryEvent(testjson,true); //网格查询,true
	    // 是渲染，false是只画网格
	    GV.paintPoints(tracks); //画线
	    GW.paintTrack(tracks); //画线

	    $("#btnSubmit").attr("disabled", "disabled");
	    setTimeout(function() {// 两秒后跳转
		$("#btnSubmit").attr("disabled", null);
	    }, 2000);
	}
    });

    $("#selectExtent").click(function(){
        ShowDiv();
    });

    $("#closeDiv").click(function(){
        CloseDiv();
    });

    //弹出隐藏层
    function ShowDiv(){
        document.getElementById("MyDiv").style.display='block';
        document.getElementById("fade").style.display='block' ;
        var bgdiv = document.getElementById("fade");
        bgdiv.style.width = document.body.scrollWidth;
        // bgdiv.style.height = $(document).height();
        $("#fade").height($(document).height());
    }
    //关闭弹出层
    function CloseDiv()
    {
        document.getElementById("MyDiv").style.display='none';
        document.getElementById("fade").style.display='none';
    }

	$("#confim").click(function(){
		GE.confirm();
        CloseDiv();
        var extent = GE.getExtent();
        $("#north").val(extent.ymax.toFixed(6));
        $("#south").val(extent.ymin.toFixed(6));
        $("#east").val(extent.xmax.toFixed(6));
        $("#west").val(extent.xmin.toFixed(6));

    });
    $("#select").click(function(){
        GE.initSelect();
    });
    $("#reset").click(function(){
        GE.reset();
    });

    dojo.addOnLoad(GE.init);
});
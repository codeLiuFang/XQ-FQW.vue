var hiddenNodes = []; // 用于存储被隐藏的结点
var childQueryData = [];
var primaryKey = "";
var foreignKey ="";
var childIndex = 0;
	
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
// 过滤ztree显示数据
function filter() {
    // 显示上次搜索后背隐藏的结点
    var zTreeObj = $.fn.zTree.getZTreeObj("tableTree");
    zTreeObj.showNodes(hiddenNodes);

    // 查找不符合条件的叶子节点
    function filterFunc(node) {
        var _keywords = $("#searchKey").val();
        if (node.isParent || node.name.indexOf(_keywords) != -1)
            return false;
        return true;
    };
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
				//	top.location.href="http://"+top.location.host+"/ocean.html";
				}
			}
		
	);
	
	function onCheck(e, treeId, treeNode) {
	    var treeObj = $.fn.zTree.getZTreeObj("tableTree");
	    if (treeNode.children) {
	        $('#tableCode').val("");
	        $('#dataType').val("");
	        $("#selectQuery").attr("disabled", "disabled");
	        return false;
	    }
	    var nodes = treeObj.getCheckedNodes(true);
	     var tablename = nodes[0].tablename;
	    if (nodes && nodes.length > 0&& typeof(tablename) != "undefined") {
	    	foreignKey = "f"+tablename.substring(1,tablename.length);
	    	primaryKey = "p"+tablename.substring(1,tablename.length);
	    	 $('#primaryKey').val(primaryKey.toUpperCase());
	    	 $('#foreignKey').val(foreignKey.toUpperCase());
	    	 $('#mainTableName').val(tablename.toUpperCase());
	        $('#tableCode').val(nodes[0].id);
	        $('#dataType').val(nodes[0].type);
	        $("#selectQuery").removeAttr("disabled");
	        $("#cleanQuery").removeAttr("disabled");
	        $("#btnSubmit").removeAttr("title");
	        $("#download").removeAttr("title");
	        
	        $('#showSelect').html("");
			$('#filterSql').val("");
			$('#rule').val("");
	    } else {
	        $('#tableCode').val("");
	        $('#dataType').val("");
	        $("#selectQuery").attr("disabled", "disabled");
	        $("#cleanQuery").removeAttr("disabled");
	        $("#btnSubmit").attr("title", "请选择查询菜单");
	        $("#download").attr("title", "请选择查询菜单");
	    }
	    //checkTimeColumn();
	    //checkLongLatutide();
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
        validate.resetForm();
        $('#showSelect').html("");
		$('#filterSql').val("");
		$('#rule').val("");
        $("#startDate").val("");
        $("#endDate").val("");
    });
	
	$("#cleanQuery").click(function(){
		$('#showSelect').html("");
		$('#filterSql').val("");
		$('#rule').val("");
	});
	
    $('#startDate,#endDate').datepicker({
        autoclose: true,
        todayBtn: false, //今日按钮
        language: "zh-CN",
        format: "yyyy-mm-dd",
        changeYear: true,
        changeMonth: true,
    });

    // 加载数据
    $.post(queryTree, function (data) {
        var zTreeObj = $.fn.zTree.init($("#tableTree"), {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all"
            },
            data: {
                key: {
                    title: "name", //鼠标悬停显示的信息
                    name: "name" //网页上显示出节点的名称
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
            	beforeCheck : function(treeId, treeNode) {
                    if (treeNode.isParent) {
                        parent.ZENG.msgbox.show("请选择子节点！",0);
                        return false;
                    }
                },
                onClick: function (e, treeId, treeNode, clickFlag) {
                    zTreeObj.checkNode(treeNode, !treeNode.checked, true);
                    onCheck(e, treeId, treeNode);
                },
                onCheck:onCheck
            }
        }, data);
        var nodes = zTreeObj.getNodes();
        zTreeObj.expandNode(nodes[0], true, false, false);
        var childrens = nodes[0].children;
        if (childrens.length > 0) {
            for (var i = 0; i < childrens.length; i++) {
                zTreeObj.expandNode(childrens[i], true, false, false);
                var subChilds = childrens[i].children
	            if(typeof(subChilds) != "undefined"){
	            	for (var j = 0; j < subChilds.length; j++) {
	            		zTreeObj.expandNode(subChilds[j], true, false, false);
	            	}
	            }
            }
        }
    });

    $("#searchKey").keyup(filter);

    function getPostData() {
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
        
        
        return {
            "startDate": $("#startDate").val(),
            "endDate": $("#endDate").val(),
            "timeSql":$("#timeColumn").val(),
            "queryType": queryType,
            "north": $("#north").val(),
            "west": $("#west").val(),
            "east": $("#east").val(),
            "south": $("#south").val(),
            "srcDb": $('#dbCode').val(),
            "srcTable": $('#tableCode').val(),
            "filterSql": $('#filterSql').val(),
            "dataType": $('#dataType').val(),
            "longLaType": $('#longLaType').val(),
        };
    }

    var dttable;
    // $.extend($.fn.dataTable.defaults, {
    //     "searching": false,
    //     "ordering": false
    // });
    function loadJqGrid(queryData,hasChild) {
        if (dttable) {
            dttable.destroy();
            dttable.clear();
            $("#example").html("");
        }
		var height = "610px";
		if(hasChild){
			height = "210px";
		}
	$.ajax({
      type: "POST",
      url: viewColumn,
      async: true,
      data:{"tableCode": $('#tableCode').val()},
      dataType: "json",
      success:function(data){
          var thead = "<thead><tr>";
            var columns = '[';
            $.each(data, function (index, value) {
                if(typeof(value.label) == 'undefined'){
            		thead += "<th style='text-align: center;width:120px'> <div class='line-limit-length' width='120px' title="+value.id+">" + value.id + "</div> </th>";
            	}else{
            		thead += "<th style='text-align: center;width:120px'> <div class='line-limit-length' width='120px' title="+value.label+">" + value.label + "</div> </th>";
            	}
                if (index > 0) {
                    columns += ","
                    
                }
                columns +='{"data": "'+value.id+'","defaultContent": "","render":'+
		            'function(data,type,full,meta){'+
		            	'if(data){'+
		            		'return "<div class=\'line-limit-length\' width=\'120px\' title="+data.toString().replace(" ","")+">"+data+"<div>";'+
		            	'}else{'+
		            		'return ""'+
		            	'}'+
		            '}'+
		    	'}'
            });
            columns +="]";
            thead += "</th></tr></thead>";
            $("#example").html(thead);
            if(data.length>8){
            	var wid = data.length/8*100;
                $("#example").width(wid.toFixed(2) + "%");
            }else{
            	$("#example").width("100%");
            }
            
            dttable = $('#example').DataTable({
                "processing": true,
                "serverSide": true,
                "bPaginate": true,//分页工具条显示
                "searching": false,
                "ordering": false,
                "scrollX": true,
                "scrollY": height,
                "scrollCollapse": true,
                "autoWidth": false,
                "columnDefs":[{"width":"100px",targets:'_all'},{
                    "targets": [0],
                    "visible": false
                  }],
                "ajax": {
                    "url": listUrl,
                    "type": "POST",
                    "dataType": "json",
                    "data": queryData,
                    "dataSrc": "list",
                },
                "columns": eval(columns),
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
            
            //行点击事件
            $('#example tbody').on('click', 'tr',
        	    function() {
        	    	
        	        var data = dttable.row(this).data();
        	        for(var i=0;i<childQueryData.length;i++){
        	        	loadJqGrid1({"titleKey":foreignKey, "titleValue":data[primaryKey.toUpperCase()],"srcTable":childQueryData[i].tableCode,"mianTable":$("#mainTableName").val(),"primaryKey":primaryKey},childQueryData[i].tableId, childQueryData[i].tableCode,i);
        	        }
        	        
            	}
            );
            
            $("#loading").hide();
      }
  });
		
        // 加载表头
        //$.post(viewColumn, {"tableCode": $('#tableCode').val()}, function (data) {
        //});
    }

    function loadCharts(queryData) {
        $.post(countUrl, queryData, function (data) {
            var xAxisdata = [];
            var seriesdata = [];
            $.each(data, function (index, value) {
                xAxisdata.push(value.dateYear);
                seriesdata.push(value.dataCount)
            });
            var coption = myChart.getOption();
            coption.xAxis[0].data = xAxisdata;
            coption.series[0].data = seriesdata;
            setTimeout(myChart.setOption(coption, true), 500);
        });
    }

    function loadData(query,hasChild) {
        if (query == null) {
            query = getPostData();
        }
        // 重刷表格数据
        loadJqGrid(query,hasChild);
        // 重画图
        //loadCharts(query);
    }

    // 重刷gis数据
    function loadGisData(queryData) {
        	var pointFlag= document.getElementById('gridFlag');
		if(pointFlag.checked === true){
			$.post(gisGridUrl, queryData, function (data) {
	        		if(data.length >0){
	        		 	GV.amountQueryEvent(data, true); //网格查询,true
	        		}
	        	});
		}
	        
	        
	        var dataType = $("#dataType").val();
	        GV.clearMap();

		//判断是否选中
	        var pointFlag= document.getElementById('pointFlag');
		if(pointFlag.checked === true){
			if(dataType == "POINT"){
	        		// 是渲染，false是只画网格
	            		$.post(gisPointUrl, queryData, function (data) {
	            			if(data.length >0){
	            				GV.paintPoints(data); //画线
	            			}
	            		});
	        	}else{
	        		// 是渲染，false是只画网格
	            		$.post(gisLineUrl, queryData, function (data) {
	            			if(data.length >0){
	            				GV.paintLines(data); //画线
	            			}
	           		 });
	        	}

		}
        

        GV.setMapExtent();

        // GW.paintTrack(tracks); //画线
    }

    $("#btnSubmit").click(function () {
    	 
        if (!$('#tableCode').val()) {
            bootbox.alert({ 
         		  size: "small",
         		  title: "提示信息",
         		  message: "请选择查询菜单！"
         		});
            return;
        }
        
        if(!checkTime()){
    		return false;
    	}
    	if(!checkLongLatitude()){
    		return false;
    	}
        if ($('#inputForm').valid()) {
        	$("#loading").show();
        	initChildTable();
    	 
        }
    });
	
	function searchMainTable(hasChild){
		var queryData = getPostData();
        loadData(queryData, hasChild);// 加载数据
        $("#btnSubmit").attr("disabled", "disabled");
        setTimeout(function () {// 两秒后跳转
            $("#btnSubmit").attr("disabled", null);
        }, 2000);
        $("#searchTip").show();
	 	$(".right-top").hide();
	 	$("#subbox").show();
	}
//    $("#download").click(function () {
//        if (!$('#tableCode').val()) {
//            bootbox.alert({ 
//       		  size: "small",
//       		  title: "提示信息",
//       		  message: "请选择查询菜单！"
//       		});
//            return;
//        }
//        var queryData = getPostData();
//        $.post(makeFileUrl,queryData, function (data) {
//            $.download(downloadUrl,"post",data);
//        });
//    });
    $('#download').click(function () {
    	if (!$('#tableCode').val()) {
          bootbox.alert({ 
     		  size: "small",
     		  title: "提示信息",
     		  message: "请选择查询菜单！"
     		});
          return;
       }
    		var childCode = "";
    		if(childQueryData.length>0){
	    		if(typeof(childQueryData[childIndex].tableCode) != "undefined"){
	    			childCode = childQueryData[childIndex].tableCode;
	    		}
	    	}
        	var height = $(window).height()/2;
        	var width = 850;
            popWin.showWin(loadDownUrl + "?tableCode=" + $('#tableCode').val()+"&childCode="+childCode ,width,height,function(){});

    });

    // 文件下载
    jQuery.download = function(url, method, filename){
        jQuery('<form action="'+url+'" method="'+(method||'post')+'">' +  // action请求路径及推送方法
            '<input type="text" name="filename" value="'+filename+'"/>' + // 文件名称
            '</form>')
            .appendTo('body').submit().remove();
    };
    
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

        if (start > end) {
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
        if(parseInt(east) < parseInt(west)){
        	bootbox.alert({ 
       		  size: "small",
       		  title: "提示信息",
       		  message: "东经应大于西经！"
       		});
        	return false;
        }
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
    
    
    dojo.addOnLoad(GE.init);
    
    function checkTimeColumn(){
		var queryData = getPostData();
		$("#timeColumn").val("");
		$.post(checkTimeUrl, queryData, function (data) {
	    	if(data.status){
	    		$("#timeColumn").val(data.type);
	    		$('#startDate,#endDate').attr("readonly","false");
	    	}else{
	    		$('#startDate,#endDate').attr("readonly","readonly");
	    	}
	    });
	}
    function checkLongLatutide(){
		var queryData = getPostData();
		$("#longLaType").val("");
		$.post(checkLongLaUrl, queryData, function (data) {
	    	if(data.status){
	    		$("#longLaType").val(data.type);
	    	}else{
	    		$("#longLaType").val("");
	    	}
	    });
	}
    
	$("#searchTip").click(
		function(){
			if($(".right-top").is(":visible")){
				$(".right-top").hide();
				$("#searchTip").removeClass();
				$("#searchTip").addClass('hideSearch');
				$(".main-left").height(844);
			}else {
				$(".right-top").show();
				//$("#searchTip").hide();
				//$("#subbox").hide();
				$("#searchTip").removeClass();
				$("#searchTip").addClass('showSearch');
				$(".main-left").height(1029);
			}
		}
	);
	
	function initChildTable(){
		$.post(queryChildTableUrl, {"tableCode":$('#tableCode').val()}, function (data) {
			if(data.length>0){
				addChildTab(data);
				formChild(data);
				searchMainTable(true);
				$("#subbox").height(411);
			}else{
				childQueryData = [];
				searchMainTable(false);
				$("#subbox").height(0);
				$("#subbox").html("");
			}
	    });
	}
	
	function formChild(tables){
		childQueryData = [];
		for(var i=0; i<tables.length;i++){
			var temp = new Object();
			temp.tableId = tables[i].TABLENAME;
			temp.tableCode = tables[i].TABLECODE;
			childQueryData.push(temp);
		}
	}
	
	function addChildTab(tables){
		
		var info = "<ul id='tab' style='display:flex'>";
		for(var j=0;j<tables.length;j++){
			if(j == 0){
				info += "<li class='current'>"+ tables[j].TABLECNNAME +"</li>";
			}else{
				info += "<li >"+ tables[j].TABLECNNAME +"</li>";
			}
		}
		info +="<div style='height: 100%;width:73%'></ul>" ;

		info += "<div id='content' style='padding: 15px 10px;'>";
		for(var i=0;i<tables.length;i++ ){
			if(i==0){
				info += "<ul>"+getTableHtml(tables[i].TABLENAME)+"</ul>" ;
			}else{
				info += "<ul style='display:none'>"+getTableHtml(tables[i].TABLENAME)+"</ul>" ;
			}
		}
		
		info += "</div>";
		$('#subbox').html(info);
		
		var $li = $('#tab li');
		var $ul = $('#content ul');
		$li.click(function(){
			var $this = $(this);
			var $t = $this.index();
			childIndex = $t;
			$li.removeClass();
			$this.addClass('current');
			$ul.css('display','none');
			$ul.eq($t).css('display','block');
			 $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
		})
			
			
	}
	
	function getTableHtml(id){
		var result = "<table id='"+ id +"' cellpadding='0' cellspacing='0' class='table-striped"+
            "table-hover table-bordered dataTable no-footer' role='grid'  style='width:100%;table-layout:fixed'></table>";
        return result;
	}
	
	/** $("#example").mouseover(function(){
	    	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
	  });
	 $("#subbox").mouseover(function(){
		 $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
	 });**/
	function loadJqGrid1(queryData, tableId, tableCode,i) {
		if (typeof(childQueryData[i].datatable) != "undefined") {
        	childQueryData[i].datatable.destroy();
        	childQueryData[i].datatable.clear();
        }
        // 加载表头
        $.post(viewColumn, {"tableCode": tableCode}, function (data) {
            var thead = "<thead><tr>";
            var columns = '[';
            $.each(data, function (index, value) {
                if(typeof(value.label) == 'undefined'){
            		thead += "<th style='text-align: center;width:120px'> <div class='line-limit-length' width='120px' title="+value.id+">" + value.id + "</div> </th>";
            	}else{
            		thead += "<th style='text-align: center;width:120px'> <div class='line-limit-length' width='120px' title="+value.label+">" + value.label + "</div> </th>";
            	}
                if (index > 0) {
                    columns += ","
                }
                columns +='{"data": "'+value.id+'","defaultContent": "","render":'+
		            'function(data,type,full,meta){'+
		            	'if(data){'+
		            		'return "<div class=\'line-limit-length\' width=\'120px\' title="+data.toString().replace(" ","")+">"+data+"<div>";'+
		            	'}else{'+
		            		'return ""'+
		            	'}'+
		            '}'+
		    	'}'
            });
            columns +="]";
            thead += "</th></tr></thead>";
            $("#"+tableId).html("");
            $("#"+tableId).html(thead);
            if(data.length>8){
            	var wid = data.length/8*100;
                $("#"+tableId).width(wid + "%");
            }
            
            childQueryData[i].datatable = $('#'+tableId).DataTable({
                "processing": true,
                "serverSide": true,
                "bPaginate": true,//分页工具条显示
                "searching": false,
                "ordering": false,
                "scrollX": true,
                "scrollY": "220px",
                "scrollCollapse": true,
                "autoWidth": false,
                "columnDefs":[{"width":"100px",targets:'_all'}],
                "ajax": {
                    "url": listChildDataUrl,
                    "type": "POST",
                    "dataType": "json",
                    "data": queryData,
                    "dataSrc": "list",
                },
                "columns": eval(columns),
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
        });
    }

});
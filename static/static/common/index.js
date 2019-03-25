$().ready(
		function() {
			$('.shijian .btn-success').click(function() {
				$('.chaxun').show(100);
			});
			$('.datepicker3').click(function() {
				WdatePicker({
					dateFmt : 'yyyy-MM-dd',
					isShowClear : false,
					readOnly : true
				});
			});

			/**
			 * 获得查询条件
			 */
			function getPostData(){
				var subjectIds = '', factorIds = '';
				var subjectTree = $.fn.zTree.getZTreeObj("tree2");
				if (null != subjectTree) {
					var nodes = subjectTree.getCheckedNodes(true);
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].isParent) {
							if (subjectIds.length > 1) {
								subjectIds += ",";
							}
							subjectIds += nodes[i].id;
						} else {
							if (factorIds.length > 1) {
								factorIds += ",";
							}
							factorIds += "'" + nodes[i].id + "'";
						}
					}
				}
				

				var queryType = 'day';
				if (null != $("#startDate").val() && null != $("#endDate").val()) {
					var from_date = new Date($("#startDate").val());
					var end_date = new Date($("#endDate").val());
					var time_different = (end_date - from_date) / 86400000; //也就是24*60*60*1000 单位是毫秒
					if (time_different > 180) {
						queryType = 'month';
						if (time_different > 3650) {
							queryType = 'year';
						}
					}
				}
				
				
				return {
					startDate : $("#startDate").val(),
					endDate : $("#endDate").val(),
					queryType : queryType,
					north : $("#north").val(),
					west : $("#west").val(),
					east : $("#east").val(),
					south : $("#south").val(),
					subjectIds : subjectIds,
					factorIds : factorIds
				};
			};
			
			function refreshChartData() {
				$.post(countUrl,getPostData(), function(data) {
					var option = myChart.getOption();
					var series = [], xaxis = [];
					for (var i = 0; i < data.length; i++) {
						xaxis.push(data[i].dateYear);
						series.push(data[i].dataCount);
					}
					option.series[0].data = series;
					option.xAxis[0].data = xaxis;
					myChart.setOption(option);
				});
			}
			
//			var zNodes = [ {
//				id : "204",
//				name : "观测",
//				children : [ {
//					id : "1401",
//					name : "海洋站"
//				}, {
//					id : "1402",
//					name : "浮标"
//				}, {
//					id : "1403",
//					name : "雷达"
//				}, {
//					id : "1404",
//					name : "志愿船"
//				}, {
//					id : "1405",
//					name : "断面"
//				} ]
//			}, {
//				id : "205",
//				name : "监测",
//				children : [ {
//					id : "1801",
//					name : "生物"
//				}, {
//					id : "1802",
//					name : "化学"
//				}, {
//					id : "1803",
//					name : "水文气象"
//				}, {
//					id : "1805",
//					name : "潮间带生物"
//				}, {
//					id : "1806",
//					name : "沉积物放射性"
//				}, {
//					id : "1807",
//					name : "沉积物粒度"
//				}, {
//					id : "1808",
//					name : "沉积物质量"
//				}, {
//					id : "1809",
//					name : "赤潮贝毒"
//				}, {
//					id : "1810",
//					name : "赤潮生物"
//				}, {
//					id : "1811",
//					name : "大气放射性"
//				}, {
//					id : "1812",
//					name : "底栖生物"
//				}, {
//					id : "1813",
//					name : "二氧化碳分压"
//				}, {
//					id : "1814",
//					name : "二氧化碳气溶胶"
//				}, {
//					id : "1815",
//					name : "浮游动物"
//				}, {
//					id : "1816",
//					name : "浮游植物"
//				}, {
//					id : "1817",
//					name : "海草床群落"
//				}, {
//					id : "1818",
//					name : "海水放射性"
//				}, {
//					id : "1819",
//					name : "海水入侵"
//				}, {
//					id : "1820",
//					name : "海水水质"
//				}, {
//					id : "1821",
//					name : "海洋大气"
//				}, {
//					id : "1822",
//					name : "海洋垃圾"
//				}, {
//					id : "1823",
//					name : "红树林群落"
//				}, {
//					id : "1824",
//					name : "陆源入海水质"
//				}, {
//					id : "1825",
//					name : "珊瑚礁底栖藻类"
//				}, {
//					id : "1826",
//					name : "珊瑚礁群落"
//				}, {
//					id : "1827",
//					name : "珊瑚礁鱼类"
//				}, {
//					id : "1828",
//					name : "生物放射性"
//				}, {
//					id : "1829",
//					name : "生物质量"
//				}, {
//					id : "1830",
//					name : "土壤盐渍化"
//				}, {
//					id : "1831",
//					name : "鱼卵仔鱼"
//				} ]
//			}, {
//				id : "202",
//				name : "专项",
//				children : [ {
//					id : "1201",
//					name : "专项908"
//				}, {
//					id : "1202",
//					name : "专项927"
//				}, {
//					id : "1203",
//					name : "专项703"
//				}, {
//					id : "1204",
//					name : "专项126"
//				}, {
//					id : "1205",
//					name : "专项530"
//				}, {
//					id : "1206",
//					name : "专项706"
//				} ]
//			}, {
//				id : "209",
//				name : "国际",
//				children : [ {
//					id : "1901",
//					name : "Argo"
//				}, {
//					id : "1902",
//					name : "GTSPP"
//				}, {
//					id : "1903",
//					name : "WOD"
//				}, {
//					id : "1904",
//					name : "IMMA"
//				}, {
//					id : "1905",
//					name : "GTS"
//				}, {
//					id : "1906",
//					name : "NDBC"
//				}, {
//					id : "1907",
//					name : "DBCP"
//				}, {
//					id : "1908",
//					name : "NEAR-GOOS"
//				}, {
//					id : "1909",
//					name : "GLOSS"
//				}, {
//					id : "1910",
//					name : "IOC水位"
//				}, {
//					id : "1911",
//					name : "香港水位站"
//				}, {
//					id : "1912",
//					name : "美国海洋站"
//				} ]
//			}, {
//				id : "208",
//				name : "大洋",
//				children : [ {
//					id : "1601",
//					name : "航次1"
//				}, {
//					id : "1602",
//					name : "航次2"
//				}, {
//					id : "1603",
//					name : "航次3"
//				}, {
//					id : "1604",
//					name : "航次4"
//				}, {
//					id : "1605",
//					name : "航次5"
//				}, {
//					id : "1606",
//					name : "航次6"
//				}, {
//					id : "1607",
//					name : "航次7"
//				} ]
//			}, {
//				id : "206",
//				name : "极地",
//				children : [ {
//					id : "1701",
//					name : "水文"
//				}, {
//					id : "1702",
//					name : "气象"
//				}, {
//					id : "1703",
//					name : "地质"
//				}, {
//					id : "1704",
//					name : "地球物理"
//				}, {
//					id : "1705",
//					name : "生物"
//				}, {
//					id : "1706",
//					name : "化学"
//				}, {
//					id : "1707",
//					name : "声光"
//				} ]
//			} ];
//
//			$.fn.zTree.init($("#tree1"), {
//				check : {
//					enable : true
//				}
//			}, zNodes);
//			
//			
//			var showNodes=[];	//用于存储查询到的结点
//
//
//			$(function(){
//				init();
//				setCheck();
//			})
//
//			function setCheck() {
//						var zTree = $.fn.zTree.getZTreeObj("tree-obj");
//						type = { "Y":p + s, "N":p + s};
//						zTree.setting.check.chkboxType = type;
//						showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
//			}
//
//			function init(){
//				var zNodes=[
//					{ id:123456, pId:0, name:"根节点", open:true},	
//					{ id:1, pId:123456, name:"部门1", open:true},
//					{ id:11, pId:1, name:"部门1.1", open:true},
//					{ id:111, pId:11, name:"部门1.1.1"},
//					{ id:112, pId:11, name:"部门1.1.2"},
//					{ id:12, pId:1, name:"部门1.2", open:true},
//					{ id:121, pId:12, name:"部门1.2.1"},
//					{ id:122, pId:12, name:"部门1.2.2"},
//					{ id:123, pId:12, name:"部门1.2.3"},
//					{ id:124, pId:12, name:"部门1.2.4"},
//					{ id:125, pId:12, name:"部门1.2.5"},
//					{ id:126, pId:12, name:"部门1.2.6"},
//					{ id:127, pId:12, name:"部门1.2.7"},
//					{ id:128, pId:12, name:"部门1.2.8"},
//					{ id:2, pId:123456, name:"部门2", checked:true, open:true},
//					{ id:21, pId:2, name:"部门2.1"},
//					{ id:22, pId:2, name:"部门2.2", open:true},
//					{ id:221, pId:22, name:"部门2.2.1", checked:true},
//					{ id:222, pId:22, name:"部门2.2.2"},
//					{ id:23, pId:2, name:"部门2.3"},
//					{ id:24, pId:2, name:"部门2.4"},
//					{ id:25, pId:2, name:"部门2.5"},
//					{ id:26, pId:2, name:"部门2.6"},
//					{ id:27, pId:2, name:"部门2.7"},
//					{ id:28, pId:2, name:"部门2.8"},
//					{ id:29, pId:2, name:"部门2.9"}
//				];
//
//				var setting = {
//					check: {
//							enable: true
//					},
//					data: {
//						simpleData: {
//							enable: true
//						}
//					},
//				};
//
//				zTreeObj = $.fn.zTree.init($("#tree-obj"), setting, zNodes);
//				$("#search-bt").click(searchNodes);
//			};
//
//			//用按钮查询节点
//			function searchNodes(){
//				var treeObj = $.fn.zTree.getZTreeObj("tree-obj");
//				var keywords=$("#keyword").val();
//			    var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
//				if (nodes.length>0) {
//					treeObj.selectNode(nodes[0]);
//				}
//			}
//
//			//input框变化时查询节点
//			document.getElementById("keyword").addEventListener("input", test, false);
//			function test(){
//				var treeObj = $.fn.zTree.getZTreeObj("tree-obj");
//				var keywords=$("#keyword").val();
//			    var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
//				if (nodes.length>0) {
//					treeObj.selectNode(nodes[0]);
//				}
//			}
//
//			// 查找指定的数组
//			function getNode(id, array){
//				var node;
//				for (var i = 0; i < array.length; i++) {
//					if(id == array[i].id) {
//						node = array[i];
//					}
//				}
//				return node;
//			}
//			
//			setTimeout(function () {
//				// 加载学科要素
//				var suNodes = [];
//				$.post(subjectFactorUrl, function(data) {
//					$.each(data,function(index,data) {
//			            var tnode = getNode(data.subjectCode, suNodes);
//			            if (null == tnode) {
//			            	tnode = {id:data.subjectCode, name:data.subjectName, 
//			            			children : [{id:data.factorCode, name:data.factorName}]
//			            	};
//			            	suNodes.push(tnode);
//						} else {
//							var fnode = {id:data.factorCode, name:data.factorName};
//							tnode.children.push(fnode);
//						}
//			        });
//					
//					var subjectTree = $.fn.zTree.init($("#tree2"), {
//						check : {
//							enable : true
//						}
//					}, suNodes);
//				});
//			}, 1000);
			
			// 初始化图形
			$('.tab').find('li').click(function() {
				var index = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$('.content').find('li').eq(index).show().siblings().hide();
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
						number : '<span style="color:red">输入合法的经纬度</span>',
						maxlength : '<span style="color:red">不能大于15位</span>'
					},
					west : {
						number : '<span style="color:red">输入合法的经纬度</span>',
						maxlength : '<span style="color:red">不能大于15位</span>'
					},
					east : {
						number : '<span style="color:red">输入合法的经纬度</span>',
						maxlength : '<span style="color:red">不能大于15位</span>'
					},
					south : {
						number : '<span style="color:red">输入合法的经纬度</span>',
						maxlength : '<span style="color:red">不能大于15位</span>'
					}
				},
				submitHandler : function(form) {
					loading('正在查询，请稍等...');
					form.submit();
				}
			});

			$('#btnClean').click(function() {
				validate.resetForm();
			});
			
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
				sortable : false
			}, {
				name : 'download',
				index : 'download',
				width : '10%',
				align : "center",
				sortable : false
			}];

			$("#listtable").jqGrid({
				url : listUrl,
				mtype : "POST",
				datatype : "json",
				styleUI : 'Bootstrap',
				colNames : [ '学科', '要素', '来源', '来源子项', '数据量','编辑' ],
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
				caption:"数据统计"
			});
			
			$("#listtable").jqGrid('navGrid', '#listpager', {
				edit : false,
				add : false,
				del : false,
				search : false
			});
			
			$("#btnSubmit").click(function() {
				if ($('#inputForm').valid()) {
					// 重刷表格数据
					
					$("#listtable").jqGrid('setGridParam', {
						postData : getPostData(),
					}).showCol("bcategoryName").showCol("srcategoryName").trigger("reloadGrid"); // 重新载入
					
					// 重刷gis数据
					GV.amountQueryEvent(testjson,true);  //网格查询,true 是渲染，false是只画网格
					GV.paintPoints(tracks);		//画线
					GW.paintTrack(tracks);		//画线
				}
				
			});
			
			var myChart = echarts.init(document.getElementById('timeImage'));
			var option = {
				    title : {
				        text: '时间分布图',
				        subtext: '数据量'
				    },
				    tooltip : {
				        trigger: 'axis'
				    },
				    legend: {
				        data:['数据量']
				    },
				    toolbox: {
				        show : true,
				        feature : {
				            mark : {show: false},
				            dataView : {show: true, readOnly: false},
				            magicType : {show: true, type: ['line', 'bar']},
				            restore : {show: false},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : ['周一']
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            axisLabel : {
				                formatter: '{value}'
				            }
				        }
				    ],
				    series : [
				        {
				            name:'数据量',
				            type:'line',
				            data:[11],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name: '平均值'}
				                ]
				            }
				        },
				    ]
				};
			// 为echarts对象加载数据
			myChart.setOption(option);
			refreshChartData();
			
//			GV.amountQueryEvent(testjson,true);  //网格查询,true 是渲染，false是只画网格
//			GV.paintPoints(tracks);		//画线
//			GW.paintTrack(tracks);
		});

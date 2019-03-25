var GW=(
	function() {
		// 地图
		var map;
		
		var legend;

		var finshnetUrl = "http://192.168.4.131:6080/arcgis/rest/services/fishnet1/MapServer/0";

		var baseMapUrl = "http://18.1.1.49:6080/arcgis/rest/services/BaseMap_Vector_WGS1984_Mercator/MapServer";
		return {
			getBaseMapUrl:function(){
				return baseMapUrl;
			},
			getFinshnetUrl:function(){
				return finshnetUrl;
			},
			setMap:function(Map) {
				map=Map;
			},
			getMap:function() {
				return map;
			},
			setLegend:function(Legend){
				legend = Legend;
			},
			getLegend:function(){
				return legend;
			}
			
		}		
	}()
);
GW.queryConfig={
    id:"gridId",
    value:"dataCount"
}
GW.pointConfig={
    x:"longitude",
    y:"latitude"
}
GW.layerDefinition = {

	"indicatorLyr": {
		"geometryType": "esriGeometryPolygon",
		"objectIdField": "ObjectID",
		"drawingInfo": {
			"renderer": {
				
			}
		},
		"fields": [{
				"name": "ObjectID",
				"alias": "ObjectID",
				"type": "esriFieldTypeOID"
			}, {
				"name": "indicatorName",
				"alias": "indicatorName",
			"<t></t>ype": "esriFieldTypeString"
			}, {
				"name": "name",
				"alias": "name",
				"type": "esriFieldTypeString"
			}
			, {
				"name": "year",
				"alias": "year",
				"type": "esriFieldTypeString"
			}, {
				"name": "value",
				"alias": "value",
				"type": "esriFieldTypeString"
		}]
	}
}

// 包含所有图层的渲染信息，从这里获取所有的渲染信息
GW.rendererCofig = {
	
	"indicatorLyr": {
		geometryType: "polygon",
		legendTitle: "要素值",
		symbol: {
			// "symbol"	
			lineWidth: 0.1,
			lineColor: "#000"			
		},
		renderer: {
			// "visualVariables"
			type: "colorInfo",
			field: GW.queryConfig.value,
			normalizationField: "",

			// 想要这些值是可以被改变的
			stopsValue: [4000,21000,42000],

			stopsNum: 7,
			
			// stopsColor: ["#6680ff",'#ff80d5','#ff4040']
			stopsColor: [
				[255, 160, 122, 0.5],
				[255, 140, 0, 0.5],
				[255, 99, 71, 0.5],
				[255, 69, 0, 0.5],
				[255, 48, 48, 0.5],
				[255,  0,  0, 0.5]
			]
			
		}
	}
}



// 包含所有图层的渲染信息，从这里获取所有的弹窗
GW.templateCofig = {

	"indicatorLyr": {
		title: "<b>" + "${id}" + "</b>",
		description: "<b>地区：</b>${value} <br/>" +
			"<b>年份：</b>${value} 年<br/>" + 
			"<b>要素值：</b>${value} <br/>" +
			"<b>数值：</b>${value} 亿元<br/>"
	}

}

GW.getInfoTemplate = function(layerName) {

	// 生成一个renderer，然后返回
	function get(config) {

		var template = new esri.InfoTemplate(config.title, config.description)
		return template;
	}

	var config = GW.templateCofig[layerName];

	var template = get(config);

	return template;
	
}


// 渲染参数
GW.getRenderer = function(layerName, data){
	
	// 生成一个renderer，然后返回
	function get(config) {

		var geometryType =  config.geometryType;
		if(geometryType == "polygon"){

			// 面图层
			var r = getPolygonRenderer(config, data);
		} else if(geometryType == "point"){

			// 点图层
			var r = getPointRenderer(config);
		}

		return r;		
	}

	function getPolygonRenderer(config, data) {

		var lineWidth = config.symbol.lineWidth,
			lineColor = config.symbol.lineColor,
			legendTitle = "要素值",
			// stopsValue = config.renderer.stopsValue,
			stopsNum = config.renderer.stopsNum,
			stopsColor = config.renderer.stopsColor,
			type = config.renderer.type,
			field = config.renderer.field,
			normalizationField = config.renderer.normalizationField;

		var stopsValue = getStopsValue(data, stopsNum);

		// symbol
		var line = new esri.symbol.SimpleLineSymbol().setWidth(lineWidth).setColor(new esri.Color(lineColor));
		var symbol = new esri.symbol.SimpleFillSymbol().setOutline(line);

		var stops = [];
		for (var i = 0; i < stopsValue.length; i++) {
			var b = {
				"value": stopsValue[i],
				"color": new esri.Color(stopsColor[i])
		    }
			stops.push(b);
		}

		var r = new esri.renderer.SimpleRenderer({
			symbol: symbol,
			visualVariables: [{
				type: type,
				field: field,
				normalizationField: normalizationField,	
				legendOptions: {
					showLegend: false,
					title: legendTitle
				},				
				stops: stops
			}]
		});		

		return r;
	}

	// 获取图例分割的节点值
	function getStopsValue(data, num) {

		var stopsValue = [];

		// data就是个包含所有value属性值的数组 data = [{value: 1}, {value: 2}, {value: 100}]
		// data = [{value: 1}, {value: 2}, {value: 100}];
		var value = []
		for (var i = 0; i < data.length; i++) {
			value.push(data[i][[GW.queryConfig.value]]);
		}

		var max = Math.max.apply(null, value);
		var min = Math.min.apply(null, value);

		var interb = max - min;

		if(num >= 4){
			var interPercent = [0.1, 0.25, 0.35, 0.5, 0.75, 1];
			num = 7;
		} else if(num == 3){
			var interPercent = [0.15, 0.35, 0.45, 0.05];
		} else if(num == 2){
			var interPercent = [0.10, 0.85, 0.05];
		}

		var v = min;
		for (var i = 0; i < num - 1; i++) {
			v =  interPercent[i] * interb;
			stopsValue.push(v);
		}

		if(max > 2){

			// 如果数比较大，但是出现小数，则取整
			for (var i = 0; i < stopsValue.length; i++) {
				var a = stopsValue[i];
				stopsValue[i] = Math.round(a);
			}
		} else {
			// 如果数都比较小，则保留两位小数
			for (var i = 0; i < stopsValue.length; i++) {
				var a = stopsValue[i];
				stopsValue[i] = Math.round(a*100)/100;
			}		
		}

		return stopsValue;
	}

	function getPointRenderer(config) {

		var symbol = config.symbol,
			type = config.renderer.type,
			value = config.renderer.value,
			valueSymbol = config.renderer.valueSymbol,			
			field = config.renderer.field;

		if(type == "PictureMarkerSymbol"){

			// var defaultSymbol = new esri.symbol.PictureMarkerSymbol(symbol);
            var defaultSymbol = new esri.symbol.SimpleMarkerSymbol(symbol);
			var renderer = new esri.renderer.SimpleRenderer(defaultSymbol);

		} else if(type == "uniqueValue"){

			var defaultSymbol = new esri.symbol.SimpleMarkerSymbol().setSize(0).setOutline(null); 	

			var renderer = new esri.renderer.UniqueValueRenderer(null, field);

			for (var i = 0; i < value.length; i++) {
				// renderer.addValue(value[i], new esri.symbol.PictureMarkerSymbol(valueSymbol[i]));
                renderer.addValue(value[i], new esri.symbol.SimpleMarkerSymbol(valueSymbol[i]));
			}
		}

		return renderer;

	}

	var config = GW.rendererCofig[layerName];

	var renderer = get(config);

	return renderer;
	
}


GW.amountQueryEvent = function (testjson,flag) {
	
	search ();
	// 查询
	function search (){
		
		GW.def = new dojo.Deferred();
		createLyr(testjson);
		if(!flag){
			return;
		}
		 GW.setRenderer2Lyr("indicatorLyr",testjson);
		
		
		GW.def.then(
			function(res){

				 createLegend(GW.getLayer("indicatorLyr"),testjson);

			},
			function(err){       
				console.log("加载地图失败"); 
			}
		);
	}


	// 清除查询结果
	function clear (argument) {

		GW.emptyLyr("indicatorLyr");
		// 清除图例
		clearLegend();
	}

     
	function createLyr(cData) {

		var current = {
			layerName: "indicatorLyr",
			
			data: cData
		}
		
		// 清空这个Graphic图层中的数据
		GW.emptyLyr(current.layerName);
		

		// 生成新的图层数据
		GW.generateLyr(current,flag);
	}	


	function createLegend (flyr) {

		var map = GW.getMap();
		
		require(["esri/dijit/Legend", "dojo/dom", "dojo/dom-construct"], 
			function(Legend, dom, domConstruct) { 
				var legend = GW.getLegend();
			// destroy previous legend, if present
			if ( legend ) {
				legend.destroy();
				domConstruct.destroy(dojo.byId("legendDiv"));
			}
			
			// create a new div for the legend
			var legendDiv = domConstruct.create("div", {
				id: "legendDiv"
			}, dom.byId("info1"));

			// var id = getQueryTargetId();

			// var title ='产量(单位：吨)';
			
			legend = new Legend({
				map : map,
				layerInfos : [{
					layer : flyr,
					title : '全量查询'
				}]
			}, legendDiv);

			legend.startup();
			GW.setLegend(legend);
		});		
	}

}

GW.generateLyr = function(config,flag){
	require(["esri/layers/GraphicsLayer", "esri/geometry/Polyline", "dojo/_base/lang", "dojo/parser", "dojo/on", "esri/map", "esri/geometry/Extent", "esri/SpatialReference", "esri/config", "esri/layers/LayerInfo", "esri/layers/ArcGISTiledMapServiceLayer", "esri/tasks/GeometryService", "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters", "esri/layers/FeatureLayer", "esri/graphic", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Polygon", "esri/geometry/Point", "esri/tasks/FindTask", "esri/tasks/FindParameters", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/toolbars/navigation", 'esri/toolbars/draw', 'esri/toolbars/edit', 'esri/tasks/QueryTask', 'esri/geometry/geometryEngine', 'esri/tasks/query', "esri/dijit/HomeButton", "dojo/query", "dojo/_base/fx", "esri/dijit/Scalebar", "dojo/fx/easing", 'esri/symbols/SimpleLineSymbol', 'esri/Color', "dojo/_base/array", "dojo/data/ItemFileReadStore", "dojox/grid/DataGrid", "dojo/domReady!GW"],
			function (GraphicsLayer, Polyline,lang, parser, on, Map, Extent, SpatialReference, esriConfig, LayerInfo, ArcGISTiledMapServiceLayer, GeometryService, LengthsParameters, AreasAndLengthsParameters, FeatureLayer, Graphic, ArcGISDynamicMapServiceLayer, Polygon, Point, FindTask, FindParameters, IdentifyTask, IdentifyParameters, InfoTemplate, SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, Navigation, Draw, Edit, QueryTask, geometryEngine, Query, HomeButton, query, fx, Scalebar, easing, SimpleLineSymbol, Color, array, ItemFileReadStore) 
	{

	/* layerName用于获取featuLyr和graphicLyr
	 * var featureConfig = GW.featureLayer[layerName][areaId];
	 * var graphicConfig = GW.graphicLyrs[layerName];
	 */
	var layerName = config.layerName,

	// 属性数据
	data = config.data;

	// 用于了解当前对应的是那个地区的图层
	// var areaId = GW.graphicLyrs["areaId"];

	getGeometry();

	// 获取featureLayer中的图形要素
	function getGeometry() {

		var ServiceUrl = GW.getFinshnetUrl();


		// 获取featureLayer的信息			
		var queryTask = new esri.tasks.QueryTask(ServiceUrl);

		var query = new esri.tasks.Query();

		// query.text = "'%'";

		query.where = "1=1"; 

		query.outFields = ["*"];

		//query.geometry = new esri.geometry.Extent(117.86, 37.23, 125., 40.79, 4326);

		query.returnGeometry = true;

		query.outSpatialReference = GW.getMap().spatialReference;

		queryTask.outSpatialReference = GW.getMap().spatialReference;

		queryTask.on("complete", updateLyr);
		
		queryTask.execute(query);
		
		return "";
	}

	function updateLyr(results) {

		var features = results.featureSet.features;

		// 将图形对象和指标数据重组图层
		var gLyr = generLyr(features, data, layerName);

		gLyr.redraw();


	}

	function generLyr(features, data, layerName) {
		
		var layer = GW.getLayer(layerName);
		var graphics = [];
		var symbol = new  SimpleFillSymbol().setColor(null).outline.setColor("black");
		// var extent = new esri.geometry.Extent(121.3332066935,13.2399454993,154.0722656250,40.2124972941,4326);

		// 找到一一对应关系组合成graphic
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < features.length; j++) {
				
				var a = features[j]["attributes"];
				var d = data[i]
				// if(extent.contains(features[j]["geometry"])){
					if(d[[GW.queryConfig.id]] == a["FID"]){
						var attributes = dojo.clone(d);

						attributes.ObjectID = j + 1;
						var geometry = dojo.clone(features[j]["geometry"]);
						geometry.spatialReference = new esri.SpatialReference({
							wkid : 4326
						});
						// 有renderer，因此symbol是空
						if(flag){
							var g = new esri.Graphic(geometry, null, attributes, null);
							graphics.push(g);
						}else{
							var g = new esri.Graphic(geometry, symbol, attributes, null);
							graphics.push(g);
						}
						
						break;
					}
				// }
				
			}
		}
		layer.applyEdits(graphics, null, null); 
		return layer;
	}
  })	
}


// 清空FeatureLayer图层中的数据
GW.emptyLyr = function(layerName){

	// 获取FeatureLayer
	var layer = GW.getLayer(layerName);

	if(!layer) {
		return;
	}

	var graphics = layer.graphics;

	// 删除Layer中的内容，怎么写查一下
	layer.applyEdits(null, null, graphics); 
}

GW.getLayer = function(layerName){
	var map = GW.getMap();
	return map.getLayer(layerName);
}



// 主要用于面图层的图例设置
GW.setRenderer2Lyr = function (layerName,testjson) {
	
	getData();
	
	// 从后台获取数据
	function getData() {

		// $.getJSON('./test.json',function(datareturn) {
				var layer = GW.getLayer(layerName);
				var renderer = GW.getRenderer(layerName, testjson);

				layer.setRenderer(renderer);
				layer.redraw();
        

        		GW.def.resolve();

		 // });	

     
	}

	function getUnit(data) {
		
		var unitField = GW.chartConfig_2.unitField;
		if(data.length > 0){
			return data[0][unitField];
		} else {
			return "";
		}
		
	
	}

	// 处理后的是包含value属性的数组
	function getFormatData(data) {

		// 可能是获取不同的数据的值
		var attris = ["value", "unitNum"];
		var cData = [];

		for (var i = 0; i < attris.length; i++) {
			var attri = attris[i];
			if(data[0][attri] || data[0][attri] === 0){

				for (var i = 0; i < data.length; i++) {
					var d = {
						value: data[i][attri]
					}
					cData.push(d);
				}
					
				break;
			}
		}
		
		return cData;		
	}

	

	// 更新图例
	function updateLegend(){
		var legend = GW.legendConfig.legendTarget;
		var layerInfos = legend.layerInfos;
		legend.refresh(layerInfos);
	}
	
}



GW.init = function(mapDiv){
require(["esri/layers/GraphicsLayer", "esri/geometry/Polyline", "dojo/_base/lang", "dojo/parser", "dojo/on", "esri/map", "esri/geometry/Extent", "esri/SpatialReference", "esri/config", "esri/layers/LayerInfo", "esri/layers/ArcGISTiledMapServiceLayer", "esri/tasks/GeometryService", "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters", "esri/layers/FeatureLayer", "esri/graphic", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Polygon", "esri/geometry/Point", "esri/tasks/FindTask", "esri/tasks/FindParameters", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/toolbars/navigation", 'esri/toolbars/draw', 'esri/toolbars/edit', 'esri/tasks/QueryTask', 'esri/geometry/geometryEngine', 'esri/tasks/query', "esri/dijit/HomeButton", "dojo/query", "dojo/_base/fx", "esri/dijit/Scalebar", "dojo/fx/easing", 'esri/symbols/SimpleLineSymbol', 'esri/Color', "dojo/_base/array", "dojo/data/ItemFileReadStore", "dojox/grid/DataGrid", "dojo/domReady!GW"],
		function (GraphicsLayer, Polyline,lang, parser, on, Map, Extent, SpatialReference, esriConfig, LayerInfo, ArcGISTiledMapServiceLayer, GeometryService, LengthsParameters, AreasAndLengthsParameters, FeatureLayer, Graphic, ArcGISDynamicMapServiceLayer, Polygon, Point, FindTask, FindParameters, IdentifyTask, IdentifyParameters, InfoTemplate, SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, Navigation, Draw, Edit, QueryTask, geometryEngine, Query, HomeButton, query, fx, Scalebar, easing, SimpleLineSymbol, Color, array, ItemFileReadStore) {

	 var map;
	 var polyline = new esri.geometry.Polyline(new esri.SpatialReference({ wkid: 4326 }));
     var routeSymbols = new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5])).setWidth(2);
	 function init(){
		map = new esri.Map(mapDiv, 
				{
                    logo:false,
                    slider:false,
                    zoom: 7
				}
			);
		// map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer"));
		
		var extent = {
	        "xmin": 83.583984375,
	        "ymin": 18.80859375,
	        "xmax": 123.134765625,
	        "ymax": 45.17578125,
	        "spatialReference": { "wkid": 4326 }
   		 };
   		  var initialExtent = new Extent(extent);
   		  map.setExtent(initialExtent);
		 var basemap = new ArcGISTiledMapServiceLayer(GW.getBaseMapUrl(),
		 		{ id: "china",  visible: true });
		 map.addLayer(basemap);

		/*var china = new ArcGISTiledMapServiceLayer(
							"http://172.16.1.19:6080/arcgis/rest/services/baseMap_China/MapServer",
							{
								id : "china",
								visible : true
							});

		map.addLayer(china);
		var world = new ArcGISDynamicMapServiceLayer(
				"http://172.16.1.19:6080/arcgis/rest/services/baseMap_World/MapServer",
				{
					id : "world",
					visible : true
				});
		map.addLayer(world);*/
		addFeatureLyrs(FeatureLayer);
		GW.setMap(map);
	}
	
	dojo.addOnLoad(init);	
	
	

	function addFeatureLyrs(FeatureLayer) {


		var name = "indicatorLyr";

		var layerDefinition = GW.layerDefinition[name];
		var geometryType = layerDefinition["geometryType"];
		var featureCollection = {
			"layerDefinition": layerDefinition,
			"featureSet": {
				"features": [],
				"geometryType": geometryType
			}
		};

		//define a info template
        var infoTemplate = GW.getInfoTemplate(name);

		var featureLayer = new FeatureLayer(featureCollection, {id: name, infoTemplate: infoTemplate, mode: esri.layers.FeatureLayer.MODE_SNAPSHOT});

		map.addLayer(featureLayer);				

	}
	
})
}

GW.setMapExtent = function(xmin,ymin,xmax,ymax){
	var map = GW.getMap();
	var extent = new esri.geometry.Extent({ "xmin": xmin, "ymin": ymin, "xmax": xmax, "ymax": ymax, "spatialReference": { "wkid": 4326 }});
	map.setExtent(extent);
}


GW.paintPoints = function(data) {
	require([ "esri/layers/GraphicsLayer", "esri/geometry/Polyline",
			"dojo/_base/lang", "dojo/parser", "dojo/on", "esri/map",
			"esri/geometry/Extent", "esri/SpatialReference", "esri/config",
			"esri/layers/LayerInfo", "esri/layers/ArcGISTiledMapServiceLayer",
			"esri/tasks/GeometryService", "esri/tasks/LengthsParameters",
			"esri/tasks/AreasAndLengthsParameters", "esri/layers/FeatureLayer",
			"esri/graphic", "esri/layers/ArcGISDynamicMapServiceLayer",
			"esri/geometry/Polygon", "esri/geometry/Point",
			"esri/tasks/FindTask", "esri/tasks/FindParameters",
			"esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
			"esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
			"esri/symbols/SimpleFillSymbol",
			"esri/symbols/PictureMarkerSymbol", "esri/toolbars/navigation",
			'esri/toolbars/draw', 'esri/toolbars/edit', 'esri/tasks/QueryTask',
			'esri/geometry/geometryEngine', 'esri/tasks/query',
			"esri/dijit/HomeButton", "dojo/query", "dojo/_base/fx",
			"esri/dijit/Scalebar", "dojo/fx/easing",
			'esri/symbols/SimpleLineSymbol', 'esri/Color', "dojo/_base/array",
			"dojo/data/ItemFileReadStore", "dojox/grid/DataGrid",
			"dojo/domReady!GW" ], function(GraphicsLayer, Polyline, lang, parser,
                                           on, Map, Extent, SpatialReference, esriConfig, LayerInfo,
                                           ArcGISTiledMapServiceLayer, GeometryService, LengthsParameters,
                                           AreasAndLengthsParameters, FeatureLayer, Graphic,
                                           ArcGISDynamicMapServiceLayer, Polygon, Point, FindTask,
                                           FindParameters, IdentifyTask, IdentifyParameters, InfoTemplate,
                                           SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol,
                                           Navigation, Draw, Edit, QueryTask, geometryEngine, Query,
                                           HomeButton, query, fx, Scalebar, easing, SimpleLineSymbol, Color,
                                           array, ItemFileReadStore) {
		var map = GW.getMap();
		var polyline = new Polyline(new SpatialReference({
			wkid : 4326
		}));
		var routeSymbols = new SimpleLineSymbol().setColor(
				new Color([ 255, 0, 0, 0.5 ])).setWidth(2);
		paintTracks(data);
		function paintTracks(data) {
			map.graphics.clear();
			var shipData = data;
			var points = [];
			var path = [];
			for (var i = 0; i < shipData.length; i++) {
				var point = [];
				var y = shipData[i][[GW.pointConfig.y]];
				var x = shipData[i][[GW.pointConfig.x]];
				points[i] = "" + x + "," + y;
				point[0] = x;
				point[1] = y;
				path.push(point);
			}
			var paths = [];
			paths.push(path);
			paintsPoints(points, shipData, paths);
		}

		function paintPoint(point, arr, symbol) {

			var geometry = new esri.geometry.Point(point.substring(0, point
					.indexOf(',')), point.substring(point.indexOf(',') + 1,
					point.length), new esri.SpatialReference({
				wkid : 4326
			}));
			var graphic = new esri.Graphic(geometry, symbol, arr, null);

			map.graphics.add(graphic);
			// var extent = map.extent;
			// if (!extent.contains(graphic.geometry)) {
			// map.centerAt(geometry);
			// }
		}

		function paintsPoints(points, data, paths) {
			polyline.paths = paths;
			for (var i = 0; i < points.length; i++) {
				// var symbol = new
				// PictureMarkerSymbol("../../../CSS/Image/mapmarker-red.png",
				// 15, 15);
				var symbol = new SimpleMarkerSymbol(
						SimpleMarkerSymbol.STYLE_CIRCLE, 2,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL,
								new Color([ 247, 34, 101, 0.9 ]), 1),
						new Color([ 255, 0, 0, 0.8 ]));
				if (i == points.length - 1) {
					// symbol = new
					// PictureMarkerSymbol("../../../CSS/Image/mapM-red-1.png",
					// 15, 15);
				}
				paintPoint(points[i], data[i], symbol);
			}
			// paintRoads();
		}

		function paintRoads() {
			var graphic_polyline = new esri.Graphic(polyline, routeSymbols);
			map.graphics.add(graphic_polyline);
			var extent = graphic_polyline.geometry.getExtent().expand(2);
			map.setExtent(extent);
		}
	})
};

GW.paintTrack = function(data) {
	require([ "esri/layers/GraphicsLayer", "esri/geometry/Polyline",
			"dojo/_base/lang", "dojo/parser", "dojo/on", "esri/map",
			"esri/geometry/Extent", "esri/SpatialReference", "esri/config",
			"esri/layers/LayerInfo", "esri/layers/ArcGISTiledMapServiceLayer",
			"esri/tasks/GeometryService", "esri/tasks/LengthsParameters",
			"esri/tasks/AreasAndLengthsParameters", "esri/layers/FeatureLayer",
			"esri/graphic", "esri/layers/ArcGISDynamicMapServiceLayer",
			"esri/geometry/Polygon", "esri/geometry/Point",
			"esri/tasks/FindTask", "esri/tasks/FindParameters",
			"esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
			"esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
			"esri/symbols/SimpleFillSymbol",
			"esri/symbols/PictureMarkerSymbol", "esri/toolbars/navigation",
			'esri/toolbars/draw', 'esri/toolbars/edit', 'esri/tasks/QueryTask',
			'esri/geometry/geometryEngine', 'esri/tasks/query',
			"esri/dijit/HomeButton", "dojo/query", "dojo/_base/fx",
			"esri/dijit/Scalebar", "dojo/fx/easing",
			'esri/symbols/SimpleLineSymbol', 'esri/Color', "dojo/_base/array",
			"dojo/data/ItemFileReadStore", "dojox/grid/DataGrid",
			"dojo/domReady!GW" ], function(GraphicsLayer, Polyline, lang, parser,
                                           on, Map, Extent, SpatialReference, esriConfig, LayerInfo,
                                           ArcGISTiledMapServiceLayer, GeometryService, LengthsParameters,
                                           AreasAndLengthsParameters, FeatureLayer, Graphic,
                                           ArcGISDynamicMapServiceLayer, Polygon, Point, FindTask,
                                           FindParameters, IdentifyTask, IdentifyParameters, InfoTemplate,
                                           SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol,
                                           Navigation, Draw, Edit, QueryTask, geometryEngine, Query,
                                           HomeButton, query, fx, Scalebar, easing, SimpleLineSymbol, Color,
                                           array, ItemFileReadStore) {
		var map = GW.getMap();
		var polyline = new Polyline(new SpatialReference({
			wkid : 4326
		}));
		var routeSymbols = new SimpleLineSymbol().setColor(
				new Color([ 255, 0, 0, 0.5 ])).setWidth(2);
		paintTracks(data);
		function paintTracks(data) {
			map.graphics.clear();
			var shipData = data;
			var points = [];
			var path = [];
			for (var i = 0; i < shipData.length; i++) {
				var point = [];
				var y = shipData[i][[GW.pointConfig.y]];
				var x = shipData[i][[GW.pointConfig.x]];
				points[i] = "" + x + "," + y;
				point[0] = x;
				point[1] = y;
				path.push(point);
			}
			var paths = [];
			paths.push(path);
			paintsPoints(points, shipData, paths);
		}

		function paintPoint(point, arr, symbol) {

			var geometry = new esri.geometry.Point(point.substring(0, point
					.indexOf(',')), point.substring(point.indexOf(',') + 1,
					point.length), new esri.SpatialReference({
				wkid : 4326
			}));
			var graphic = new esri.Graphic(geometry, symbol, arr, null);

			map.graphics.add(graphic);
			// var extent = map.extent;
			// if (!extent.contains(graphic.geometry)) {
			// map.centerAt(geometry);
			// }
		}

		function paintsPoints(points, data, paths) {
			polyline.paths = paths;
			for (var i = 0; i < points.length; i++) {
				// var symbol = new
				// PictureMarkerSymbol("../../../CSS/Image/mapmarker-red.png",
				// 15, 15);
				var symbol = new SimpleMarkerSymbol(
						SimpleMarkerSymbol.STYLE_CIRCLE, 10,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL,
								new Color([ 247, 34, 101, 0.9 ]), 1),
						new Color([ 255, 0, 0, 0.8 ]));
				if (i == points.length - 1) {
					//symbol = new PictureMarkerSymbol("../../../CSS/Image/mapM-red-1.png", 15, 15);
				}
				paintPoint(points[i], data[i], symbol);
			}
			paintRoads();
		}

		function paintRoads() {
			var graphic_polyline = new esri.Graphic(polyline, routeSymbols);
			map.graphics.add(graphic_polyline);
			var extent = graphic_polyline.geometry.getExtent().expand(2);
			map.setExtent(extent);
		}
	})
}

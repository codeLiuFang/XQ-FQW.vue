var GE = (function () {
    // 地图
    var map;

    var extent;

    var tb;

//    var baseMapUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer";

     var baseMapUrl = "http://18.1.1.55:6080/arcgis/rest/services/BaseMap_Topo_WGS1984_Mercator/MapServer";
    return {
        getBaseMapUrl: function () {
            return baseMapUrl;
        },
        setMap: function (Map) {
            map = Map;
        },
        getMap: function () {
            return map;
        },
        setExtent: function (tent) {
            extent = tent;
        },
        getExtent: function () {
            return extent;
        },
        setTb: function (Tb) {
            tb = Tb;
        },
        getTb: function () {
            return tb;
        }
    }
}());

GE.init = function () {
    require([
            "esri/map", "esri/toolbars/draw", "esri/geometry/Extent", "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "dojo/domReady!selectExtent"
        ],
        function (Map, Draw, Extent, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer) {

            var map = new Map("mapDiv3",{
				logo : false,
				slider : false,
				zoom : 2
			});

             
            var extent = {
            		"xmin": 110.2483,
			        "ymin": 16.9483340496563,
			        "xmax": 140.0016667,
			        "ymax": 40.43333333,
			        "spatialReference": { "wkid": 4326 }
            };
            var initialExtent = new Extent(extent);
            map.setExtent(initialExtent);
            map.addLayer(new ArcGISTiledMapServiceLayer(GE.getBaseMapUrl()));
            GE.setExtent(initialExtent);
            $("#north").val(extent.ymax.toFixed(2));
            $("#south").val(extent.ymin.toFixed(2));
            $("#east").val(extent.xmax.toFixed(2));
            $("#west").val(extent.xmin.toFixed(2));
           /* var china = new ArcGISTiledMapServiceLayer(
                "http://172.16.1.19:6080/arcgis/rest/services/baseMap_China/MapServer",
                {
                    id: "china",
                    visible: true
                });

            map.addLayer(china);
            var world = new ArcGISDynamicMapServiceLayer(
                "http://172.16.1.19:6080/arcgis/rest/services/baseMap_World/MapServer",
                {
                    id: "world",
                    visible: true
                });
            map.addLayer(world);*/
            GE.setMap(map);

        })
}

GE.initSelect = function () {
    require([
            "esri/map", "esri/toolbars/draw", "esri/geometry/Extent", "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "dojo/domReady!selectExtent"
        ],
        function (Map, Draw, Extent, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer) {

            var map = GE.getMap();
            map.reposition();
            var templateCofig = {
                title: "<b>" + "${id}" + "</b>",
                description: "<b>地区：</b>${value} <br/>" +
                "<b>id：</b>${id} 年<br/>" +
                "<b>xmax：</b>${xmax} <br/>" +
                "<b>xmin：</b>${xmin} <br/>" +
                "<b>ymax：</b>${ymax} <br/>" +
                "<b>ymin：</b>${ymin} <br/>"
            }

            var tb = new Draw(map);

            tb.activate(Draw.EXTENT);
            GE.setTb(tb);

            dojo.connect(tb, "onDrawEnd", addGraphic);

            function addGraphic(geometry) {
                map.graphics.clear();
                geometry = esri.geometry.webMercatorToGeographic(geometry);
                var symbol = tb.fillSymbol;
                symbol.outline.width = 0;
                var extent = geometry.getExtent();
                GE.setExtent(extent);
                var arr = new Object();
                arr.xmax = extent.xmax;
                arr.ymax = extent.ymax;
                arr.xmin = extent.xmin;
                arr.ymin = extent.ymin;
	            if(arr.xmax < arr.xmin){
	            	geometry.xmin = -180;
	            	
 				    arr.id = "test";
					var infoTemplate = new esri.InfoTemplate(templateCofig.title, templateCofig.description);
					map.graphics.add(new esri.Graphic(geometry, symbol, arr, infoTemplate));
					geometry.xmin = arr.xmin;
						geometry.xmax = 180;
	            }
                
                arr.id = "test";
                var infoTemplate = new esri.InfoTemplate(templateCofig.title, templateCofig.description);
                map.graphics.add(new esri.Graphic(geometry, symbol, arr, infoTemplate));
                
            }

        })

}

GE.reset = function () {
    var map = GE.getMap();
    var tb = GE.getTb();
    map.graphics.clear();
}

GE.confirm = function () {
    var tb = GE.getTb();
    tb.deactivate();
    var extent = GE.getExtent();
    return extent;
}

GE.move= function(){
	var tb = GE.getTb();
    tb.deactivate();
}
GE.select = function(){
	var tb = GE.getTb();
	tb.activate(esri.toolbars.Draw.EXTENT);
}
$(document).ready(function ($) {
    $("#selectExtent").click(function () {
        ShowDiv();
        GE.initSelect();
    });

    $("#closeDiv").click(function () {
        CloseDiv();
    });
    $("#fade").click(function () {
    	CloseDiv();
    });
	
    //弹出隐藏层
    function ShowDiv() {
        document.getElementById("MyDiv").style.display = 'block';
        document.getElementById("fade").style.display = 'block';
        var bgdiv = document.getElementById("fade");
        bgdiv.style.width = document.body.scrollWidth;
        // bgdiv.style.height = $(document).height();
        $("#fade").height($(document).height());
    }

//关闭弹出层
    function CloseDiv() {
        document.getElementById("MyDiv").style.display = 'none';
        document.getElementById("fade").style.display = 'none';
    }

    $("#confim").click(function () {
        GE.confirm();
        CloseDiv();
        var extent = GE.getExtent();
        if (extent) {
            $("#north").val(extent.ymax.toFixed(6));
            $("#south").val(extent.ymin.toFixed(6));
            $("#east").val(extent.xmax.toFixed(6));
            $("#west").val(extent.xmin.toFixed(6));
        }
    });
//    $("#select").click(function () {
//        GE.initSelect();
//    });
    $("#moveSelect").click(function () {
    	var val = $("#moveSelect").val();
	    if(val == "拖动"){
	    	GE.move();
	    	$("#moveSelect").val("选择");
		}else{
			GE.select();
			$("#moveSelect").val("拖动");
		}
    });
});
///24.305877685546875
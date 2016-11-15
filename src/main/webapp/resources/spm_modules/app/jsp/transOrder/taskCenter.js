define('app/jsp/transOrder/taskCenter', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
	    Widget = require('arale-widget/1.2.0/widget'),
	    AjaxController = require('opt-ajax/1.0.0/index');
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    require("app/util/jsviews-ext");
	require("opt-paging/aiopt.pagination");
	require("my97DatePicker/WdatePicker");
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    
    var taskCenterPage = Widget.extend({
    	//属性，使用时由类的构造函数传入
    	attrs: {
    		clickId:""
    	},
    	
    	Statics: {
    		DEFAULT_PAGE_SIZE: 10
    	},
    	
    	//事件代理
    	events: {
			"click #submitQuery":"_orderList",
			"change #displayFlag":"_orderList",
			"change #translateType":"_orderList"
    	},
    	
      	//重写父类
    	setup: function () {
			taskCenterPage.superclass.setup.call(this);
    		//this._orderList();
    	},
    	
        //表单查询订单列表
        _orderList:function() {
        	var _this = this;
        	var displayFlag = $('#displayFlag option:selected').val();
        	var translateType  = $('#translateType option:selected').val();
        	var translateName  = $('#translateName').val();
        	var orderTimeStart = $("#orderTimeStart").val();
        	var stateChgTimeEnd = $("#stateChgTimeEnd").val();
        	
        	if(translateName.length > 50) {
        		alert("不能超过50个字");
        	}
        	
        	var reqdata = {
 				'displayFlag': displayFlag,
 				'translateType': translateType,
 				'translateName': translateName,
 				'orderTimeStart': orderTimeStart,
 				'stateChgTimeEnd': stateChgTimeEnd,
 				'disFlag': translateName
 				}
        	_this._getOrderList(reqdata);
        },
        
        //根据状态查询订单
        _orderListByType:function(displayFlag) {
        	var reqdata = {'displayFlag': displayFlag}
        	this._getOrderList(reqdata);
        },
        
        //查询订单
        _getOrderList:function(reqdata) {
        	var _this = this;
          	$("#pagination-ul").runnerPagination({
	 			url: _base+"/p/customer/order/orderList",
	 			method: "POST",
	 			dataType: "json",
	 			renderId:"searchOrderData",
	 			messageId:"showMessageDiv",
//	 			 $('#orderQuery').serialize()
	 			data: reqdata,
	           	pageSize: orderListPage.DEFAULT_PAGE_SIZE,
	           	visiblePages:5,
	            render: function (data) {
	            	console.log(data);
	            	if(data != null && data != 'undefined' && data.length>0){
	            		//把时间戳修改成日期格式,金钱厘 转换成元
		            	for(var i=0;i<data.length;i++){
		            		data[i].orderTime = new Date( data[i].orderTime).format('yyyy-MM-dd h:m:s');
		            		console.log(parseInt(data[i].totalFee)/1000);
		            		data[i].totalFee = _this.fmoney(parseInt(data[i].totalFee)/1000,2);
		            	}
		            	
	            		var template = $.templates("#searchOrderTemple");
	            	    var htmlOutput = template.render(data);
	            	    $("#searchOrderData").html(htmlOutput);
	            	}
	            }
    		});
        },
        
        //取消订单
        _cancelOrder:function(orderId) {
        	ajaxController.ajax({
				type: "post",
				url: _base+"/p/customer/order/orderList/cancelOrder",
				data: {'orderId': orderId},
				success: function(data){
					//取消成功
					if("1"===data.statusCode){
					}
				}
			});
        },
        
        //金钱格式化 订单金额的转换类（厘->元）
        fmoney:function (s, n) {
        	var result = '0.00';
    		if(isNaN(s) || !s){
    			return result;
    		}
            
        	n = n > 0 && n <= 20 ? n : 2;
        	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        	var l = s.split(".")[0].split("").reverse(),
        	r = s.split(".")[1];
        	var t = "";
        	for(var i = 0; i < l.length; i ++ ){   
        		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        	}
        	return t.split("").reverse().join("") + "." + r;
        }
    });
    module.exports = taskCenterPage;
});
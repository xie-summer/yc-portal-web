define('app/jsp/user/interpreter/interpreterInfo', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("optDialog/src/dialog"),
    AjaxController = require('opt-ajax/1.0.0/index'),
    Calendar = require('arale-calendar/1.1.2/index');
    
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    
    require("jquery-validation/1.15.1/jquery.validate");
	require("app/util/aiopt-validate-ext");
    
	require("my97DatePicker/WdatePicker");
	
	require('webuploader/webuploader');
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    var uploader = null;
    $(".portrait-file").addClass("webuploader-element-invisible");
    var showMsg = function(msg){
    	var d = Dialog({
			content:msg,
			icon:'fail',
			okValue: interpreterInfoMsg.showOkValueMsg,
			title: interpreterInfoMsg.showTitleMsg,
			ok:function(){
				d.close();
			}
		});
		d.showModal();
    };
    var showMsg2 = function(msg){
    	var d = Dialog({
			content:msg,
			icon:'success',
			okValue: interpreterInfoMsg.showOkValueMsg,
			title: interpreterInfoMsg.showTitleMsg,
			ok:function(){
				d.close();
			}
		});
		d.showModal();
    };
    //定义页面组件类
    var InterPreterInfoPager = Widget.extend({
    	//属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	Statics: {
    		DEFAULT_PAGE_SIZE: 10
    	},
    	//事件代理
    	events: {
			//保存数据
    		"click [id='saveButton']":"_saveInterpreterInfo",
    		"blur [id='nickname']":"_checkNickNameValue",
    		"blur [id='userName']":"_checkUserNameValue",
    		"change [id='countryInfo']":"_getProviceValue",
    		"change [id='provinceInfo']":"_getCnCityValue",
			//"blur [id='countryInfo']":"_checkCountryValue",
			"blur [id='provinceInfo']":"_checkProvinceValue",
			"blur [id='cnCityInfo']":"_checkCnCityValue",
			"blur [id='address']":"_checkAddressValue",
			"change [id='uploadImg']":"_uploadFile",
			"click [id='translatorCertification']":"_toTranslatorCertificationPager",
        },
        //重写父类
    	setup: function () {
    		InterPreterInfoPager.superclass.setup.call(this);
    		var formValidator=this._initValidate();
    		this._loadAllCountry();
    		var countryValue = $("#countryInfo").val();
    		var provinceInfo = $("#provinceInfo").val();
    		if(provinceCode!=null&&countryValue!='0'){
    			$("#provinceP").show();
    			this._getProviceValue();
    		}
    		if(cnCityCode!=null&&provinceInfo!='0'){
    			$("#cnCityP").show();
    			this._getCnCityValue();
    		}
    		$(":input").bind("focusout",function(){
				formValidator.element(this);
			});
			this._uploadFile();
    	},
		//校验地址库是否合法
		/*_checkArea: function () {
			var countryInfo = $("#countryInfo").val();
			if(countryInfo)

		},*/
		_checkCountryValue:function () {
			var countryinfo = $("#countryInfo").val();
			if(countryinfo=="0"){
				$("#area-error").hide().html("");
				return ;
			}
		},
		_checkProvinceValue:function () {
			if($("#provinceInfo").is(":hidden")){
				$("#provinceInfo").val("");
			}else {
				var province = $("#provinceInfo").val();
				if(province!="0"){
					$("#area-error").hide().html("");
				}else {
					$("#area-error").show().html(interpreterInfoMsg.provinceErrorMsg);
				}
			}
		},
		_checkCnCityValue:function () {
			if($("#cnCityInfo").is(":hidden")){
				$("#cnCityInfo").val("");
			}else {
				var city = $("#cnCityInfo").val();
				if(city!="0"){
					$("#area-error").hide().html("");
				}else {
					$("#area-error").show().html(interpreterInfoMsg.cityErrorMsg);
				}
			}
		},
		_checkAddressValue:function () {
			var address = $("#address").val();
			if(address!=""||address==null){
				$("#detail-address").hide().html("");
			}else {
				$("#detail-address").show().html(interpreterInfoMsg.detailAddressErrorMsg);
			}
		},
    	_saveInterpreterInfo:function(){
    	    var formValidator=this._initValidate();
			formValidator.form();
			if(!$("#dataForm").valid()){
				return false;
			}else{
			 var userPortraitImg ="";
			 if($("#portraitFileId").attr("src")){
				 userPortraitImg =$("#portraitFileId").attr("src");
			 }
			 var userName =$("#userName").val();
			 var nickName =$("#nickname").val();
			/* if(!_checkArea()){
				 return false;
			 }*/
			 var countryinfo = $("#countryInfo").val();
			 /*if(countryinfo=="0"||countryinfo==""||countryinfo==null){
				 $("#area-error").show().html("请选择国家");
				 return false;
			 }*/
			 if($("#provinceInfo").is(":disabled")){
				 $("#provinceInfo").val("");
			 }else {
				 var province = $("#provinceInfo").val();
				 if(province=="0"||province==""||province==null){
					 $("#area-error").show().html(interpreterInfoMsg.provinceErrorMsg);
					 return false;
				 }
			 }
			 if($("#cnCityInfo").is(":disabled")){
				 $("#cnCityInfo").val("");
			 }else {
				 var city = $("#cnCityInfo").val();
				 if(city=="0"||city==""||city==null){
					$("#area-error").show().html(interpreterInfoMsg.cityErrorMsg);
					return false;
				 }
			 }
			var address = $("#address").val();
			if(countryinfo!="0"&&(address==""||address==null)){
				$("#detail-address").show().html(interpreterInfoMsg.detailAddressErrorMsg);
				return false;
			}
             ajaxController.ajax({
					type:"post",
					processing : true,
					message : " ",
    				url:_base+"/p/interpreter/saveInfo",
    				data:{
						'country':$("#countryInfo").val(),
						'province':$("#provinceInfo").val(),
						'cnCity':$("#cnCityInfo").val(),
						'address':$("#address").val(),
    					'portraitId':$("#portraitId").val(),
    					'userName':userName,
						'nickname':nickName,
						'firstname':$("#firstname").val(),
						'lastname':$("#lastname").val(),
						'sex':$("input[name='sex']:checked").val(),
						'birthdayTmp':$("#startTime").val(),
						'qq':$("#qq").val(),
						// 'portraitId':$("#portraitId").val(),
						'originalNickname':originalNickname,
						'originalUsername':originalUsername,
						'userPortraitImg':userPortraitImg
    				},
    		        success: function(json) {
    		        	if(!json.data){
    		        		showMsg(json.statusInfo);
    		        	}else{
    		        		if(originalUsername!=userName&&userName!=""){//用户名发生改变
    		        			//输入框替换
    		    				$("#p_userName").html(userName);
    		    				//更新头部菜单用户名显示
    		    				$("#top_username").html(userName);
    		    				//更新左侧菜单用户名显示
    		    				$("#left_username").html(userName);
    		    			}
    		        		//用户名重新赋值
    		        		originalUsername = userName;
		        			//昵称重新赋值
    		        		originalNickname=nickName;
    		        		//更新头像显示
    		        		$("#ycUserPortraitImg").attr("src",$("#portraitFileId").attr("src"));
    		        		showMsg2(json.statusInfo);
    		        	}
    		          }
    				});
			
			}
		},
		_checkNickNameValue:function(){
			var nickname =  $("#nickname").val();
			if(originalNickname==nickname||nickname==""){//昵称未改变无需校验
				return;
			}
			if(!this._regCheckNickName(nickname)){
				return;
			}
			ajaxController.ajax({
				type:"post",
				url:_base+"/p/interpreter/checkNickName",
				data:{
					'nickName':nickname
				},
		        success: function(json) {
		        	 if(!json.data){
		        		 $("#nickname-error").show().html(json.statusInfo);
		        	 }else{
		        		 $("#nickname-error").hide().html(""); 
		        	 }
		          }
				});
		},
		_checkUserNameValue:function(){
			var userName =  $("#userName").val();
			if(userName==""){
				$("#userNameErrMsg").hide();
				return;
			}
			if(originalUsername==userName){//用户名未改变无需校验
				return;
			}else{
				$("#userNameErrMsg").show();
			}
			var userNameLength = $.trim(userName).length;
			if(userNameLength<6||userNameLength>16||userNameLength==0){
				$("#userNameErrMsg").hide();
				return;
			}else{
				$("#userNameErrMsg").show();
			}
			if(!this._regCheckUserName(userName)){
				$("#userNameErrMsg").hide();
				return;
			}else{
				$("#userNameErrMsg").show();
			}
			ajaxController.ajax({
				type:"post",
				url:_base+"/p/interpreter/checkUserName",
				data:{
					'userName':userName
				},
		        success: function(json) {
		        	 if(!json.data){
		        		 $("#userNameErrMsg").hide();
		        		 $("#userName-error").show().html(json.statusInfo);
		        	 }else{
		        		 $("#userNameErrMsg").show();
		        		 $("#userName-error").hide().html(""); 
		        	 }
		          }
				});
		}
		,
		_regCheckUserName:function(value){
			var re = /^[0-9a-zA-Z]\w{5,15}$/;
			return re.test(value);
		},
		_regCheckNickName:function(value){
			var re = /^[\-_0-9a-zA-Z\u4e00-\u9fa5]{1,24}$/;
			return re.test(value);
		},
		_uploadFile:function(){
			if ( !WebUploader.Uploader.support() ) {
				alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
				throw new Error( 'WebUploader does not support the browser you are using.' );
		     }else if(uploader==null){
		         this._initUpdate();
		     }
		},
		_initUpdate:function(){
			var _this= this;
		    var FILE_TYPES=['gif','jpg','png','jpeg','bmp','GIF','JPG','PNG','JPEG','BMP'];
		    uploader = WebUploader.create({
		        swf : _base+"/resources/spm_modules/webuploader/Uploader.swf",
		        server: _base+'/p/interpreter/uploadImage',
		        auto : true,
		        pick : "#portraitbox",
		        accept: {
		            title: 'Images',
		            extensions: 'gif,jpg,jpeg,bmp,png',
		            mimeTypes: 'image/*'
		        },		        
		        resize : false,
		        disableGlobalDnd: true,
		        fileNumLimit: 10,
		        fileSizeLimit: 5 * 1024 * 1024    // 5 M
		    });

		    uploader.on("beforeFileQueued", function (file) {
		    	var image = file.name;
		    	 var allSize = file.size;
		    	if(!/\.(gif|jpg|png|jpeg|bmp|GIF|JPG|PNG|JPEG|BMP)$/.test(image)){
		    		$("#uploadImgErrMsg").show();
		    		$("#uploadImgText").show();
		    		$("#uploadImgText").text(interpreterInfoMsg.uplaodImageMsg);
		    		$("#uploadImgFlag").val("0");
		    		return false;
		    	}else if(allSize > 5*1024*1024){
		    		$("#uploadImgErrMsg").show();
		    		$("#uploadImgText").show();
		    		$("#uploadImgText").text(interpreterInfoMsg.uplaodImageMsg);
		    		$("#uploadImgFlag").val("0");
		    		return false;
		    	}else{
		    		$("#uploadImgErrMsg").hide();
		    		$("#uploadImgText").hide();
		    		$("#uploadImgText").text('');
		    		$("#uploadImgFlag").val("1");
		    	}
		    });
	     // 文件上传成功，给item添加成功class, 用样式标记上传成功。  
	        uploader.on( 'uploadSuccess', function( file, data) {  
	        	if(data.isTrue){
	        		document.getElementById("portraitFileId").src=data.url;
	        		$("#portraitId").val(data.idpsId);
	        	 }else{
	        		 $("#uploadImgText").text(interpreterInfoMsg.uplaodImageMsg);
	        	 }
	        });  
	       
		},
    	_initValidate:function(){
    		var _this = this;
    		$.validator.addMethod( "checkUserName", function( value, element, param ) {
    			if(param==false)return true;
    			/*如果参数值存在，则进行校验*/
    			var empty = $.trim(value).length?false:true;
    			if(empty)return true;
    			var userNameLength = $.trim(value).length;
    			if(userNameLength<6||userNameLength>16||userNameLength==0){
    				$("#userNameErrMsg").hide();
    			}
    			var valid =  (_this._regCheckUserName(value))?true:false;	
    			if(!valid){
    				$("#userNameErrMsg").hide();
    			}
    			return valid;
    		}, $.validator.format(interpreterInfoMsg.userNameErrorMsg) );
    		$.validator.addMethod( "checkNickName", function( value, element, param ) {
    			if(param==false)return true;
    			/*如果参数值存在，则进行校验*/
    			var empty = $.trim(value).length?false:true;
    			if(empty)return true;
    			var valid =  (_this._regCheckNickName(value))?true:false;		
    			return valid;
    		}, $.validator.format(interpreterInfoMsg.nickNameErrorMsg) );
    		var formValidator=$("#dataForm").validate({
    			rules: {
    				userName: {
    					required:true,
    					maxlength:16,
    					minlength:6,
    					checkUserName: $("#userName").val()
    					},
    				nickname: {
    					required:true,
    					maxlength:24,
    					minlength:1,
    					checkNickName: $("#nickname").val()
    					},
    			   qq:{
    			    	required:false,
    					maxlength:10,
    					digits:true,
    			    }
    			},
    			messages: {
    				userName: {
    					required:interpreterInfoMsg.userNameEmptyMsg,
    					maxlength:interpreterInfoMsg.userNameMaxMsg,
    					minlength:interpreterInfoMsg.userNameMinMsg
    					},
    				nickname: {
    					required:interpreterInfoMsg.nickNameEmptyMsg,
    					maxlength:interpreterInfoMsg.nickNameMaxMsg,
    					minlength:interpreterInfoMsg.nickNameMinMsg
    				},
    				qq:{
    					digits: interpreterInfoMsg.qqErrorMsg
    				}
    			},
    			
    			
    		});
    		
    		return formValidator;
    	},
    	_loadAllCountry:function(){
    		ajaxController.ajax({
    			async:false,
				type:"post",
				url:_base+"/p/interpreter/getAllCountry",
		        success: function(json) {
		        	 if(json.statusCode=='0'){
		        		 $("#userNameErrMsg").hide();
		        		 $("#userName-error").show().html(json.statusInfo);
		        	 }else{
		        		 $("#userNameErrMsg").show();
		        		$("#userName-error").hide().html(""); 
		        		var data = json.data;
						if (data) {
							var html = [];
							html.push('<option value=0>' + interpreterInfoMsg.areaTitle + '</option>');
							for (var i = 0; i < data.length; i++) {
								var t = data[i];
								var _code = t.regionCode;
								var name = t.regionNameCn;
								if ("zh_CN" != currentLan) {
									name = t.regionNameEn;
								}
								if(countryCode==_code){
									html.push('<option selected="selected" value=' + _code+ '>' +name + '</option>');
								}else if(_code=='3385'){
									html.push('<option selected="selected" value=' + _code+ '>' + name + '</option>');
								}else{
									html.push('<option value=' + _code+ '>' + name + '</option>');
								}
								
							}
							$("#countryInfo").html(html.join(""));
						}
		        	 }
		          }
				});
    	},
    	_getProviceValue:function(){
    		ajaxController.ajax({
    			async:false,
				type:"post",
				url:_base+"/p/interpreter/getProvice",
				data:{
					'regionCode':$("#countryInfo").val(),
				},
		        success: function(json) {
		        	 if(json.statusCode=='0'){
		        		 $("#userNameErrMsg").hide();
		        		 $("#userName-error").show().html(json.statusInfo);
		        	 }else{
		        		$("#userNameErrMsg").show();
		        		$("#userName-error").hide().html(""); 
		        		var data = json.data;
		        		var html = [];
		        		var html2=[];
		        		html.push('<option value=0 selected="selected">' + interpreterInfoMsg.areaTitle + '</option>');
		        		$("#provinceInfo").html(html.join(""));
		        		html2.push('<option value=0>' + interpreterInfoMsg.areaTitle + '</option>');
						$("#cnCityInfo").html(html2.join(""));
						if (data) {
							if(data.length==0){
								$("#provinceInfo").attr("disabled",true);
								$("#cnCityInfo").attr("disabled",true);
								return;
							}
							$("#provinceInfo").attr("disabled",false);
							// $("#cnCityInfo").show();
							
							for (var i = 0; i < data.length; i++) {
								var t = data[i];
								var _code = t.regionCode;
								var name = t.regionNameCn;
								if ("zh_CN" != currentLan) {
									name = t.regionNameEn;
								}
								if(_code==provinceCode){
									html.push('<option selected="selected" value=' + _code+ '>' + name + '</option>');
								}else{
									html.push('<option value=' + _code+ '>' + name + '</option>');
								}
							}
							$("#provinceInfo").html(html.join(""));
						}
		        	 }
		          }
				});
    	},
    	_toTranslatorCertificationPager:function(){
    		alert("dfefe");
    		window.location.href = _base+"/p/translator/translatorpager?source=interpreter"
    	},
    	_getCnCityValue:function(){
    		ajaxController.ajax({
    			async:false,
				type:"post",
				url:_base+"/p/interpreter/getCnCityInfo",
				data:{
					'Code':$("#provinceInfo").val(),
				},
		        success: function(json) {
		        	 if(json.statusCode=='0'){
		        		 $("#userNameErrMsg").hide();
		        		 $("#userName-error").show().html(json.statusInfo);
		        	 }else{
		        		$("#userNameErrMsg").show();
		        		$("#userName-error").hide().html(""); 
		        		var data = json.data;
		        		var html = [];
						html.push('<option value=0>' + interpreterInfoMsg.areaTitle + '</option>');
						$("#cnCityInfo").html(html.join(""));
						if (data) {
							if(data.length==0){
								$("#cnCityInfo").attr("disabled",true);
								return;
							}
							$("#cnCityInfo").attr("disabled",false);
							for (var i = 0; i < data.length; i++) {
								var t = data[i];
								var _code = t.regionCode;
								var name = t.regionNameCn;
								if ("zh_CN" != currentLan) {
									name = t.regionNameEn;
								}
								if(cnCityCode==_code){
									html.push('<option selected="selected" value=' + _code+ ' >' + name + '</option>');
								}else{
									html.push('<option value=' + _code+ ' >' + name + '</option>');
								}
							}
							$("#cnCityInfo").html(html.join(""));
						}
		        	 }
		          }
				});
    	}
    })
    module.exports = InterPreterInfoPager
});

function uploadPortraitImg(uploadImgFile){
	
	var image = $("#uploadImg").val();
	if(!/\.(gif|jpg|png|jpeg|bmp|GIF|JPG|PNG|JPEG|BMP)$/.test(image)){
		$("#uploadImgErrMsg").show();
		$("#uploadImgText").show();
		$("#uploadImgText").text(interpreterInfoMsg.uplaodImageMsg);
		$("#uploadImgFlag").val("0");
		return false;
	}else if(document.getElementById("uploadImg").files[0].size>5*1024*1024){
		$("#uploadImgErrMsg").show();
		$("#uploadImgText").show();
		$("#uploadImgText").text(interpreterInfoMsg.uplaodImageMsg);
		$("#uploadImgFlag").val("0");
		return false;
	}else{
		$("#uploadImgErrMsg").hide();
		$("#uploadImgText").hide();
		$("#uploadImgText").text('');
		$("#uploadImgFlag").val("1");
	}
	
	 $.ajaxFileUpload({  
         url:_base+"/p/interpreter/uploadImage",  
         secureuri:false,  
         fileElementId:uploadImgFile,//file标签的id  
         dataType: "text",//返回数据的类型  
         data:{uploadImgFile:uploadImgFile},//一同上传的数据  
         success: function (data, status) {
        	 var jsonData = JSON.parse(data);
        	if(jsonData.isTrue){
        		document.getElementById("portraitFileId").src=jsonData.url;
        		$("#portraitId").val(jsonData.idpsId);
        	 }
         },
         error: function (data, status, e) {  
             alert(e);  
         }
     }); 
	}


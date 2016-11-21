<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>订单报价确认</title>
    <%@ include file="/inc/inc.jsp" %>
</head>
<body>	
	<!--面包屑导航-->
	<%@ include file="/inc/topHead.jsp" %>
	<%@ include file="/inc/topMenu.jsp" %>
		<!--主体-->
		<div class="placeorder-container">
		<div class="placeorder-wrapper">
			<!--步骤-->
			<div class="place-bj">
				<div class="place-step">
					<!--进行的状态-->
			 		<div class="place-step-none adopt-wathet-bj">
			 			<ul>
			 				<li class="circle"><i class="icon iconfont">&#xe60f;</i></li>
			 				<li class="word">翻译内容</li>
			 			</ul>
			 			<p class="line"></p>
			 		</div>
			 		<!--未进行的状态-->
			 		<div class="place-step-none adopt-wathet-bj">
			 			<ul>
			 				<li class="circle"><i class="icon iconfont">&#xe60d;</i></li>
			 				<li class="word">填写联系方式</li>
			 			</ul>
			 			<p class="line"></p>
			 		</div>
			 		<!--未进行的状态-->
			 		<div class="place-step-none adopt-blue-bj">
			 			<ul>
			 				<li class="circle"><i class="icon iconfont">&#xe608;</i></li>
			 				<li class="word">支付</li>
			 			</ul>
			 			<p class="line"></p>
			 		</div>
			 		
				</div>
			</div>
			<!--白色背景-->
			<div class="white-bj   pdd-150">
				<div class="recharge-success">
 						<ul>
 							<li><img src="${uedroot}/images/rech-win.png" /></li>
 							<li class="word">订单提交成功，请等待报价！</li>
 							<li class="mt-20">我们正在确认您的订单金额，并电话联系您，请耐心等待···</li>
 							<li class="list mt-20">
 								<p>您可以在“<a href="${_base}/p/customer/order/list/view">我的订单</a>”中查看您的充值信息</p>
 								<p>若有任何疑问，欢迎致电咨询：400-119-8080</p>
							</li>
 						</ul>
 					</div>
	
			</div>

			
		</div>
		</div>

</body>
</html>

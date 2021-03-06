<!-- 首页类脚 -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="footer-wapper">
    <div class="footer-container">
        <div class="footer-about">
            <div class="footer-about-left">
                <ul>
                	<!-- 关于我们 -->
                    <li class="title"><spring:message code="indexFoot.about"/></li>
                    <li>
                    	<!-- 公司介绍 -->
                        <p><a href="${_base}/aboutus"><spring:message code="indexFoot.Company"/></a></p>
                        <!-- 合作客户 -->
                        <p><a href="${_base}/client"><spring:message code="indexFoot.Clients"/></a></p>
                        <!-- 意见反馈 -->
                        <%--<p><a href="${_base}/feedback"><spring:message code="indexFoot.Feedback"/></a></p>--%>
                        <!-- 协议规则 -->
                        <p><a href="${_base}/agreement"><spring:message code="indexFoot.Agreement"/></a></p>
                    </li>
                </ul>
                <ul>
                	<!-- 我是客户 -->
                    <li class="title"><spring:message code="indexFoot.ForClients"/></li>
                    <li>
                    	<!-- 下单指南 -->
                        <p><a href="${_base}/guide"><spring:message code="indexFoot.Guide"/></a></p>
                        <!-- 常见问题 -->
                        <p><a href="${_base}/faq"><spring:message code="indexFoot.FAQ"/></a></p>
                        <!-- 服务说明 -->
                        <p><a href="${_base}/sexplain"><spring:message code="indexFoot.ServiceDesc"/></a></p>
                        <!-- 服务协议 -->
                        <p><a href="${_base}/rule"><spring:message code="indexFoot.ServiceAgree"/></a></p>
                    </li>
                </ul>
                <ul>
                	<!-- 我是译者 -->
                    <li class="title"><spring:message code="indexFoot.ForTranslators"/></li>
                    <li>
                      	 <!-- 译者认证 -->
                        <p><a href="${_base}/tident"><spring:message code="indexFoot.Certification"/></a></p>
                        <!-- 译者咨询 -->
                        <p><a href="${_base}/tconsult"><spring:message code="indexFoot.Q&A"/></a></p>
                    </li>
                </ul>
                <ul>
                	<!-- 产品链接 -->
                    <li class="title"><spring:message code="indexFoot.ProductLink"/></li>
                    <li>
                    	<!-- 译库 -->
                        <p><a href="https://www.yeekit.com/" target="_blank"><spring:message code="indexFoot.YeeKit"/></a></p>
                        <!-- 找翻译APP -->
                        <p><a href="${_base}/findyee"><spring:message code="indexFoot.FindYee"/></a></p>
                        <!-- 字幕通 -->
                        <p><a href="https://www.yeekit.com/site/caption" target="_blank"><spring:message code="indexFoot.YeeCaption"/></a></p>
                        <!-- 译库网页翻译 -->
                        <p><a href="http://web.yeekit.com/" target="_blank"><spring:message code="indexFoot.YeeWeb"/></a></p>
                    </li>
                </ul>
                <ul>
                	<!-- 友情链接 -->
                    <li class="title"><spring:message code="indexFoot.Links"/></li>
                    <li>
                    	<!-- 中译语通 -->
                        <p><a href="http://www.gtcom.com.cn/" target="_blank"><spring:message code="indexFoot.GTC"/></a></p>
                        <!-- 译库 -->
                        <p><a href="http://web.yeekit.com/" target="_blank"><spring:message code="indexFoot.YeeKit"/></a></p>
                        <!-- 译世界 -->
                        <p><a href="http://www.yeeworld.com/" target="_blank"><spring:message code="indexFoot.YeeWorld"/></a></p>
                    </li>
                </ul>
            </div>
            <div class="footer-about-right">
                <ul>
                    <li>
                        <p class="phone"></p>
                        <p><img src="${uedroot}/images/erwm.png" /></p>
                    </li>
                    <li class="shaw">
                        <p class="shaw-a"><a href="http://twitter.com/GTC_YeeCloud" target="_blank"></a></p>
                        <p class="shaw-b"><a href="http://www.facebook.com/yeecloud" target="_blank"></a></p>
                        <p class="shaw-c"><a href="http://weibo.com/u/3628864670" target="_blank"></a></p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer-list">
            <ul>
            	<!--译云专业语言服务平台 版权所有  -->
                <li class="di-icon"><spring:message code="indexFoot.companyName"/>
                    <%--<img src="${uedroot}/images/di-icon.png" />--%>
                    <script type="text/javascript">
                        //cnzz统计
                        var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
                        document.write(unescape("%3Cspan id='cnzz_stat_icon_1254831074'%3E%3C/span%3E%3Cscript src='"
                            + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1254831074%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
                    </script>
                </li>
              	<!-- 京ICP备13002826号-7 -->
                <li><spring:message code="indexFoot.copyRright"/><c:if test="${showTb == 'true'}"><a target="_blank"
                        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010702001426"><img
                        src="${uedroot}/images/tb.png"> 京公网安备 11010702001426号</a></c:if></li>
            </ul>
        </div>
    </div>
</div>
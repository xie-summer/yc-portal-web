package com.ai.yc.protal.web.controller.order;

import com.ai.opt.base.vo.PageInfo;
import com.ai.opt.base.vo.ResponseHeader;
import com.ai.opt.sdk.components.dss.DSSClientFactory;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.paas.ipaas.dss.base.interfaces.IDSSClient;
import com.ai.paas.ipaas.i18n.ResWebBundle;
import com.ai.yc.common.api.cachekey.model.SysDomain;
import com.ai.yc.common.api.cachekey.model.SysPurpose;
import com.ai.yc.order.api.orderdetails.interfaces.IQueryOrderDetailsSV;
import com.ai.yc.order.api.orderdetails.param.ProdFileVo;
import com.ai.yc.order.api.orderdetails.param.QueryOrderDetailsResponse;
import com.ai.yc.order.api.orderquery.interfaces.IOrderQuerySV;
import com.ai.yc.order.api.orderquery.param.OrdOrderVo;
import com.ai.yc.order.api.orderquery.param.QueryOrdCountRequest;
import com.ai.yc.order.api.orderquery.param.QueryOrdCountResponse;
import com.ai.yc.order.api.orderquery.param.QueryOrderRequest;
import com.ai.yc.order.api.orderquery.param.QueryOrderRsponse;
import com.ai.yc.order.api.orderstate.interfaces.IOrderStateUpdateSV;
import com.ai.yc.order.api.orderstate.param.OrderStateUpdateRequest;
import com.ai.yc.order.api.orderstate.param.OrderStateUpdateResponse;
import com.ai.yc.order.api.updateorder.interfaces.IUpdateOrderSV;
import com.ai.yc.order.api.updateorder.param.UProdFileVo;
import com.ai.yc.order.api.updateorder.param.UProdVo;
import com.ai.yc.order.api.updateorder.param.UpdateOrderRequest;
import com.ai.yc.order.api.updateorder.param.UpdateOrderResponse;
import com.ai.yc.protal.web.constants.Constants;
import com.ai.yc.protal.web.service.CacheServcie;
import com.ai.yc.protal.web.service.OrderService;
import com.ai.yc.protal.web.utils.UserUtil;

import com.alibaba.fastjson.JSONArray;

import com.ai.yc.user.api.userservice.interfaces.IYCUserServiceSV;

import com.alibaba.fastjson.JSONObject;


import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;


/**
 * Created by liutong on 16/11/15.
 */
@Controller
@RequestMapping("/p/trans/order")
public class TransOrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransOrderController.class);
            
    @Autowired
    private CacheServcie cacheServcie;
    @Autowired
    ResWebBundle rb;
    @Autowired
    OrderService orderService;
    
    /**
     * 译员订单,订单列表
     * @return
     */
    @RequestMapping("/list/view")
    public String orderListView(Model uiModel){
        List<SysDomain> domainList = cacheServcie.getAllDomain(rb.getDefaultLocale());
        List<SysPurpose> purpostList = cacheServcie.getAllPurpose(rb.getDefaultLocale());
        
        uiModel.addAttribute("domainList", domainList); //领域
        uiModel.addAttribute("purpostList", purpostList); //用途
        
        String userId = UserUtil.getUserId();
        IOrderQuerySV iOrderQuerySV = DubboConsumerFactory.getService(IOrderQuerySV.class);
        QueryOrdCountRequest ordCountReq = new QueryOrdCountRequest();
        ordCountReq.setUserId(userId);
        
        // 21：已领取
        ordCountReq.setDisplayFlag("21");
        QueryOrdCountResponse ordCountRes = iOrderQuerySV.queryOrderCount(ordCountReq);
        uiModel.addAttribute("ReceivedCount", ordCountRes.getCountNumber());
        
        //211：已分配 
        ordCountReq.setDisplayFlag("211");
        ordCountRes = iOrderQuerySV.queryOrderCount(ordCountReq);
        uiModel.addAttribute("AssignedCount", ordCountRes.getCountNumber());
        
        //23：翻译中 
        ordCountReq.setDisplayFlag("23");
        ordCountRes = iOrderQuerySV.queryOrderCount(ordCountReq);
        uiModel.addAttribute("TranteCount", ordCountRes.getCountNumber());
        
        return "transOrder/orderList";
    }
    
    /**
     * 译员订单 显示订单详情
     * @param orderId
     * @param uiModel
     * @return
     */
    @RequestMapping("/{orderId}")
    public String orderInfoView(@PathVariable("orderId") String orderId, Model uiModel){
        if (StringUtils.isEmpty(orderId)) {
            return "/404";
        }
        
        try {
            IQueryOrderDetailsSV iQueryOrderDetailsSV = DubboConsumerFactory.getService(IQueryOrderDetailsSV.class);
            QueryOrderDetailsResponse orderDetailsRes = iQueryOrderDetailsSV.queryOrderDetails(Long.valueOf(orderId));
            ResponseHeader resHeader = orderDetailsRes.getResponseHeader();
            LOGGER.info("订单详细信息 ：" + JSONObject.toJSONString(orderDetailsRes));
            //如果返回值为空,或返回信息中包含错误信息,返回失败
            if (orderDetailsRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
            }
//  getProdLevels  返回的是id,前台把 id转成对应的 中英文文字。    
//          ("100110", "陪同翻译");("100120", "交替传译");("100130", "同声翻译");
//          ("100210", "标准级");("100220", "专业级");("100230", "出版级");
            
            List<ProdFileVo> prodFileVos = orderDetailsRes.getProdFiles();
            int uUploadCount = 0; //可以上传文件的数量
            for(ProdFileVo prodFileVo : prodFileVos) {
                if (StringUtils.isEmpty(prodFileVo.getFileTranslateId())) {
                    uUploadCount ++;
                }
            }
            
            uiModel.addAttribute("UUploadCount", uUploadCount);
            orderDetailsRes.setState("20");//TODO... 模拟待领取
            orderDetailsRes.setDisplayFlag("20");//TODO... 模拟待领取
            //若是待领取,则获取用户信息
            if ("20".equals(orderDetailsRes.getDisplayFlag())){
                getUserInfo(uiModel);
            }
            uiModel.addAttribute("OrderDetails", orderDetailsRes);
        } catch (Exception e) {
            LOGGER.error("查询订单详情失败:",e);
        }
        return "transOrder/orderInfo";
    }

    private void getUserInfo(Model uiModel){
//        IYCUserServiceSV userServiceSV = DubboConsumerFactory.getService(IYCUserServiceSV.class);
//        SearchYCTranslatorSkillListRequest searchYCUserReq = new SearchYCTranslatorSkillListRequest();
//        searchYCUserReq.setTenantId(Constants.DEFAULT_TENANT_ID);
//        searchYCUserReq.setUserId(userId);
//        YCTranslatorSkillListResponse userInfoResponse = userServiceSV.getTranslatorSkillList(searchYCUserReq);
        //包括译员的等级,是否为LSP译员,LSP中的角色,支持的语言对
//        uiModel.addAttribute("lspId",userInfoResponse.getLspId());//lsp标识
//        uiModel.addAttribute("lspRole",userInfoResponse.getLspRole());//lsp角色
//        uiModel.addAttribute("vipLevel",userInfoResponse.getVipLevel());//译员等级
        //TODO... 模拟数据
        uiModel.addAttribute("lspId","");//lsp标识
        uiModel.addAttribute("lspRole","1");//lsp角色
        uiModel.addAttribute("vipLevel","4");//译员等级
    }
    
    /**
     * 译员提交订单
     * @param request
     * @return
     * @author mimw
     */
    @RequestMapping("/save")
    @ResponseBody
    public ResponseData<String> orderSubmit(@RequestParam("orderId") Long orderId) {
        ResponseData<String> resData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "OK");
        try {
            IQueryOrderDetailsSV iQueryOrderDetailsSV = DubboConsumerFactory.getService(IQueryOrderDetailsSV.class);
            QueryOrderDetailsResponse orderDetailsRes = iQueryOrderDetailsSV.queryOrderDetails(orderId);
            ResponseHeader resHeader = orderDetailsRes.getResponseHeader();
            LOGGER.info("订单详细信息 ：" + JSONObject.toJSONString(orderDetailsRes));
            //如果返回值为空,或返回信息中包含错误信息,返回失败
            if (orderDetailsRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
                resData.setData("查询订单失败");
            }
            
                
            String transferType = orderDetailsRes.getTranslateType();
            //文本翻译  翻译信息为空，则返回失败
            if (transferType.equalsIgnoreCase("0") && 
                    StringUtils.isEmpty(orderDetailsRes.getProd().getTranslateInfo())) {
                resData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
                resData.setData("翻译信息为空");
            }
            
            //文档翻译 上传文件为0，则返回失败
            if (transferType.equalsIgnoreCase("1")) {
                List<ProdFileVo> files = orderDetailsRes.getProdFiles();
                int filesCount = 0; //上传文件个数
                for (ProdFileVo fileVo : files) {
                    if (StringUtils.isNotEmpty(fileVo.getFileTranslateId())) {
                        filesCount ++;
                    }
                }
                
                if (filesCount <= 0) {
                    resData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
                    resData.setData("没有上传译文");
                }
            }
            
            IOrderStateUpdateSV iOrderStateUpdateSV = DubboConsumerFactory.getService(IOrderStateUpdateSV.class);
            OrderStateUpdateRequest stateReq = new OrderStateUpdateRequest();
            stateReq.setOrderId(orderId);
            stateReq.setState("40"); //已提交
            stateReq.setDisplayFlag("23");
            
            OrderStateUpdateResponse stateRes = iOrderStateUpdateSV.updateState(stateReq);
            resHeader = stateRes.getResponseHeader();
            //如果返回值为空,或返回信息中包含错误信息
            if (stateRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
                resData.setData("提交订单失败");
            }
            
        } catch(Exception e) {
            LOGGER.error("提交订单失败:", e);
            resData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
            resData.setData("提交订单失败");
        }
        
        return resData;
    }
    
    /**
     * 修改订单信息,保存译文、上传文件
     * @return
     * @author mimw
     */
    @RequestMapping("/updateInfo")
    @ResponseBody
    public ResponseData<String> updateOrderInfo(HttpServletRequest request) {
        ResponseData<String> resData = new ResponseData<>(ResponseData.AJAX_STATUS_SUCCESS, "OK");
        
        String orderId = request.getParameter("orderId");
        String translateInfo = request.getParameter("translateInfo");
        
        try {
            IUpdateOrderSV iUpdateOrderSV = DubboConsumerFactory.getService(IUpdateOrderSV.class);
            
            UpdateOrderRequest updateReq = new UpdateOrderRequest();
            updateReq.setOrderId(Long.valueOf(orderId));
            updateReq.setOperId(UserUtil.getUserId());
            
            if (StringUtils.isNotEmpty(translateInfo)) {
                UProdVo prod = new UProdVo();
                prod.setTranslateInfo(translateInfo);
                updateReq.setProd(prod);
            }
            
//            List<UProdFileVo> prodFiles = new ArrayList<>();
//            UProdFileVo fileVo = new UProdFileVo();
//            fileVo.setFileTranslateId("");
//            fileVo.setFileTranslateName("");
//            prodFiles.add(fileVo);
//            updateReq.setProdFiles(prodFiles );
            
            UpdateOrderResponse updateRes = iUpdateOrderSV.updateOrderInfo(updateReq);
            ResponseHeader resHeader = updateRes.getResponseHeader();
            //如果返回值为空,或返回信息中包含错误信息
            if (updateRes==null|| (updateRes!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
            }
        } catch(Exception e) {
            LOGGER.error("修改订单信息失败：", e);
            resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
        }
        
        return resData;
    }
    
    /**
     * 修改订单状态
     * @param orderId
     * @param state
     * @return
     * @author mimw
     */
    @RequestMapping("/updateState")
    @ResponseBody
    public ResponseData<String> updateOrderState(@RequestParam("orderId") Long orderId, @RequestParam("state") String state
            ,@RequestParam("displayFlag") String displayFlag) {
        ResponseData<String> resData = new ResponseData<>(ResponseData.AJAX_STATUS_SUCCESS, "OK");
        try {
            IOrderStateUpdateSV iOrderStateUpdateSV = DubboConsumerFactory.getService(IOrderStateUpdateSV.class);
            OrderStateUpdateRequest stateReq = new OrderStateUpdateRequest();
            stateReq.setOrderId(orderId);
            stateReq.setState(state);
            stateReq.setDisplayFlag(displayFlag);
           
            OrderStateUpdateResponse stateRes = iOrderStateUpdateSV.updateState(stateReq);
            ResponseHeader resHeader = stateRes.getResponseHeader();
            //如果返回值为空,或返回信息中包含错误信息
            if (stateRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
            }
            
        } catch(Exception e) {
            LOGGER.error("修改订单状态失败：", e);
            resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
        }
        
        return resData;
    }
    
    /**
     * 删除译员上传的文件
     * @param orderId
     * @param fileId
     * @return
     * @author mimw
     */
    @RequestMapping(value="/deleteFile", method=RequestMethod.POST)
    @ResponseBody 
    public ResponseData<String> deleteFile(@RequestParam("orderId") Long orderId, @RequestParam("fileId") String fileId){
        ResponseData<String> resData = new ResponseData<>(ResponseData.AJAX_STATUS_SUCCESS, "OK");
        
        try {
            //查询订单
            IQueryOrderDetailsSV iQueryOrderDetailsSV = DubboConsumerFactory.getService(IQueryOrderDetailsSV.class);
            QueryOrderDetailsResponse orderDetailsRes = iQueryOrderDetailsSV.queryOrderDetails(orderId);
            List<ProdFileVo> prodFiles = orderDetailsRes.getProdFiles();
            
            //更新订单信息
            for(ProdFileVo prodFile : prodFiles) {
                if (prodFile.getFileTranslateId().equals(fileId)) {
                    prodFile.setFileTranslateId(null);
                    prodFile.setFileTranslateName(null);
                    break;
                }
            }
            
            //保存文件信息到订单中
            IUpdateOrderSV iUpdateOrderSV = DubboConsumerFactory.getService(IUpdateOrderSV.class);
            
            UpdateOrderRequest updateReq = new UpdateOrderRequest();
            updateReq.setOrderId(orderId);
            updateReq.setOperId(UserUtil.getUserId());
            List<UProdFileVo> uProdFileVo = JSONArray.parseArray(JSONObject.toJSONString(prodFiles), UProdFileVo.class)  ;
            updateReq.setProdFiles(uProdFileVo);
            
            UpdateOrderResponse updateRes = iUpdateOrderSV.updateOrderInfo(updateReq);
            ResponseHeader resHeader = updateRes.getResponseHeader();
            //如果返回值为空,或返回信息中包含错误信息
            if (updateRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
            }
        } catch (Exception e) {
            LOGGER.error("删除译员文件失败", e);
        }
        return resData;
    }
    
    
    /**
     * 译员文件上传
     * 
     * @param request
     * @return
     * @author mimw
     */
    @RequestMapping(value="/upload", method=RequestMethod.POST)
    @ResponseBody 
    public ResponseData<String> fileUpload(HttpServletRequest request){
        ResponseData<String> resData = new ResponseData<>(ResponseData.AJAX_STATUS_SUCCESS, "OK");
        
        String orderId = request.getParameter("orderId");
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        CommonsMultipartFile file = (CommonsMultipartFile) multipartRequest.getFile("file"); 
        
        try {
            IDSSClient client = DSSClientFactory.getDSSClient(Constants.IPAAS_ORDER_FILE_DSS);
            
            //查询订单
            IQueryOrderDetailsSV iQueryOrderDetailsSV = DubboConsumerFactory.getService(IQueryOrderDetailsSV.class);
            QueryOrderDetailsResponse orderDetailsRes = iQueryOrderDetailsSV.queryOrderDetails(Long.valueOf(orderId));
            List<ProdFileVo> prodFiles = orderDetailsRes.getProdFiles();
            String fileId = null;
            boolean isUpload = false; //是否能上传
            
            for(ProdFileVo prodFile : prodFiles) {
                //是否有上传位置
                if (StringUtils.isEmpty(prodFile.getFileTranslateId())) {
                    isUpload = true;
                    break;
                }
            }
            
            //不能上传了,返回失败
            if (!isUpload) {
                resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
                resData.setData("已经到达最大上传次数："+prodFiles.size());
                
                return resData;
            }
            
            //把文件保存到数据库中
            fileId = client.save(file.getBytes(), file.getOriginalFilename());
            
            //更新 文件列表信息
            for(ProdFileVo prodFile : prodFiles) {
                //是否有上传位置
                if (StringUtils.isEmpty(prodFile.getFileTranslateId())) {
                    prodFile.setFileTranslateId(fileId);
                    prodFile.setFileTranslateName(file.getOriginalFilename());
                    break;
                }
            }
            
            //保存文件信息到订单中
            IUpdateOrderSV iUpdateOrderSV = DubboConsumerFactory.getService(IUpdateOrderSV.class);
            
            UpdateOrderRequest updateReq = new UpdateOrderRequest();
            updateReq.setOrderId(Long.valueOf(orderId));
            updateReq.setOperId(UserUtil.getUserId());
            List<UProdFileVo> uProdFileVo = JSONArray.parseArray(JSONObject.toJSONString(prodFiles), UProdFileVo.class)  ;
            updateReq.setProdFiles(uProdFileVo );
            
            UpdateOrderResponse updateRes = iUpdateOrderSV.updateOrderInfo(updateReq);
            ResponseHeader resHeader = updateRes.getResponseHeader();
            //如果返回值为空,或返回信息中包含错误信息
            if (updateRes==null|| (resHeader!=null && (!resHeader.isSuccess()))){
                resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
            }
        } catch (Exception e) {
            LOGGER.error("上传译文失败:", e);
            resData = new ResponseData<>(ResponseData.AJAX_STATUS_FAILURE, "FAIL");
        }
        
        return resData;
    }
    
}

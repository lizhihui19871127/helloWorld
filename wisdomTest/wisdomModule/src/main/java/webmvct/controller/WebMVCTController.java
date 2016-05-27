package webmvct.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import webmvct.dao.interfaces.ILoginDao;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by 000 on 2016/5/27.
 */
@Controller
public class WebMVCTController extends BaseController{
    private static final Logger LOGGER = LoggerFactory.getLogger(WebMVCTController.class);
    @Resource
    private ILoginDao loginDao;
    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response, ModelMap modelMap){
        LOGGER.info("测试数据,userName:[{}]","lizhihui");
        String userName = loginDao.getLoginInfo("lizhihui");
        System.out.println(userName);
        return getView(modelMap,request,response);
    }

    @RequestMapping(value = "/personalCenter/index",method = RequestMethod.POST)
    public ModelAndView index(HttpServletRequest request, HttpServletResponse response, ModelMap modelMap){
        LOGGER.info("测试数据,userName:[{}]","lizhihui");
        String userName = loginDao.getLoginInfo("lizhihui");
        System.out.println(userName);
        modelMap.put("name",userName);
        return getView(modelMap,request,response);
    }
}
package webmvct.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by zhouq on 2014/10/15.
 */
@Controller
public class MainDefaultController extends BaseController {

    @RequestMapping("/*/*/*")
    public ModelAndView defaultMethod3params(HttpServletRequest request, HttpServletResponse response,ModelMap modelMap)  {
        return getView(modelMap,request,response);
    }

    @RequestMapping("/*/*")
    public ModelAndView defaultMethod2params(HttpServletRequest request, HttpServletResponse response,ModelMap modelMap)  {
        return getView(modelMap,request,response);
    }

    @RequestMapping("/*")
    public ModelAndView defaultMethod4params(HttpServletRequest request, HttpServletResponse response,ModelMap modelMap)  {
        return getView(modelMap,request,response);
    }
}

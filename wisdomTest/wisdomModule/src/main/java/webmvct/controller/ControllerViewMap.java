package webmvct.controller;

import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;
import webmvct.common.FastJsonUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Hashtable;
import java.util.Map;

/**
 * Created by zhouq on 2014/8/29.
 */
public class ControllerViewMap {

    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(ControllerViewMap.class);


    private static Map viewMap=initViewMap();

    private static final String configFileName="/pathconfig.json";

    private static long[] lastModified={-1};

    private static Map initViewMap()
    {
        InputStream is=null;
        try {
            is = new FileInputStream(ControllerViewMap.class.getResource(configFileName).getFile());
            String jsonStr= FastJsonUtils.ConvertStream2JsonStr(is);
            Map<String,String> mapjson = FastJsonUtils.parseMap(jsonStr);
            Hashtable map = new Hashtable();
            map.putAll(mapjson);
            return map;
        } catch (Exception e) {
            LOGGER.error(e.getMessage(),e);
        }finally {
            try {
                if(is!=null) {
                    is.close();
                }
            } catch (IOException e) {
                LOGGER.error(e.getMessage(),e);
            }
        }
        return new Hashtable();
    }

    /**
     * 获取模板路径，支持动态添加路径
     * @param key
     * @return
     */
    private static String getTargetViewPath(String key)
    {
        String targetViewPath = (String) viewMap.get(key);
        if(targetViewPath==null)
        {
            File f = new File(ControllerViewMap.class.getResource(configFileName).getFile());
            if (f.lastModified() > lastModified[0]) {
                synchronized (lastModified) {
                    if (f.lastModified() > lastModified[0]) {
                        viewMap = initViewMap();
                        lastModified[0] = f.lastModified();
                    }
                }
                targetViewPath = (String) viewMap.get(key);
            }
        }
        return targetViewPath;
    }

    public static ModelAndView getView(ModelMap modelMap, String key,
                                       HttpServletRequest request,HttpServletResponse response){
        LOGGER.info("请求返回参数：modelMap[{}]",modelMap);
        if(modelMap!=null) {
            modelMap.put("request", request);
            modelMap.put("response", response);
        }
        String targetViewPath = getTargetViewPath(key);
        if(targetViewPath != null){
            String test = request.getParameter("test");
            if(test != null && test.equals("1")){
                return getJsonView(modelMap,response);
            }else{
                return new ModelAndView(targetViewPath,modelMap);
            }
        }else{
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter writer=null;
            try {
                writer = response.getWriter();
                String json="{\"errno\":\"9998\",\"data\":{\"errMsg\":\"获取模板失败，请联系客服人员!\"}}";
                writer.append(json);
            } catch (Exception e1) {
                LOGGER.error(e1.getMessage(),e1);
            }finally {
                if (writer != null) {
                    writer.flush();
                    writer.close();
                }
            }
            return null;
        }
    }

    public static ModelAndView getView(ModelMap modelMap, HttpServletRequest request, HttpServletResponse response){
        LOGGER.info("请求返回参数：modelMap[{}]",modelMap);
        if(modelMap!=null) {
            modelMap.put("request", request);
            modelMap.put("response", response);
        }
        String currentUrl = request.getRequestURI();
        String targetViewPath = getTargetViewPath(currentUrl);
        if(targetViewPath != null){
            String test = request.getParameter("test");
            if(test != null && test.equals("1")){
                modelMap.remove("request");
                modelMap.remove("response");
                return getJsonView(modelMap,response);
            }else{
                return new ModelAndView(targetViewPath,modelMap);
            }
        }else{
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter writer=null;
            try {
                writer = response.getWriter();
                String json="{\"errno\":\"9998\",\"data\":{\"errMsg\":\"获取模板失败，请联系客服人员!\"}}";
                writer.append(json);
            } catch (Exception e1) {
                LOGGER.error(e1.getMessage(),e1);
            }finally {
                if (writer != null) {
                    writer.flush();
                    writer.close();
                }
            }
            return null;
        }
    }

    public static ModelAndView getJsonView(Map jsonMap, HttpServletResponse response) {
        response.setContentType("application/json;charset=UTF-8");
        JSONObject jsonObject = new JSONObject();
        jsonObject.putAll(jsonMap);
        String json="";
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            json = jsonObject.toString();
            writer.append(json);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            //0.1%的调用失败可能性
            try {
                json="{\"errno\":\"9999\",\"data\":{\"errMsg\":\"登陆失败，请稍后重试!\"}}";
                writer.append(json);
            } catch (Exception e1) {
                LOGGER.error(e1.getMessage(),e1);
            }
        } finally {
            if (writer != null) {
                writer.flush();
                writer.close();
            }
        }
        LOGGER.debug("jsonView="+json);
        return null;
    }

    public static String ModelMapToJsonStr(ModelMap modelMap)
    {
        JSONObject jsonObject = new JSONObject();
        jsonObject.putAll(modelMap);
        String json = jsonObject.toString();
        return json;
    }
}

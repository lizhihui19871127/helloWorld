package webmvct.controller;

import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: liangzhongzhi
 * Date: 14-6-5
 * Time: ����1:18
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class BaseController {
    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(BaseController.class);

    protected ModelAndView getView(ModelMap modelMap, String key, HttpServletRequest request, HttpServletResponse response) {
        return ControllerViewMap.getView(modelMap, key, request, response);
    }

    protected ModelAndView getView(ModelMap modelMap, HttpServletRequest request, HttpServletResponse response) {
        return ControllerViewMap.getView(modelMap, request, response);
    }

    protected ModelAndView getJsonView(Map jsonMap, HttpServletResponse response) {
        return ControllerViewMap.getJsonView(jsonMap, response);
    }

    public static String ModelMapToJsonStr(ModelMap modelMap) {
        return ControllerViewMap.ModelMapToJsonStr(modelMap);
    }

    /**
     * ���һ��json����
     *
     * @param response
     * @param json
     */
    protected void printJsonString(HttpServletResponse response, String json) {
        if (StringUtils.isBlank(json)) {
            LOGGER.debug("�����ϢΪ��");
            return;
        }
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = null;
        try {
            writer = response.getWriter().append(json);
            LOGGER.debug("���json��Ϣ�ɹ���" + json);
        } catch (Exception e) {
            LOGGER.error("���JSON��ʧ��", e);
        } finally {
            if (writer != null) {
                writer.flush();
                writer.close();
            }
        }
    }

    /**
     * Ϊajax���󴴽�һ��Ĭ�ϵĳɹ���Ӧ
     *
     * @return
     */
    protected JSONObject genSuccResult() {
        JSONObject json = new JSONObject();
        json.put("issuccess", true);
        json.put("returnmsg", "�����ɹ���");
        return json;
    }

    /**
     * Ϊajax���󴴽�һ��Ĭ�ϵ�ʧ����Ӧ
     *
     * @param errmsg
     * @return
     */
    protected JSONObject genFailResult(String errmsg) {
        JSONObject json = new JSONObject();
        json.put("issuccess", false);
        json.put("returnmsg", errmsg);
        return json;
    }

    /**
     * Ϊajax���󴴽�һ��Ĭ�ϵ���Ӧ
     *
     * @return
     */
    protected JSONObject genResult(boolean issuccess, String msg) {
        JSONObject json = new JSONObject();
        json.put("issuccess", issuccess);
        json.put("returnmsg", msg);
        return json;
    }
}

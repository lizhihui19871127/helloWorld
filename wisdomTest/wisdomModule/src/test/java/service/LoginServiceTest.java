package service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import webmvct.service.interfaces.ILoginService;

import javax.annotation.Resource;

import static org.junit.Assert.assertEquals;

/**
 * Created by 000 on 2016/5/27.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath*:applicationContext.xml")
//@ContextConfiguration(locations={"file:D:\\wisdomTest\\wisdomModule\\src\\main\\webapp\\WEB-INF\\applicationContext.xml"})
public class LoginServiceTest {
    @Resource
    private ILoginService loginService;

    @Test
    public void getUserInfo(){
        String userName = "test";
        String returnMsg = loginService.getLoginInfo(userName);
        assertEquals("success" + userName, returnMsg);
    }
}

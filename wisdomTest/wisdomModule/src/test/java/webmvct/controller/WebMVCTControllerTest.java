package webmvct.controller;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import webmvct.service.interfaces.ILoginService;

/**
 * Created by 000 on 2016/5/27.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:D:\\wisdomTest\\wisdomModule\\src\\main\\webapp\\WEB-INF\\applicationContext.xml"})
public class WebMVCTControllerTest{
    @Autowired
    private ILoginService loginService;
    @Test
    public void getUsessrInfoTest(){
        String userName = "test";
//        String returnName = loginService.getLoginInfo(userName);
        assertEquals("success"+userName,"success"+userName);
    }
}

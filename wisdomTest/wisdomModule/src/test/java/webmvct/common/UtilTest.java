package webmvct.common;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

/**
 * Created by 000 on 2016/5/30.
 */
public class UtilTest {
    @Test
    public void getIdentityShow1(){
        String identityNo = "";
        String identityNoShow = Util.getIdentityShow(identityNo);
        assertEquals("",identityNoShow);
    }

    @Test
    public void getIdentityShow2(){
        String identityNo = "4122";
        String identityNoShow = Util.getIdentityShow(identityNo);
        assertEquals("4122",identityNoShow);
    }

    @Test
    public void getIdentityShow3(){
        String identityNo = "421127198711272274";
        String identityNoShow = Util.getIdentityShow(identityNo);
        assertEquals("4211**********2274",identityNoShow);
    }

    @Test
    public void getIdentityShow4(){
        String identityNo = "Pb1245678CD";
        String identityNoShow = Util.getIdentityShow(identityNo);
        assertEquals("Pb12***78CD",identityNoShow);
    }
}

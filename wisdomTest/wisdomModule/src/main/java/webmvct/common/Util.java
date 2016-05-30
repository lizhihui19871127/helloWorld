package webmvct.common;

/**
 * Created by 000 on 2016/5/30.
 */
public class Util {
    /**
     * 根据传入的证件号码，展示隐藏信息
     * @param identityNo
     * @return
     */
    public static String getIdentityShow(String identityNo){
        if(identityNo == null || "".equals(identityNo)){
            return "";
        }
        if(identityNo.length() <= 4){
            return identityNo;
        }
        int hideNum = identityNo.length()-8;
        String hideInfo = "";
        for(int i = 0;i < hideNum;i++){
            hideInfo += "*";
        }
        identityNo = identityNo.substring(0,4)+hideInfo+identityNo.substring(identityNo.length()-4);
        return identityNo;
    }
}

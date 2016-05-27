package webmvct.service.impl;

import org.springframework.stereotype.Service;
import webmvct.service.interfaces.ILoginService;

/**
 * Created by 000 on 2016/5/27.
 */
@Service
public class LoginServiceImpl implements ILoginService {

    @Override
    public String getLoginInfo(String userName) {
        return "success"+userName;
    }
}

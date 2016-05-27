package webmvct.dao.impl;

import org.springframework.stereotype.Service;
import webmvct.dao.interfaces.ILoginDao;
import webmvct.service.interfaces.ILoginService;

import javax.annotation.Resource;

/**
 * Created by 000 on 2016/5/27.
 */
@Service
public class LoginDaoImpl implements ILoginDao {
    @Resource
    private ILoginService loginService;
    @Override
    public String getLoginInfo(String userName) {
        return loginService.getLoginInfo(userName);
    }
}

package com.kenanhodzic.damdamagedetection.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {
    @RequestMapping(value = "/{path:^(?!api|swagger|static|css|js|import|download)[^.]+}/**")
    public String redirect() {
        return "forward:/";
    }

    @GetMapping("/login")
    String login() {
        return "login";
    }
}

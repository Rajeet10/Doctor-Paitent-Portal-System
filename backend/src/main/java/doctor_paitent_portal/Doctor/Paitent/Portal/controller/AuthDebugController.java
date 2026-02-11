package doctor_paitent_portal.Doctor.Paitent.Portal.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthDebugController {

    @GetMapping("/api/auth/me")
    public Object me(Authentication authentication) {
        return authentication;
    }
}

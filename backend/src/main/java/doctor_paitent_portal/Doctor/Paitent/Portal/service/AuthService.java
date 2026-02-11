package doctor_paitent_portal.Doctor.Paitent.Portal.service;


import doctor_paitent_portal.Doctor.Paitent.Portal.dto.JwtResponse;
import doctor_paitent_portal.Doctor.Paitent.Portal.dto.LoginRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.dto.RegisterRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.User;

public interface AuthService {


    JwtResponse login(LoginRequest request);
    User register(RegisterRequest request);
}

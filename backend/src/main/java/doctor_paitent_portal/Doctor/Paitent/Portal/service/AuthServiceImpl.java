package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.dto.JwtResponse;
import doctor_paitent_portal.Doctor.Paitent.Portal.dto.LoginRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.dto.RegisterRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.User;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.DoctorRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.PatientRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.UserRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    // ========================= LOGIN =========================
    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(userDetails);

        return new JwtResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }

    // ========================= REGISTER =========================
    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String role = request.getRole().toUpperCase();
        User savedUser;

        switch (role) {
            case "DOCTOR":
                Doctor doctor = new Doctor();
                doctor.setName(request.getName());
                doctor.setEmail(request.getEmail());
                doctor.setPassword(passwordEncoder.encode(request.getPassword()));
                doctor.setRole(User.Role.DOCTOR);
                doctor.setPhone(request.getPhone());
                doctor.setActive(true);

                // Optional: default doctor fields
                doctor.setSpecialty("");
                doctor.setQualification("");
                doctor.setExperienceYears(0);
                doctor.setAbout("");
                doctor.setConsultationFee(0.0);

                savedUser = doctorRepository.save(doctor);
                break;

            case "PATIENT":
                Patient patient = new Patient();
                patient.setName(request.getName());
                patient.setEmail(request.getEmail());
                patient.setPassword(passwordEncoder.encode(request.getPassword()));
                patient.setRole(User.Role.PATIENT);
                patient.setPhone(request.getPhone());
                patient.setActive(true);

                // Optional: default patient fields
                patient.setBloodGroup("");
                patient.setAddress("");
                patient.setMedicalHistory("");

                savedUser = patientRepository.save(patient);
                break;

            default:
                throw new RuntimeException("Invalid role. Must be DOCTOR or PATIENT.");
        }

        return savedUser;
    }
}

package doctor_paitent_portal.Doctor.Paitent.Portal;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootApplication
@EnableJpaAuditing
public class DoctorPaitentPortalApplication {


	public static void main(String[] args) {

		SpringApplication.run(DoctorPaitentPortalApplication.class, args);
		System.out.println("\n=================================================");
		System.out.println("🏥 Doctor-Patient Portal Started Successfully!");
		System.out.println("=================================================");
		System.out.println("📋 Swagger UI: http://localhost:8080/swagger-ui.html");
		System.out.println("🗄️  H2 Console: http://localhost:8080/h2-console");
		System.out.println("📚 API Docs: http://localhost:8080/api-docs");
		System.out.println("=================================================\n");
//		SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//		String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
//		System.out.println(encodedKey);

//		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//		System.out.println(encoder.encode("password123"));
	}

}




package doctor_paitent_portal.Doctor.Paitent.Portal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Doctor Patient Portal API")
                        .version("1.0")
                        .description("API documentation for Doctor Patient Portal"));
    }
}

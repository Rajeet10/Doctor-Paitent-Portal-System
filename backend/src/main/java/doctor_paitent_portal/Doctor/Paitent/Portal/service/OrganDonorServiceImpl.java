package doctor_paitent_portal.Doctor.Paitent.Portal.service;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.OrganDonor;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.OrganDonorRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.OrganDonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganDonorServiceImpl implements OrganDonorService {

    private final OrganDonorRepository donorRepository;

    @Override
    public OrganDonor registerDonor(OrganDonor donor) {
        if (donor.getRegistrationDate() == null) {
            donor.setRegistrationDate(java.time.LocalDate.now());
        }
        donor.setIsActive(true);
        return donorRepository.save(donor);
    }

    @Override
    public List<OrganDonor> getAllDonors() {
        return donorRepository.findAll();
    }

    @Override
    public OrganDonor getDonorById(Long id) {
        return donorRepository.findById(id).orElseThrow(() -> new RuntimeException("Donor not found"));
    }

    @Override
    public List<OrganDonor> searchByBloodGroup(String bloodGroup) {
        return donorRepository.findByBloodGroup(bloodGroup);
    }

    @Override
    public List<OrganDonor> searchByOrgan(String organ) {
        return donorRepository.findByOrganType(organ);
    }

    @Override
    public List<OrganDonor> searchByCity(String city) {
        return donorRepository.findByCity(city);
    }

    @Override
    public List<OrganDonor> searchByState(String state) {
        return donorRepository.findByState(state);
    }

    @Override
    public List<OrganDonor> searchByBloodGroupAndOrgan(String bloodGroup, String organ) {
        return donorRepository.findByBloodGroupAndOrgan(bloodGroup, organ);
    }

    @Override
    public OrganDonor updateDonor(Long id, OrganDonor donor) {
        OrganDonor existing = getDonorById(id);
        existing.setName(donor.getName());
        existing.setAge(donor.getAge());
        existing.setGender(donor.getGender());
        existing.setBloodGroup(donor.getBloodGroup());
        existing.setContactNumber(donor.getContactNumber());
        existing.setEmail(donor.getEmail());
        existing.setAddress(donor.getAddress());
        existing.setCity(donor.getCity());
        existing.setState(donor.getState());
        existing.setOrgansToDonate(donor.getOrgansToDonate());
        existing.setMedicalConditions(donor.getMedicalConditions());
        existing.setIsActive(donor.getIsActive() != null ? donor.getIsActive() : existing.getIsActive());
        return donorRepository.save(existing);
    }

    @Override
    public void deactivateDonor(Long id) {
        OrganDonor existing = getDonorById(id);
        existing.setIsActive(false);
        donorRepository.save(existing);
    }
}

package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.entity.OrganDonor;

import java.util.List;

public interface OrganDonorService {
    OrganDonor registerDonor(OrganDonor donor);
    List<OrganDonor> getAllDonors();
    OrganDonor getDonorById(Long id);
    List<OrganDonor> searchByBloodGroup(String bloodGroup);
    List<OrganDonor> searchByOrgan(String organ);
    List<OrganDonor> searchByCity(String city);
    List<OrganDonor> searchByState(String state);
    List<OrganDonor> searchByBloodGroupAndOrgan(String bloodGroup, String organ);
    OrganDonor updateDonor(Long id, OrganDonor donor);
    void deactivateDonor(Long id);
}

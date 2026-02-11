package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.dto.AppointmentRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Appointment;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;

import java.util.List;

public interface AppointmentService {
    Appointment bookAppointment(AppointmentRequest request);
    List<Appointment> getAppointmentsByDoctor(Long doctorId);
    List<Appointment> getAppointmentsByPatient(Long patientId);
    Appointment getAppointmentById(Long id);
    Appointment updateAppointmentStatus(Long id, Appointment.AppointmentStatus status);
    void cancelAppointment(Long id);
    List<Appointment> getAllAppointments();
    List<Patient> getPatientsForDoctor(Long doctorId);

}

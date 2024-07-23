import PatientForm from "@/components/forms/PatientForm"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import AppointMentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({ params: { userId }}: SearchParamProps) {
    const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex items-center mb-12">
            <Image
              src="/assets/icons/logo.png"
              height={1000}
              width={1000}
              alt="MediSync Logo"
              className="h-10 w-fit mr-2"
            />
            <h1 className="text-2xl font-bold">MediSync</h1>
          </div>
          <AppointMentForm 
            type = "create"
            userId = {userId}
            patientId = {patient.$id}
          />
          
        <p className="justify-items-end text-dark-600 xl:text-left"> © 2024 MediSync </p>
            
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="Patient"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  )
}
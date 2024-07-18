"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import { CustomFormField } from "@/components/CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import Image from "next/image"
 

 
const RegisterForm = ({ user }: {user: User}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: PatientFormDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      console.log("Form submitted with data:", values);
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        console.log("NEw Patient created...........................")
        router.push(`/patients/${user.$id}/new-appointment`);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        console.log("Form onSubmit event triggered");
        form.handleSubmit(onSubmit)(e);
      }} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome.</h1>
          <p className="text-dark-700">Please Enter your Information.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          form={form}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            form={form}
            name="phone"
            label="Phone Number"
            placeholder="(386) 219 9000"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            form={form}
            name="birthDate"
            label="Date of Birth"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            form={form}
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={GenderOptions}
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}
            name="address"
            label="Address"
            placeholder="35th Street, Gainesville"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian Name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            form={form}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(386) 219 9000"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            form={form}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a Physician"
            options={Doctors.map((doctor) => ({
                value: doctor.name,
                label: doctor.name,
            }))}
            renderOption={(option) => {
                const doctor = Doctors.find(d => d.name === option.value);
                return (
                <div className="flex cursor-pointer items-center gap-2">
                    <Image
                    src={doctor?.image || ''}
                    width={32}
                    height={32}
                    alt={option.value}
                    className="rounded-full border border-dark-500"
                    />
                    <p>{option.value}</p>
                </div>
                );
            }}
        />

        <div>
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                form={form}
                name="insuranceProvider"
                label="Insurance Provider"
                placeholder="United Healthcare"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                form={form}
                name="insurancePolicyNumber"
                label="Insurance Policy Number"
                placeholder="XYZ1234"
            />
        </div>

        <div>
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                form={form}
                name="allergies"
                label="Allergies"
                placeholder="Peanuts, Pollen"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                form={form}
                name="currentMedication"
                label="Current Medication"
                placeholder="Cetirizine"
            />
        </div>

        <div>
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                form={form}
                name="familyMedicalHistory"
                label="Family Medical History"
                placeholder="Mother has high blood pressure"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                form={form}
                name="pastMedicalHistory"
                label="Past Medical History"
                placeholder="Breathing Difficulty"
            />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            form={form}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
            options={IdentificationTypes.map((type) => ({
                value: type,
                label: type
            }))}
            />

            <CustomFormField
                fieldType={FormFieldType.INPUT}
                form={form}
                name="identificationNumber"
                label="Identification Number"
                placeholder="1234567890"
            />

        <CustomFormField
          fieldType={FormFieldType.FILE_UPLOAD}
          form={form}
          name="identificationDocument"
          label="Upload Identification Document"
          accept="image/*"
          multiple={false}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        {/* <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          form={form}
          name="treatmentConsent"
          label="I consent to treatment"
        /> 
         <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          form={form}
          name="disclosureConsent"
          label="I consent to disclosure of Information"
        /> */}
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          form={form}
          name="privacyConsent"
          label="I consent to Privacy Policy"
        />
        
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm

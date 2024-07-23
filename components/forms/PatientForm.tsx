"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { CustomFormField }  from "@/components/CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { create } from "domain"
import { useRouter } from "next/navigation"
import { checkUserExists, createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    SELECT = 'select',
    DATE_PICKER = 'datePicker',
    SKELETON = 'skeleton',
    DROPDOWN = "DROPDOWN",
    SELECTGENDER = "SELECTGENDER",
    FILE_UPLOAD = "FILE_UPLOAD",
}

const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);
    
        try {
            console.log("Submitting form with data:", { name, email, phone });

            const existingUser = await checkUserExists(email, phone);

            if (existingUser) {
                console.log("User exists, redirecting to AppointmentForm");
                router.push(`/patients/${existingUser.$id}/new-appointment`);
            } else {
                console.log("User does not exist, redirecting to RegisterForm");
                const newUser = await createUser({ name, email, phone });
                console.log("New user created:", newUser);

                if (newUser) {
                  console.log(encodeURIComponent(name))
                    router.push(`/patients/${newUser.$id}/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
                } else {
                    console.error("User creation failed: No user returned");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    }
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi There</h1>
                    <p className="text-dark-700">Schedule your appointment</p>
                </section>
                <CustomFormField 
                    fieldType={FormFieldType.INPUT}
                    form={form} 
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
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
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm;

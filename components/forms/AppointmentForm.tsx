"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import Image from "next/image";
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
    userId, patientId, type, appointment, setOpen
} : {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment: Appointment;
    setOpen: (open: boolean) => void;
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            reason: appointment ? appointment.reason : '',
            note: appointment ? appointment.note : '',
            schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
            cancellationReason: appointment?.cancellationReason || '',
        },
    });

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        console.log("submitting with type ", type);
        setIsLoading(true);

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending';
                break;
        }

        try {
            console.log("Submitting form with data:", values);

            let appointmentData;
            if (type === 'create' && patientId) {
                appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    note: values.note,
                    schedule: new Date(values.schedule),
                    status: status as Status,
                };
                const appointment = await createAppointment(appointmentData);
            
                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason,
                    },
                    type
                };
                const updatedAppointment = await updateAppointment(appointmentToUpdate);

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }
        } catch (error) {
            console.error("Error handling appointment:", error);
        } finally {
            setIsLoading(false);
        }
    }

    let buttonLabel;
    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'create':
            buttonLabel = 'Create Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break;
        default:
            buttonLabel = 'Submit';
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === 'create' && <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request your appointment</p>
                </section>}

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            form={form}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a Doctor"
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
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            form={form}
                            name="schedule"
                            label="Schedule your appointment"
                            ShowTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                form={form}
                                name="reason"
                                label="Reason for Appointment"
                                placeholder="Enter reason for appointment"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                form={form}
                                name="note"
                                label="Notes"
                                placeholder="Enter notes"
                            />
                        </div>

                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        form={form}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Enter notes for cancellation"
                    />
                )}

                <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
};

export default AppointmentForm;

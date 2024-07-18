import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId }}: SearchParamProps) => {

    const user = await getUser(userId);

    return (
        <div className="flex h-screen max-h-screen">
          <section className="remove-scrollbar container">
            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
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
              
              <RegisterForm user = { user } />

              <p className="copyright py-12"> © 2024 MediSync </p>
             
            </div>
          </section>
          <Image
            src="/assets/images/register-img.png"
            height={1000}
            width={1000}
            alt="Patient"
            className="side-img max-w-[390px]"
          />
        </div>
      )
}

export default Register;

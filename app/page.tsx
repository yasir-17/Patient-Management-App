'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PasskeyModal from "@/components/PasskeyModal";
import PatientForm from "@/components/forms/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonialsData } from "@/constants/testimonialsData";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin == 'true';
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isAdmin && <PasskeyModal />}
      <header className="w-full py-4 px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/assets/icons/logo.png"
              height={40}
              width={40}
              alt="MediSync Logo"
              className="mr-3"
            />
            <h1 className="text-2xl font-bold text-green-600">MediSync</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="#features" className="text-gray-600 hover:text-green-600">Features</Link></li>
              <li><Link href="#testimonials" className="text-gray-600 hover:text-green-600">Testimonials</Link></li>
              <li><Link href="#contact" className="text-gray-600 hover:text-green-600">Contact</Link></li>
              <li><Link href="/?admin=true" className="text-green-600 hover:underline">Admin Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-4xl font-bold text-green-600 mb-6">WELCOME TO MEDISYNC</h2>
              <p className="text-xl mb-8 text-gray-700">Empowering Patients and Healthcare Managers.</p>
              <p className="text-gray-600 mb-8">
                MediSync provides an all-in-one platform for both patients and healthcare managers. 
                Patients can easily book appointments, while managers can efficiently handle patient records and streamline operations through our intuitive admin interface. 
                Our comprehensive solution ensures that healthcare professionals can focus on delivering exceptional care with ease and efficiency.
              </p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-8">Get Started</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-dark-300 p-6 rounded-lg shadow-lg">
                  <PatientForm />
                </DialogContent>
              </Dialog>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Image
                src="/assets/images/onboarding.webp"
                alt="Healthcare Professional"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Efficient Patient Records", description: "Easily manage and access patient information.", icon: "📋" },
                { title: "Appointment Scheduling", description: "Streamline your booking process with our intuitive calendar.", icon: "🗓️" },
                { title: "Secure Data Storage", description: "Your patients' data is safe with our advanced security measures.", icon: "🔒" }
              ].map((feature, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-4xl mr-4">{feature.icon}</span>
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">What Our Users Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonialsData.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="pt-6">
                    <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
            <p className="text-xl mb-8 text-gray-600">Have questions? We're here to help!</p>
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-8">Contact Us</Button>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-8 bg-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2024 MediSync. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

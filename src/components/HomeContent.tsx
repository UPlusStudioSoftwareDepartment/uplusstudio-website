"use client";

import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicePackages from "@/components/ServicePackages";
import AppointmentModal from "@/components/AppointmentModal";
import GoogleMap from "@/components/GoogleMap";
import { useState, useEffect } from "react";
import { listFiles } from "@/app/utils/helper-functions";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  package: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function HomeContent() {
  const { t } = useTranslation();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    package: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Re-validate form when language changes to update error messages
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      validateForm();
    }
  }, [t]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = t('home:contact.validation.nameRequired');
    }

    if (!formData.email.trim()) {
      errors.email = t('home:contact.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('home:contact.validation.emailInvalid');
    }

    if (formData.phone && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = t('home:contact.validation.phoneInvalid');
    }

    if (!formData.message.trim()) {
      errors.message = t('home:contact.validation.messageRequired');
    } else if (formData.message.trim().length < 10) {
      errors.message = t('home:contact.validation.messageMinLength');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        package: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    listFiles('public/images/projects').then(setFiles);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Slideshow */}
      <HeroSection onAppointmentClick={() => setIsAppointmentModalOpen(true)} />

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t("home:about.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t("home:about.description")}
              </p>
              <p className="text-lg text-gray-600">
                {t("home:about.mission")}
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <Image
              src="/images/about_us/general_black.jpeg"
              alt="About Us"
              width={500}
              height={500}
              className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <ServicePackages />

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t("home:projects.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {files?.map((file) => (
              <div 
                key={file.name} 
                className="group cursor-pointer"
                onClick={() => {
                  // Scroll to contact section when project is clicked
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="h-64 rounded-lg mb-4 group-hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <Image 
                    src={`/images/projects/${file.name}`} 
                    alt={file.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {file.name}
                </h3>
                <p className="text-gray-600 group-hover:text-blue-500 transition-colors duration-200">
                  {file.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t("home:contact.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t("home:contact.getInTouch")}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{t("home:contact.address")}</h4>
                  <p className="text-gray-600">{t("home:contact.addressText")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{t("home:contact.phone")}</h4>
                  <p className="text-gray-600">+90 212 555 0123</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{t("home:contact.email")}</h4>
                  <p className="text-gray-600">info@uplusstudio.com</p>
                </div>
              </div>
              
              {/* Google Map */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">{t("home:contact.findUs")}</h4>
                <GoogleMap 
                  address="İncek, Türkan Şoray Cd. No: 4, 06830 Gölbaşı/Ankara"
                  height="300px"
                  zoom={16}
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{t('home:contact.success')}</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{t('home:contact.error')}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.selectSubject")}
                  </label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t("home:contact.selectSubject")}</option>
                    <option value="general">{t("home:contact.subjects.general")}</option>
                    <option value="project">{t("home:contact.subjects.project")}</option>
                    <option value="consultation">{t("home:contact.subjects.consultation")}</option>
                    <option value="partnership">{t("home:contact.subjects.partnership")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.selectPackage")}
                  </label>
                  <select 
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t("home:contact.selectPackage")}</option>
                    <option value="basic">{t("home:contact.packages.basic")}</option>
                    <option value="premium">{t("home:contact.packages.premium")}</option>
                    <option value="enterprise">{t("home:contact.packages.enterprise")}</option>
                    <option value="custom">{t("home:contact.packages.custom")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("home:contact.message")} *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("home:contact.sending") : t("home:contact.send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
}

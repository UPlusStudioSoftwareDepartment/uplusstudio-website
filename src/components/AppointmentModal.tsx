"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import AdvancedCalendar from "./AdvancedCalendar";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const { t } = useTranslation("appointment");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Yup validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required(t('validation.nameRequired')),
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    phone: yup.string().matches(/^[+]?[\d\s\-\(\)]+$/, t('validation.phoneInvalid')).required(t('validation.phoneRequired')),
    service: yup.string().required(t('validation.serviceRequired')),
    date: yup.string().required(t('validation.dateRequired')),
    time: yup.string().required(t('validation.timeRequired')),
    message: yup.string().min(10, t('validation.messageMinLength')).required(t('validation.messageRequired'))
  });

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path && error.message) {
            errors[error.path[0]] = error.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleDownload = () => {
    // Check if all required fields are filled
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      alert('Please fill in all required fields before downloading the appointment card.');
      return;
    }

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      alert('Unable to generate appointment card. Please try again.');
      return;
    }
    
    // Set canvas size (card size)
    canvas.width = 400;
    canvas.height = 600;
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw white card
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 20);
    ctx.fill();
    
    // Draw header
    const headerGradient = ctx.createLinearGradient(0, 60, 0, 120);
    headerGradient.addColorStop(0, '#1e3c72');
    headerGradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = headerGradient;
    ctx.beginPath();
    ctx.roundRect(40, 60, canvas.width - 80, 80, 15);
    ctx.fill();
    
    // Draw logo and title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('UPlus Studio', canvas.width / 2, 90);
    
    ctx.font = '16px Segoe UI';
    ctx.fillText('Appointment Card', canvas.width / 2, 115);
    
    ctx.font = '12px Segoe UI';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Architecture & Design', canvas.width / 2, 130);
    ctx.globalAlpha = 1;
    
    // Draw appointment ID
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(60, 160, canvas.width - 120, 30);
    ctx.fillStyle = '#1976d2';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(`ID: #APT${Date.now().toString().slice(-6)}`, canvas.width / 2, 180);
    
    // Draw appointment details
    const details = [
      { label: 'Name', value: formData.name },
      { label: 'Email', value: formData.email },
      { label: 'Phone', value: formData.phone },
      { label: 'Service', value: formData.service },
      { label: 'Date', value: formData.date ? new Date(formData.date).toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }) : 'Not selected' },
      { label: 'Time', value: formData.time }
    ];
    
    if (formData.message) {
      details.push({ label: 'Message', value: formData.message });
    }
    
    let yPos = 220;
    details.forEach(detail => {
      // Draw line
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, yPos);
      ctx.lineTo(canvas.width - 60, yPos);
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#666';
      ctx.font = '14px Segoe UI';
      ctx.textAlign = 'left';
      ctx.fillText(detail.label, 60, yPos + 20);
      
      // Draw value
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Segoe UI';
      ctx.textAlign = 'right';
      ctx.fillText(detail.value, canvas.width - 60, yPos + 20);
      
      yPos += 40;
    });
    
    // Draw footer
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(40, canvas.height - 100, canvas.width - 80, 60);
    
    ctx.fillStyle = '#1e3c72';
    ctx.font = 'bold 16px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('UPlus Studio', canvas.width / 2, canvas.height - 70);
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Segoe UI';
    ctx.fillText('📞 +90 212 555 0123 | ✉️ info@uplusstudio.com', canvas.width / 2, canvas.height - 50);
    
    ctx.font = '10px Segoe UI';
    ctx.fillText(`Scheduled on: ${new Date().toLocaleString('tr-TR')}`, canvas.width / 2, canvas.height - 30);
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointment-card-${formData.name}-${formData.date}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      message: ''
    });
    setFormErrors({});
    setSubmitStatus(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
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
        service: '',
        date: '',
        time: '',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{t("title")}</h2>
              <p className="text-slate-300 text-sm mt-1">{t("subtitle")}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 p-8 pt-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t("name")} *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t("phone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="+90 555 123 4567"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t("service")} *
                    </label>
                    <select
                      required
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.service 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select Service</option>
                      <option value="architectural">Architectural Design</option>
                      <option value="interior">Interior Design</option>
                      <option value="consulting">Consulting</option>
                      <option value="project">Project Management</option>
                    </select>
                    {formErrors.service && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.service}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                  {t("message")}
                </h3>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none ${
                    formErrors.message 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                )}
              </div>

              {/* Quick Time Slots */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                  Quick Time Selection
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({...formData, time})}
                      className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                        formData.time === time
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  {t("book")}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Calendar */}
          <div className="lg:w-96 bg-slate-50 border-l border-slate-200 p-8">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                {t("schedule")}
              </h3>
              <AdvancedCalendar
                selectedDate={formData.date}
                onDateSelect={(date) => setFormData({...formData, date})}
                selectedTime={formData.time}
                onTimeSelect={(time) => setFormData({...formData, time})}
              />
            </div>

            {/* Appointment Card Preview */}
            {(formData.date || formData.time) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
                  Appointment Card
                </h3>
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-blue-900 mb-1">UPlus Studio</div>
                        <div className="text-sm text-blue-600">Appointment Card</div>
                      </div>
                      <div className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full inline-block">
                        ID: #APT${Date.now().toString().slice(-6)}
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{formData.name || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <div className="mb-2">📱 Download your appointment card as JPEG</div>
                    <div>All fields are required for download</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download JPEG Card</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

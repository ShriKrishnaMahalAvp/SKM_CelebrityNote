import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Star, Upload, Calendar, User, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * ⚠️ CONFIGURATION STEP ⚠️
 * Paste your Google Apps Script Web App URL below.
 * It should look like: https://script.google.com/macros/s/.../exec
 * ------------------------------------------------------------------
 */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzWCiGoK4bETcUkZZeX6Cu1uC6Tpg8lMgZQGsQVqeY4-L1aylxWqahEsTjU29lDsC7T/exec"; 

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-[#800000] text-white py-6 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Shri Krishna Mahal</h1>
          <p className="text-sm opacity-90 mt-1 italic tracking-wide">A tradition of elegance</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex justify-center">
        <GuestbookForm />
      </main>
    </div>
  );
};

const GuestbookForm = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    rating: 5,
    message: '',
    image: null as string | null, // Stores Base64 string
    imageName: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // --- HANDLERS ---

  // Handle Text Inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Star Rating
  const handleRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  // Handle Image Upload & Convert to Base64
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      // Check size (limit to 2MB for safety with Google Script limits)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please upload an image under 2MB.");
        return;
      }

      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string,
          imageName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (WEB_APP_URL.includes("PASTE_YOUR")) {
      setStatus('error');
      setErrorMessage("Please paste your Google Apps Script URL in the code (Line 14)!");
      return;
    }

    try {
      // 'no-cors' mode is used to send data without strict browser security blocks
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      // Assuming success if no network error
      setStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        date: '',
        rating: 5,
        message: '',
        image: null,
        imageName: ''
      });

    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
      setErrorMessage("Failed to send data. Please check your internet connection.");
    }
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8">
        <h2 className="text-2xl font-serif text-[#800000] font-bold mb-6 text-center">
          Share Your Experience
        </h2>

        {status === 'success' ? (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Thank You!</h3>
            <p className="text-gray-600 mt-2">
              Your review has been sent to our guestbook.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors"
            >
              Write Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Date Input (Keypad Rejected, Picker Forced Safe Mode) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Date of Function</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  // 1. Prevent Typing
                  onKeyDown={(e) => e.preventDefault()}
                  // 2. Force Picker on Click (Wrapped in Try-Catch for Security Sandbox)
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {
                      console.warn("Auto-picker blocked by sandbox environment (Safe to ignore)", err);
                    }
                  }} 
                  // 3. Pointer cursor to look like a button
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all text-gray-600 cursor-pointer caret-transparent"
                />
              </div>
            </div>

            {/* Rating Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`focus:outline-none transition-transform hover:scale-110 ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star fill={star <= formData.rating ? "currentColor" : "none"} size={32} />
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tell us more</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How was your experience at Shri Krishna Mahal?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Photo (Optional)</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-[#800000]">
                  {formData.imageName ? (
                    <div className="flex items-center gap-2 text-[#800000] font-medium">
                      <CheckCircle size={20} />
                      <span className="truncate max-w-[200px]">{formData.imageName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm">Click to upload image</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-[#800000] text-white py-3 rounded-lg font-bold shadow-md hover:bg-[#600000] active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;

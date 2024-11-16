import { useState } from "react";
import { Mail, Phone, Send, Star } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRating = (rating: any) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { name, email, rating, message } = formData;

    if (!name || !email || !message) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setSuccessMessage("Thank you for your feedback!");
    setErrorMessage("");
    setFormData({ name: "", email: "", rating: 0, message: "" });
  };

  return (
    <div className="min-h-screen  bg-white">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg ">
        <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
        <p className="text-gray-600 text-center mb-6">
          We value your feedback! Please let us know how we can improve.
        </p>

        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium">
              Rating our Website
            </label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  className={`text-yellow-500 hover:text-yellow-600 ${
                    formData.rating >= star
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium"
            >
              Feedback Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 mt-1 border rounded-lg"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Send size={16} className="mr-2" />
            Submit Feedback
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">Or reach us directly at:</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <a href="mailto:support@example.com" className="flex items-center">
              <Mail size={20} className="mr-1" /> support@example.com
            </a>
            <span>|</span>
            <a href="tel:+1234567890" className="flex items-center">
              <Phone size={20} className="mr-1" /> +1 234 567 890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

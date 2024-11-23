import { useState, ChangeEvent, FormEvent } from "react";
import { Send } from "lucide-react";

interface FormData {
  rating: number;
  message: string;
}

const Feedback = () => {
  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle rating change
  const handleRating = (rating: number) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  // Handle message change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { rating, message } = formData;

    // Validation check
    if (rating === 0 || !message) {
      setErrorMessage("Please select a rating and provide your feedback.");
      return;
    }

    // Success message
    setSuccessMessage("Thank you for your feedback!");
    setErrorMessage("");
    setFormData({ rating: 0, message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          We Value Your Feedback
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Let us know how we can improve!
        </p>

        {/* Success/Error Messages */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium">
              How do you feel about our platform?
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[
                { emoji: "😢", label: "Sad", value: 1 },
                { emoji: "😐", label: "Neutral", value: 2 },
                { emoji: "🙂", label: "Happy", value: 3 },
                { emoji: "😃", label: "Excited", value: 4 },
                { emoji: "😍", label: "Loved it", value: 5 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleRating(item.value)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition ${
                    formData.rating === item.value
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-300"
                  } hover:scale-105`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm text-gray-600">{item.label}</span>
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
      </div>
    </div>
  );
};

export default Feedback;

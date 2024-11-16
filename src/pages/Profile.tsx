import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
      profilePicture: null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      bio: Yup.string().max(5000).optional(),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      profilePicture: Yup.mixed()
        .nullable()
        .required("Profile picture is required")
        .test(
          "fileSize",
          "File too large",
          (value: any) => !value || (value && value.size <= 5000000)
        ) // Max file size 5MB
        .test(
          "fileFormat",
          "Unsupported file format",
          (value: any) =>
            !value ||
            (value && ["image/jpeg", "image/png"].includes(value.type))
        ),
    }),
    onSubmit: (values) => {
      console.log("Form data", values);
      // Add form submission logic here
    },
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("profilePicture", file);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-white p-8">
      <form onSubmit={formik.handleSubmit}>
        {/* Banner Section */}
        <div className="relative w-full rounded-lg">
          <img
            src="https://cdn.pixabay.com/photo/2023/12/24/16/43/autumn-8467482_640.jpg"
            className="h-[350px] w-full rounded-lg "
            alt="Banner"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8">
            {/* Profile Picture Preview */}
            <img
              src={
                imagePreview ||
                "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
              }
              className="h-[180px] w-[180px] rounded-full border-4 border-white object-cover"
              alt="Profile"
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-white bg-blue-500 py-1 px-3 rounded-full text-sm"
              >
                Change Photo
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className=" py-8  rounded-lg  w-full  mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-600"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                {...formik.getFieldProps("username")}
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300 ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-600"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>
          {/** biography */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-600"
            >
              Biography <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              {...formik.getFieldProps("bio")}
              className={`w-full px-4 h-[200px] py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300 ${
                formik.touched.bio && formik.errors.bio
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

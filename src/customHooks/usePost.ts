import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const usePost = <T = any>(url: string) => {
  const [loading, setLoading] = useState<boolean>(false);

  const PostData = async (data: any): Promise<T | undefined> => {
    try {
      setLoading(true);
      const response = await axios.post<T>(url, data);
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "An error occurred");
      return undefined; // Return undefined in case of an error
    }
  };

  return { loading, PostData };
};

export default usePost;

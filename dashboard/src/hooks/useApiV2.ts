import { useEffect, useState } from "react";

function useApi() {
  const CreateOperation = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = async (...params) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(...params);
        setData(response.data);
        setLoading(false);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    };

    useEffect(() => {
      fetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return {
      data,
      loading,
      error,
      fetch,
    };
  };

  return { CreateOperation };
}

export default useApi;

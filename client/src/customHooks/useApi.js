import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackBar } from "state";
import { configUrl } from "config";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();


  const fetchData = async (url, method, body, token) => {
    try {
      debugger;
      setLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let options = {
        method,
        headers: headers,
      };

      if (body) {
        options["body"] = JSON.stringify(body)
      }

      const response = await fetch(`${configUrl}/${url}`, options);

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setError(data.error);
        dispatch(
          showSnackBar({
            showSnackBar: true,
            serverMsg: { message: data.error, severity: "error" },
          })
        );
        return null;
      }
      return data;
    } catch (err) {
      setLoading(false);
      dispatch(
        showSnackBar({
          showSnackBar: true,
          serverMsg: { message: err, severity: "error" },
        })
      );
      setError("An error occurred while fetching data");
      return null;
    }
  };

  return { loading, error, fetchData };
};

export default useApi;

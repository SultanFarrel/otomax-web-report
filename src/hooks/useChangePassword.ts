import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await apiClient.post("/auth/change_password", payload);
  return data;
};

export function useChangePassword() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (err: any) => {
      setSuccess(false);
      setError(err.response?.data?.error || "Gagal mengubah password.");
    },
  });

  return {
    changePassword: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess,
    error,
    reset: () => {
      mutation.reset();
      setError(null);
      setSuccess(false);
    },
  };
}

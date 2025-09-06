import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { useChangePassword } from "@/hooks/useChangePassword";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export const ChangePasswordCard: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [isOldPassVisible, setIsOldPassVisible] = useState(false);
  const [isNewPassVisible, setIsNewPassVisible] = useState(false);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);

  const { changePassword, isLoading, isSuccess, error, reset } =
    useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset(); // Reset status dari hook
    setFormError(null);

    if (newPassword !== confirmPassword) {
      setFormError("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("Password baru minimal harus 6 karakter.");
      return;
    }

    changePassword({ oldPassword, newPassword });
  };

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <CardHeader>
        <div>
          <h2 className="text-xl font-semibold">Ganti Password</h2>
          <p className="text-sm text-default-500">
            Ubah password login Anda secara berkala untuk menjaga keamanan.
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          type={isOldPassVisible ? "text" : "password"}
          label="Password Lama"
          placeholder="Masukkan password lama Anda"
          value={oldPassword}
          onValueChange={setOldPassword}
          startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
          isRequired
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsOldPassVisible(!isOldPassVisible)}
            >
              {isOldPassVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-default-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-default-400" />
              )}
            </button>
          }
        />
        <Input
          type={isNewPassVisible ? "text" : "password"}
          label="Password Baru"
          placeholder="Minimal 6 karakter"
          value={newPassword}
          onValueChange={setNewPassword}
          startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
          isRequired
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsNewPassVisible(!isNewPassVisible)}
            >
              {isNewPassVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-default-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-default-400" />
              )}
            </button>
          }
        />
        <Input
          type={isConfirmPassVisible ? "text" : "password"}
          label="Konfirmasi Password Baru"
          placeholder="Ketik ulang password baru Anda"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
          isRequired
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsConfirmPassVisible(!isConfirmPassVisible)}
            >
              {isConfirmPassVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-default-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-default-400" />
              )}
            </button>
          }
        />
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2">
        <Button type="submit" color="primary" isLoading={isLoading}>
          Ubah Password
        </Button>
        {formError && <p className="text-sm text-danger">{formError}</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
        {isSuccess && (
          <p className="text-sm text-success">Password berhasil diubah!</p>
        )}
      </CardFooter>
    </Card>
  );
};

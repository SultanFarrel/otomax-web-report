import React, { useState, useEffect, useRef } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const WebsiteSettings: React.FC = () => {
  const { siteSettings, isLoading, isUpdating, updateSettings } =
    useSiteSettings();
  const [judul, setJudul] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  // Ref untuk file input agar bisa di-trigger dari tombol
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (siteSettings) {
      setJudul(siteSettings.judul);
    }
  }, [siteSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", judul);
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (faviconFile) {
      formData.append("favicon", faviconFile);
    }
    updateSettings(formData);
  };

  if (isLoading) {
    return <Spinner label="Memuat pengaturan..." />;
  }

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <CardHeader>
        <div>
          <h2 className="text-xl font-semibold">Pengaturan Website</h2>
          <p className="text-sm text-default-500">
            Ubah judul, logo, dan favicon yang tampil di website.
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <Input
          label="Judul Website"
          placeholder="Masukkan judul website"
          value={judul}
          onValueChange={setJudul}
        />

        {/* Logo Uploader */}
        <div>
          <label className="block text-sm font-medium text-default-700 mb-2">
            Logo Website
          </label>
          <Button
            type="button"
            variant="flat"
            onPress={() => logoInputRef.current?.click()}
          >
            Pilih File Logo
          </Button>
          <input
            type="file"
            ref={logoInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/svg+xml"
            onChange={(e) =>
              setLogoFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {logoFile && (
            <p className="text-sm text-default-500 mt-2">
              File dipilih: {logoFile.name}
            </p>
          )}
        </div>

        {/* Favicon Uploader */}
        <div>
          <label className="block text-sm font-medium text-default-700 mb-2">
            Favicon
          </label>
          <Button
            type="button"
            variant="flat"
            onPress={() => faviconInputRef.current?.click()}
          >
            Pilih File Favicon (.ico)
          </Button>
          <input
            type="file"
            ref={faviconInputRef}
            className="hidden"
            accept="image/x-icon"
            onChange={(e) =>
              setFaviconFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {faviconFile && (
            <p className="text-sm text-default-500 mt-2">
              File dipilih: {faviconFile.name}
            </p>
          )}
        </div>
      </CardBody>
      <CardFooter>
        <Button type="submit" color="primary" isLoading={isUpdating}>
          Simpan Perubahan
        </Button>
      </CardFooter>
    </Card>
  );
};

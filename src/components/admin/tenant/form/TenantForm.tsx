import React, { useState } from "react";
import { TenantModel } from "../type/TenantModel";

interface TenantFormProps {
  initialTenant?: TenantModel;
  onSubmit?: (tenant: TenantModel) => void;
}

const defaultTenant: TenantModel = {
  slug: "",
  name: "",
  email: "",
  customDomainVerified: false,
  plan: "trial",
  subscriptionStatus: "active",
  branding: { primaryColor: "#3b82f6", secondaryColor: "#f4e04f" },
  paymentGateways: {},
  features: {
    websiteEnabled: true,
    ecommerceEnabled: true,
    blogEnabled: true,
    invoicesEnabled: true,
  },
  settings: { locale: "en-US", currency: "USD", timezone: "UTC" },
  status: "active",
};

const TenantForm: React.FC<TenantFormProps> = ({ initialTenant, onSubmit }) => {
  const [tenant, setTenant] = useState<TenantModel>({
    ...defaultTenant,
    ...initialTenant,
    branding: { ...defaultTenant.branding, ...initialTenant?.branding },
    features: { ...defaultTenant.features, ...initialTenant?.features },
    settings: { ...defaultTenant.settings, ...initialTenant?.settings },
    paymentGateways: initialTenant?.paymentGateways || {},
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox" && "checked" in target
        ? (target as HTMLInputElement).checked
        : undefined;

    if (name.startsWith("branding.")) {
      setTenant((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("features.")) {
      setTenant((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name.split(".")[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("settings.")) {
      setTenant((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name === "paymentGateways") {
      try {
        setTenant((prev) => ({
          ...prev,
          paymentGateways: JSON.parse(value),
        }));
      } catch {
        // ignore parse error
      }
    } else if (type === "checkbox") {
      setTenant((prev) => ({ ...prev, [name]: checked }));
    } else {
      setTenant((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) onSubmit(tenant);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      {/* ...rest of your form unchanged... */}
      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded font-semibold">
        Save Tenant
      </button>
    </form>
  );
};

export default TenantForm;
"use client";

import React, { useState } from "react";
import { LLMModel } from "../type/LLMModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface LLMFormProps {
  initialData?: LLMModel;
  onSubmit: (data: LLMModel) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const LLmForm: React.FC<LLMFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LLMModel>({
    name: initialData?.name || "",
    secreteKey: initialData?.secreteKey || "",
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LLMModel, string>>>({});
  const {user}= useSelector((state:RootState)=>state.user)

  const LLMModelType = ["ChatGPT", "Gemini"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LLMModel]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
    // Clear error when user selects
    if (errors.name) {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LLMModel, string>> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!formData.secreteKey || formData.secreteKey.trim() === "") {
      newErrors.secreteKey = "Secret Key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
     const data={...formData, tenantId:user?.tenantId}
    await onSubmit(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?._id ? "Edit LLM Model" : "Add LLM Model"}</CardTitle>
        <CardDescription>
          Configure your Language Model settings
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Model Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.name}
              onValueChange={handleSelectChange}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.name ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a model type" />
              </SelectTrigger>
              <SelectContent>
                {LLMModelType.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secreteKey">
              Secret Key / API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="secreteKey"
              name="secreteKey"
              type="password"
              placeholder="Enter your API key"
              value={formData.secreteKey}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.secreteKey ? "border-red-500" : ""}
            />
            {errors.secreteKey && (
              <p className="text-sm text-red-500">{errors.secreteKey}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your API key will be stored securely and never shared
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Enable or disable this LLM model
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive ?? true}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData?._id ? "Update" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LLmForm;
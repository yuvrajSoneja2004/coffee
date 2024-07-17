"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";
import { formatDate } from "@/lib/formatDate";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance } from "@/lib/axiosInstance";

function MeteorologicalDialogue() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rainfall: "",
      humidityMin: "",
      humidityMax: "",
      temperatureMin: "",
      temperatureMax: "",
    },
  });

  const validateCustomFields = () => {
    let isValid = true;
    const newErrors = {};

    // Custom field validations if any

    return isValid;
  };

  const handleSave = async (data) => {
    if (!validateCustomFields()) {
      return;
    }

    const payload = {
      date: formatDate(),
      rainfall: data.rainfall,
      humidityMin: data.humidityMin,
      humidityMax: data.humidityMax,
      temperatureMin: data.temperatureMin,
      temperatureMax: data.temperatureMax,
    };

    try {
      const response = await axiosInstance.post(
        "/api/addMeteorological",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setOpen(false);
      if (response.status === 200) {
        dispatch(handleReload(12));
        console.log("Data saved successfully!");
        reset();
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Dialog open={open}>
      <div className="flex items-center justify-between">
        <DialogTrigger>
          <Button
            className="flex-center flex gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus />
            Add Data
          </Button>
        </DialogTrigger>
        <Button onClick={() => dispatch(handleReload(12))}>
          <RotateCcw size={16} />
        </Button>
      </div>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="">
                <div className="">
                  <label htmlFor="Date">Date</label>
                  <Input
                    className="mt-2"
                    value={formatDate(new Date())}
                    readOnly
                  />
                </div>

                <div className="mt-2">
                  <label htmlFor="rainfall">Rainfall (in mm)</label>
                  <Controller
                    name="rainfall"
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" type="number" {...field} />
                    )}
                  />
                  {errors.rainfall && (
                    <p className="text-red-500">{errors.rainfall.message}</p>
                  )}
                </div>

                {/* Humidity  */}
                <div className="my-2 mb-4">
                  <h3 className="mb-3">Humidity</h3>
                  <div className="flex w-full justify-between">
                    <div>
                      <label htmlFor="humidityMin">Min</label>
                      <Controller
                        name="humidityMin"
                        control={control}
                        rules={{
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid number",
                          },
                        }}
                        render={({ field }) => (
                          <Input className="mt-2" type="number" {...field} />
                        )}
                      />
                      {errors.humidityMin && (
                        <p className="text-red-500">
                          {errors.humidityMin.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="humidityMax">Max</label>
                      <Controller
                        name="humidityMax"
                        control={control}
                        rules={{
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid number",
                          },
                        }}
                        render={({ field }) => (
                          <Input className="mt-2" type="number" {...field} />
                        )}
                      />
                      {errors.humidityMax && (
                        <p className="text-red-500">
                          {errors.humidityMax.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Temperature  */}
                <div className="my-2 mb-4">
                  <h3 className="mb-3">Temperature</h3>
                  <div className="flex w-full justify-between">
                    <div>
                      <label htmlFor="temperatureMin">Min</label>
                      <Controller
                        name="temperatureMin"
                        control={control}
                        rules={{
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid number",
                          },
                        }}
                        render={({ field }) => (
                          <Input className="mt-2" type="number" {...field} />
                        )}
                      />
                      {errors.temperatureMin && (
                        <p className="text-red-500">
                          {errors.temperatureMin.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="temperatureMax">Max</label>
                      <Controller
                        name="temperatureMax"
                        control={control}
                        rules={{
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid number",
                          },
                        }}
                        render={({ field }) => (
                          <Input className="mt-2" type="number" {...field} />
                        )}
                      />
                      {errors.temperatureMax && (
                        <p className="text-red-500">
                          {errors.temperatureMax.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit">Save Data</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MeteorologicalDialogue;

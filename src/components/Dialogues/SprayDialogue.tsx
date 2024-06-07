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
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allData, blocks, treeList, typeofWork } from "@/lib/db";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";

function MeteorologicalDialogue() {
  const [rainfall, setRainfall] = useState();
  const [humidity, setHumidity] = useState({
    min: "",
    max: "",
  });
  const [temperature, setTemperature] = useState({
    min: "",
    max: "",
  });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
    return `${day}.${month}.${year}`;
  }
  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      date: formatDate(new Date()),
      rainfall,
      humidityMin: humidity.min,
      humidityMax: humidity.max,
      temperatureMin: temperature.min,
      temperatureMax: temperature.max,
    };

    // Send HTTP request to the server
    fetch("/api/addMeteorological", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        setOpen(false);
        if (response.ok) {
          console.log("Data saved successfully!");
        } else {
          throw new Error("Failed to save data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <Dialog open={open}>
      <DialogTrigger>
        <Button
          className="flex-center flex gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <div className="">
              <div className="">
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate(new Date())} />
              </div>

              <div className="mt-2">
                <label htmlFor="SL.No.">Rainfall (in mm)</label>
                <Input
                  className="mt-2"
                  value={rainfall}
                  type="number"
                  onChange={(e) => setRainfall(e.target.value)}
                />
              </div>
              {/* Humidity  */}
              <div className="my-2 mb-4">
                <h3 className="mb-3">Humidity</h3>
                <div className="flex w-full justify-between">
                  <div>
                    <label htmlFor="">Min</label>
                    <Input
                      className="mt-2"
                      value={humidity.min}
                      type="number"
                      onChange={(e) =>
                        setHumidity({ ...humidity, min: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="">Max</label>
                    <Input
                      className="mt-2"
                      value={humidity.max}
                      type="number"
                      onChange={(e) =>
                        setHumidity({ ...humidity, max: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Temperature  */}
              <div className="my-2 mb-4">
                <h3 className="mb-3">Temperature</h3>
                <div className="flex w-full justify-between">
                  <div>
                    <label htmlFor="">Min</label>
                    <Input
                      className="mt-2"
                      value={temperature.min}
                      type="number"
                      onChange={(e) =>
                        setTemperature({ ...temperature, min: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="">Max</label>
                    <Input
                      className="mt-2"
                      value={temperature.max}
                      type="number"
                      onChange={(e) =>
                        setTemperature({ ...temperature, max: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MeteorologicalDialogue;

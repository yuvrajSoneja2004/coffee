"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { storeAuthInfo } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const SignIn: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/validateUser", {
        name,
        password,
      });
      if (data?.res) {
        // that means user is successfully authenticated
        dispatch(storeAuthInfo({ name: data?.name, role: data?.role }));
        router.push("/");
      }

      if (!data?.res) {
        toast({
          title: "Please check your name and password.",
        });
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <form
        className="h-auto w-96 rounded-md bg-white px-6 py-7"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name</label>
        <Input
          placeholder="Enter your name."
          id="name"
          className="mb-5 mt-2"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="pass">Password</label>
        <Input
          placeholder="Enter your password."
          id="pass"
          type="password"
          className="mt-2"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mt-6 flex w-full items-center justify-center">
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

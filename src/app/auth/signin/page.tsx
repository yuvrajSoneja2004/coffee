"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { storeAuthInfo } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";

const SignIn: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const [sheetId, setSheetId] = useState<string>("");
  const [currentWorkingStep, setCurrentWorkingStep] = useState<1 | 2>(1);
  const [isShowingLogin, setIsShowingLogin] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (name === "" || password === "" || sheetId === "") {
        alert("Please fill all the fields");
      } else {
        const { data } = await axios.post("/api/linkSheet", {
          name,
          password,
          sheetId,
        });

        console.log("Money heist", data);
        if (data?.res) {
          // Store the JWT token
          localStorage.setItem("token", data.token);
          // that means user is successfully authenticated
          // dispatch(storeAuthInfo({ name: data?.name, role: data?.role }));
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkSheet = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const { data } = await axios.get(`/api/linkSheet?sheetId=${sheetId}`);
      if (data.res) {
        toast({
          title: "Spreadsheet found!",
        });
        setCurrentWorkingStep(2);
      } else {
        toast({
          title: "Spreadsheet not found.",
          description: data.msg,
        });
      }
    } catch (error) {
      toast({
        title: "Error checking spreadsheet.",
        description: "Please try again later.",
      });
    }
  };

  const handleShowLogin = () => {
    setIsShowingLogin(!isShowingLogin);
  };

  const handleLogin = async () => {
    try {
      if (name === "" || password === "") {
        alert("Please enter name and password");
      } else {
        const { data } = await axios.post("/api/userlogin", {
          name,
          password,
        });

        console.log("Money heist season 2", data);
        if (data?.res) {
          // Store the JWT token
          localStorage.setItem("token", data.token);
          // that means user is successfully authenticated
          // dispatch(storeAuthInfo({ name: data?.name, role: data?.role }));
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <form
        className="h-auto w-96 rounded-md bg-white px-6 py-7 shadow-lg"
        onSubmit={currentWorkingStep === 1 ? checkSheet : handleSubmit}
      >
        {isShowingLogin ? (
          <>
            <h1 className="my-2">Login</h1>
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
              <Button onClick={handleLogin}>Login</Button>
            </div>
            <p>
              Don't have an account?{" "}
              <span
                onClick={handleShowLogin}
                className="cursor-pointer text-themePurple"
              >
                Click here
              </span>
              .
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <label htmlFor="">Step {currentWorkingStep} out of 2</label>
            </div>
            {currentWorkingStep === 1 ? (
              <div className="mt-3">
                <p className="my-3">
                  First make a copy of the spreadsheet template by clicking{" "}
                  <a
                    href="https://docs.google.com/spreadsheets/d/1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM/copy"
                    target="_blank"
                    className="text-themePurple"
                  >
                    here
                  </a>
                  .
                </p>

                <label htmlFor="sheetId">Enter SpreadSheetId</label>
                <Input
                  placeholder="Enter ID."
                  id="sheetId"
                  className="mb-5 mt-2"
                  value={sheetId}
                  required
                  onChange={(e) => setSheetId(e.target.value)}
                />
                <Button type="submit">Next</Button>
                <p className="mt-3">
                  Already have an account?{" "}
                  <span
                    onClick={handleShowLogin}
                    className="cursor-pointer text-themePurple"
                  >
                    Click here
                  </span>
                  .
                </p>
              </div>
            ) : (
              <div>
                <h1 className="my-2">Create User</h1>
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
                  <Button type="submit">Create Account</Button>
                </div>
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={handleShowLogin}
                    className="cursor-pointer text-themePurple"
                  >
                    Click here
                  </span>
                  .
                </p>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default SignIn;

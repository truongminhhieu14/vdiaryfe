"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IRegister } from "@/types/auth.type";
import authApi from "@/services/auth.service";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState<IRegister>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Please check password and confirm password");
      return;
    }

    try {
      const res = await authApi.signUp(data);
      if (res.data.success) {
        toast.success(res.data.message || "Đăng ký thành công!");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Đăng ký thất bại!");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error?.response?.data?.message || "Lỗi đăng ký.");
    }
  };

  return (
    <section className="bg-slate-100" id="register">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <img src="/assets/img/signin.gif" alt="login icon" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid">
              <label>Name:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid">
              <label>Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid">
              <label>Password:</label>
              <div className="bg-slate-100 p-2 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter password"
                />
                <div
                  className="cursor-pointer text-xl ml-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid">
              <label>Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  required
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter confirm password"
                />
                <div
                  className="cursor-pointer text-xl ml-2"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-slate-950 hover:bg-slate-800 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
            >
              Register
            </button>
          </form>

          <p className="my-5 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
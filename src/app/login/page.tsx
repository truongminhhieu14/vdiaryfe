"use client";

import { AppContext } from "@/context/app.context";
import authApi from "@/services/auth.service";
import { setUser as setReduxUser } from "@/store/authSlice";
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage, setUserIdToLocalStorage } from "@/utils/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const { setIsAuthenticated, setUser } = useContext(AppContext)
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.signIn(data);
      const dataApi = res.data;
      const userData = dataApi.metadata.user;
      if (dataApi?.success && dataApi?.metadata) {
        toast.success(dataApi.message);    
        setAccessTokenToLocalStorage(dataApi.metadata.accessToken);
        setRefreshTokenToLocalStorage(dataApi.metadata.refreshToken);
        setUserIdToLocalStorage(dataApi.metadata.user.id);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");
        dispatch(setReduxUser(userData));
        setIsAuthenticated(true)
        setUser(userData)
        router.push("/");
      } else {
        toast.error(dataApi.message || "Login failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed (server)";
      toast.error(message);
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4 bg-slate-100">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src="/assets/img/signin.gif" alt="login icon" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email</label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Nhập email"
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="grid">
              <label>Password</label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Nhập password"
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <Link
                href={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot password?
              </Link>
            </div>

            <button className="bg-black hover:bg-slate-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Login
            </button>
          </form>

          <p className="my-5">
            Don't have an account?{" "}
            <Link
              href={"/register"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;

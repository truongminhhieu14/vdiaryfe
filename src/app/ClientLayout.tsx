"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import UserInitializer from "@/components/UserInitializer";
import { AppProvider } from "@/context/app.context";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppProvider>
        <UserInitializer />
        <ToastContainer />
        <Header />
        {children}
      </AppProvider>
    </Provider>
  );
}
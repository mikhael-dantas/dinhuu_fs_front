"use client"
import ToastProvider from "@/context/toast"
import { Provider } from "react-redux"

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  )
}

export default Providers

"use client"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // devLog("ToastProvider render")
  return (
    <>
      <ToastContainer />
      {children}
    </>
  )
}

export default ToastProvider

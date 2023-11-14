// import { Poppins } from "next/font/google"
import "@/assets/styles/app.css"
import Providers from "./Providers"
// import dynamic from "next/dynamic"
// const Providers = dynamic(() => import("./Providers"), { ssr: false })
// export const metadata = {
//   title: "DDC",
//   description: "DDC",
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
      <body className={""} id="root">
        <Providers>{children}</Providers>
        {/* {children} */}
      </body>
    </html>
  )
}

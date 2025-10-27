import type { ReactNode } from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 p-6 bg-gray-50 w-full">{children}</main>
      <Footer />
    </div>
  )
}

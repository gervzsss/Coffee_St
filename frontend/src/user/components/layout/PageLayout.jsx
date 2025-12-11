import { Header, Footer } from "./";

export default function PageLayout({ children, className = "", bgColor = "bg-gray-50" }) {
  return (
    <>
      <Header />
      <main className={`min-h-screen pt-20 ${bgColor} ${className}`}>{children}</main>
      <Footer />
    </>
  );
}

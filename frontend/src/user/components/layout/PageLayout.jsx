import { Header, Footer } from './';

export default function PageLayout({
  children,
  className = '',
  bgColor = 'bg-gray-50',
}) {
  return (
    <>
      <Header />
      <main className={`pt-20 min-h-screen ${bgColor} ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}

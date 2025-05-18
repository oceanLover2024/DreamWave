import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { AuthProvider } from "../context/AuthContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

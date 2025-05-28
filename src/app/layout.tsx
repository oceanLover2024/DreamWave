import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { PhotographerContextProvider } from "../context/PhotographerContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PhotographerContextProvider>
            <Nav />
            {children}
            <Footer />
          </PhotographerContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

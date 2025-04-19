import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthProvider";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import { Header } from "@/app/components/ui/Header";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Book.io - Room Booking System",
  description: "Modern room booking system for campuses and organizations",
  keywords: "room booking, campus rooms, meeting rooms, booking system",
};

function Footer() {
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">Book.io</h3>
            <p className="text-sm text-[var(--muted)]">
              Modern room booking system for campuses and organizations.
              Efficiently manage your spaces and schedules.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-[var(--muted)] hover:text-[var(--primary)]">Home</a></li>
              <li><a href="/buildings" className="text-[var(--muted)] hover:text-[var(--primary)]">Buildings</a></li>
              <li><a href="/rooms" className="text-[var(--muted)] hover:text-[var(--primary)]">Rooms</a></li>
              <li><a href="/bookings" className="text-[var(--muted)] hover:text-[var(--primary)]">Bookings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]">Help Center</a></li>
              <li><a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]">Contact Support</a></li>
              <li><a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]">Privacy Policy</a></li>
              <li><a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-sm text-[var(--muted)]">
          <p>&copy; {new Date().getFullYear()} Book.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                },
                success: {
                  iconTheme: {
                    primary: 'var(--success)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--error)',
                    secondary: 'white',
                  },
                },
              }} 
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

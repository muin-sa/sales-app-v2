import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1E1B4B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "بيت التمكين | منصة عمليات المبيعات",
  description: "نظام إدارة المبيعات لبيت التمكين وفروعها (غزارة للتجارة والتسويق + معين الرقمية التجارية) - مركز الطلبات والجمعيات الخيرية وسندات التبرع",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}

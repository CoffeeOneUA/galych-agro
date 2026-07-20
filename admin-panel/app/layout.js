import "./globals.css";

export const metadata = {
  title: "Галич Агро — адмін-панель",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}

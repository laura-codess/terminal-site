import "./globals.css"

export const metadata = {
  title: "lauras-terminal",
  description: "Laura's Personal Website, in a Terminal Style",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

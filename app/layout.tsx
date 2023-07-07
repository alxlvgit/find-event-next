import { ReduxProvider } from "@/redux/provider";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="w-full h-full font-sans" lang="en">
      <head />
      <body className="h-full w-full overflow-hidden">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

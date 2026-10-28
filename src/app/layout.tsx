import "@/app/globals.css";
export { metadata } from "./metadata";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

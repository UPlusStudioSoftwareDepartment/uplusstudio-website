import PageCurtain from "@/components/studio/PageCurtain";

export default function LocaleTemplate({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PageCurtain />
      {children}
    </>
  );
}

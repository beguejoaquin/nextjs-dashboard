import SideBar from "@/app/store/ui/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex md:flex-row flex-col h-screen md:overflow-hidden">
      <div className="flex-none">
        <SideBar />
      </div>
      <div className="bg-gray-100 grow">{children}</div>
    </div>
  );
}

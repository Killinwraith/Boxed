import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className={"h-full flex w-full flex-col  pt-44px"}>{children}</main>
    </div>
  );
};

export default Layout;

import { Button } from "@/components/ui/button";

const Navbar = () => {
  const NAVBAR_HEIGHT = 44;
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-50 shadow-xl"
        style={{ height: "44px" }}
      >
        <div
          className=" flex justify-between items-centre w-full py-3 px-8 #27272a text-white "
          style={{
            background: "#27272a",
            color: "white",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-centre gap-4 md:gap-6">
            <a
              href="/"
              className="cursor-pointer hover:!text-rgb(255, 255, 255)"
              style={{ color: "White" }}
            >
              <div className="flex items-centre gap-3">
                <img
                  src="/boxedLogo.png"
                  alt="Boxed"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="text-xl bold">
                  Box
                  <span className="text-rgb(237, 70, 70) font-light hover:!text-rgb(255, 255, 255) ">
                    Ed
                  </span>
                </div>
              </div>
            </a>
            <p className="hidden md:block">
              Experience My Attempt at re-creating Google Drive
            </p>
            <div className="flex items-center gap-5 hover:!text-rgb(255, 255, 255)">
              <a
                className="hover:!background-rgb(255, 255, 255)"
                href="/signIn"
              >
                <Button variant={"outline"}>Sign In</Button>
              </a>
              <a href="/signUp">
                <Button variant={"outline"}>Sign Up</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

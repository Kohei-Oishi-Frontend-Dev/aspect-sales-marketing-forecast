import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-18 bg-white shadow-sm mb-4 rounded-b-lg">
      <div className="flex items-center h-full px-4">
        {/* left: logo */}
        <div className="flex-none w-[140px] hidden md:block">
          <Image
            src="/aspect-logo-primary.svg"
            alt="Aspect"
            width={140}
            height={36}
            priority
          />
        </div>

        {/* center: heading */}
        <h1 className="flex-1 text-center text-xl font-bold">
          Aspect Business Management
        </h1>

        {/* right: spacer to balance logo width */}
        <div className="flex-none w-[140px]" />
      </div>
    </nav>
  );
};

export default Navbar;

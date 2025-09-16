import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-18 bg-white shadow-sm mb-4 rounded-b-lg">
      <div className="flex flex-row justify-center items-center h-full px-4">
        {/* left: logo */}
        <div className="hidden md:block md:absolute left-4 top-6">
          <Image
            src="/aspect-logo-primary.svg"
            alt="Aspect"
            width={140}
            height={36}
            priority
          />
        </div>
        {/* center: heading */}
        <h1 className="text-center text-xl font-bold">
          aspect Business Management
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;

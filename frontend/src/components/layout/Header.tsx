import ButtonLink from "@/components/ui/ButtonLink";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-black bg-opacity-50 fixed top-0 left-0 z-50 p-4 border-b-4 border-yellow-400">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-white">NOESIS</h1>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/#home" className="text-white hover:text-yellow-300">
            Home
          </Link>
          <Link href="/#sobre" className="text-white hover:text-yellow-300">
            Sobre
          </Link>
          <Link href="/#contato" className="text-white hover:text-yellow-300">
            Contato
          </Link>

          <ButtonLink href="/login" variant="green" className="!text-xs !p-2">
            Login
          </ButtonLink>
          <ButtonLink href="/signup" variant="blue" className="!text-xs !p-2">
            Sign up
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;

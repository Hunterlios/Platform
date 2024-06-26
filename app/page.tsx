import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 font-mono">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-mono">File Platform</h1>
        <div className="mt-10 flex items-center justify-evenly">
          <Link
            className="bg-white w-[120px] text-center py-2 text-black border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out "
            href={"/login"}
          >
            Zaloguj
          </Link>
          <span className="mx-4">lub</span>
          <Link
            className="bg-white w-[120px] text-center py-2 text-black border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out "
            href={"/register"}
          >
            Zarejestruj
          </Link>
        </div>
      </div>
    </main>
  );
}

import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="py-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <PlayCircle className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-blue-500">GroupApp</h1>
      </div>
      <div className="space-x-4">
        <Link href="/login">
          <Button
            variant="ghost"
            className="flex items-center bg-blue-100 text-gray-300 hover:text-blue-400"
          >
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}

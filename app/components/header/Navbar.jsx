"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "./ModeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Keywords", href: "/keywords" },
  { label: "Domains", href: "/domains" },
  { label: "Autocomplete", href: "/autocomplete" },
  { label: "Popularity", href: "/popularity" },
  { label: "ImageCompress", href: "/image-compression" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="w-full border-b bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="logo">
            🔍
          </span>
          SEO Tools
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground transition"
            >
              {label}
            </Link>
          ))}
          <ModeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer border"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 mt-2">
                <DropdownMenuLabel className="truncate">
                  {session.user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn("google")}>Sign in</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-3 space-y-2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-muted-foreground hover:text-foreground transition"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t">
            {session ? (
              <>
                <span className="block text-sm text-muted-foreground mb-1">
                  Hi, {session.user.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn("google")} className="w-full">
                Sign in
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

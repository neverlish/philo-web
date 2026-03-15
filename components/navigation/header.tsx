// components/navigation/header.tsx
"use client";

import { Search, User, LogOut, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
}

export function Header({ title, showSearch = true, showBack }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-6 sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {title && (
          <h1 className="text-lg font-serif font-medium tracking-wide text-center flex-1">
            {title}
          </h1>
        )}
        <div className="flex items-center gap-2">
          {showSearch && (
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <Search className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-30">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-sm truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            >
              <User className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
        : "MT";

    return (
        <header className="w-full border-b border-neutral-200 bg-white/90 shadow-sm backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => navigate(user ? "/feed" : "/login")}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-xs font-bold text-neutral-950">
                        MT
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                        MiniTweet
                    </span>
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs text-neutral-600 sm:inline">
                            {user.name}
                        </span>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 p-0.5 hover:border-neutral-400"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 text-xs">
                                <DropdownMenuLabel className="text-[11px]">
                                    Signed in as
                                    <br />
                                    <span className="font-medium text-neutral-900">
                                        {user.name}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => navigate("/feed")}
                                >
                                    Feed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-500 focus:text-red-600"
                                    onClick={() => logout.mutate()}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    !isAuthPage && (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-neutral-700"
                                asChild
                            >
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button
                                size="sm"
                                className="rounded-full bg-sky-500 text-xs font-semibold text-white hover:bg-sky-400"
                                asChild
                            >
                                <Link to="/register">Sign up</Link>
                            </Button>
                        </div>
                    )
                )}
            </div>
        </header>
    );
}

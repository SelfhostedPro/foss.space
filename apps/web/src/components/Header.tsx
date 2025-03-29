import { Link } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { useSession } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth/client";
import { HEADER_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const { user, isLoading } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl text-primary">
            {SITE_NAME}
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {HEADER_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="text-muted-foreground hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <Button disabled={isLoading} size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          ) : !isLoading && user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.name || user.email}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>
                      {(
                        user.name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

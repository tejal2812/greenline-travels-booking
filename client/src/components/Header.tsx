import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, User, Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
            <Bus className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">GreenBus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/search") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Search
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            My Bookings
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light">
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/dashboard"
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
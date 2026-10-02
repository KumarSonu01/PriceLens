import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-signal">
          ERROR 404 · OUT OF CATALOG
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text">
          No Price Found.
        </h1>

        <p className="text-muted text-base leading-relaxed">
          The listing or coordinate you navigated to doesn't exist, has expired, or is currently unindexed across our marketplace intelligence feed.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search product catalog..."
              className="w-full bg-surface border border-line rounded-md pl-10 pr-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-signal/80"
            />
          </div>
          <Button type="submit" variant="signal" size="md">
            Search
          </Button>
        </form>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Link to="/">
            <Button variant="secondary" size="sm" icon={Home}>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

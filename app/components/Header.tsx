import {
  CodeBracketIcon,
  LinkIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router";
import { useCopyToClipboard } from "usehooks-ts";

import { Button } from "~/components/catalyst/button";
import GitHub from "./GitHub";
import Twitter from "./Twitter";

export default function Header({
  handleNew,
  handleDemo,
  stars,
}: {
  handleNew: () => void;
  handleDemo: () => void;
  stars: number;
}) {
  const [, copy] = useCopyToClipboard();

  const handleCopyURL = () => {
    if (typeof document !== "undefined") {
      copy(window.location.href);
    }
  };

  const handleOpenAPI = () => {
    if (typeof document !== "undefined") {
      const currentUrl = new URL(window.location.href);
      currentUrl.pathname = `api`;
      window.open(currentUrl.toString(), "_blank");
    }
  };

  return (
    <header className="fixed z-40 inset-0 bottom-auto bg-white/90 backdrop-blur-lg border-b border-first-100">
      <div className="container mx-auto px-4 flex items-center justify-between h-header">
        <Link
          to="/"
          className="flex flex-col lg:flex-row lg:items-center lg:gap-2"
        >
          <>
            <span className="font-bold text-first-600 text-sm md:text-lg font-mono">
              tints.dev
            </span>
            <span className="font-medium text-first-300 hidden md:block text-xs lg:text-sm">
              Palette Generator + API for Tailwind CSS
            </span>
          </>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {stars ? (
            <span className="flex items-center gap-1 font-bold text-yellow-600 text-sm">
              <StarIcon className="size-4" />
              {stars} <span className="sr-only">Stars on GitHub</span>
            </span>
          ) : null}
          <Button outline href="https://github.com/SimeonGriggs/tints.dev">
            <GitHub className="size-4" />
            <span className="sr-only">Star on GitHub</span>
          </Button>
          <Button outline href="https://x.com/simeonGriggs">
            <Twitter className="size-4" />
            <span className="sr-only">Follow me on Twitter</span>
          </Button>
          <Button outline onClick={handleCopyURL}>
            <LinkIcon className="size-4" />
            <span className="sr-only">Copy URL</span>
          </Button>
          <Button outline onClick={handleOpenAPI}>
            <CodeBracketIcon className="size-4" />
            <span className="sr-only">API</span>
          </Button>
          <Button id="demo-button" onClick={handleDemo}>
            <SparklesIcon className="size-4" />
            <span className="sr-only md:not-sr-only">Demo</span>
          </Button>
          <Button id="add-button" onClick={handleNew}>
            <PlusIcon className="size-4" />
            <span className="sr-only md:not-sr-only">Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

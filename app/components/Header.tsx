import {CodeBracketIcon, LinkIcon, PlusIcon, SparklesIcon} from '@heroicons/react/24/outline'
import {StarIcon} from '@heroicons/react/24/solid'
import {Link} from '@remix-run/react'
import {useCopyToClipboard} from 'usehooks-ts'

import ButtonIcon from '~/components/ButtonIcon'

import Button from './Button'
import GitHub from './GitHub'
import Twitter from './Twitter'

export default function Header({
  handleNew,
  handleDemo,
  stars,
}: {
  handleNew: Function
  handleDemo: Function
  stars: number
}) {
  const [, copy] = useCopyToClipboard()

  const handleCopyURL = () => {
    if (typeof document !== 'undefined') {
      copy(window.location.href)
    }
  }

  const handleOpenAPI = () => {
    if (typeof document !== 'undefined') {
      const currentUrl = new URL(window.location.href)
      currentUrl.pathname = `api`
      window.open(currentUrl.toString(), '_blank')
    }
  }

  return (
    <header className="fixed z-40 inset-0 bottom-auto bg-white/90 backdrop-blur-lg border-b border-first-100">
      <div className="container mx-auto px-4 flex items-center justify-between h-header">
        <Link to="/" className="flex items-center gap-2">
          <>
            <span className="font-bold text-first-600 text-sm md:text-lg font-mono">tints.dev</span>
            <span className="font-medium text-first-300 hidden md:block text-sm">
              Palette Generator + API for Tailwind CSS
            </span>
          </>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {stars ? (
            <span className="flex items-center gap-1 font-bold text-yellow-600 text-sm">
              <StarIcon className="w-4 h-auto" />
              {stars} <span className="sr-only">Stars on GitHub</span>
            </span>
          ) : null}
          <ButtonIcon
            title="Open Project on GitHub"
            icon={GitHub}
            href="https://github.com/SimeonGriggs/tints.dev"
          />
          <ButtonIcon
            title="Say hello on Twitter"
            icon={Twitter}
            href="https://twitter.com/simeonGriggs"
          />
          <ButtonIcon title="Copy URL" icon={LinkIcon} onClick={handleCopyURL} />
          <ButtonIcon title="Open API Link" icon={CodeBracketIcon} onClick={handleOpenAPI} />
          <Button id="demo-button" onClick={handleDemo}>
            <SparklesIcon className="w-4 h-auto" />
            <span className="sr-only md:not-sr-only">Demo</span>
          </Button>
          <Button id="add-button" onClick={handleNew}>
            <PlusIcon className="w-4 h-auto" />
            <span className="sr-only md:not-sr-only">Add</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

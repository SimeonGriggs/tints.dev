import clsx from 'clsx'
import React from 'react'

export default function Button({
  id,
  onClick,
  children,
  square,
}: {
  id: string
  onClick: () => void
  children: React.ReactNode
  square?: boolean
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={clsx(
        `rounded-full bg-first-500 hover:scale-105 hover:bg-first-600 transition-all duration-200 text-white text-sm leading-none font-bold flex items-center gap-1`,
        square ? `p-2 md:p-3` : `py-2 px-4 md:pl-3 md:pr-4 `
      )}
    >
      {children}
    </button>
  )
}

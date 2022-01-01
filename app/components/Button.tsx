import React from 'react'

export default function Button({
  id,
  onClick,
  children,
}: {
  id: string
  onClick: Function
  children: React.ReactNode
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className="rounded-full bg-first-500 hover:scale-105 hover:bg-first-600 transition-all duration-200 text-white py-2 px-2 md:pl-3 md:pr-4 text-sm leading-none font-bold flex items-center gap-1"
    >
      {children}
    </button>
  )
}

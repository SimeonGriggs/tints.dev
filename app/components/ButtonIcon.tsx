import React from "react";
import { usePopperTooltip } from "react-popper-tooltip";

const classNames = `border p-2.5 transition-colors duration-200 rounded-sm`;
const disabledClassNames = `bg-gray-100 border-gray-200 text-gray-200 cursor-not-allowed pointer-events-none`;
const toneClassNames = {
  danger: `border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-100`,
  success: `border-gray-200 text-gray-400 hover:text-green-500 hover:border-green-500 hover:bg-green-100`,
};
const selectedClassNames = {
  danger: `text-red-500 border-red-500 bg-red-100`,
  success: `text-green-500 border-green-500 bg-green-100`,
};
const toneTooltipClassNames = {
  danger: `text-red-700`,
  success: `text-green-700`,
};

export default function ButtonIcon({
  title,
  onClick,
  icon,
  href = ``,
  testId = ``,
  disabled = false,
  selected = false,
  tone = "success",
  tabIndex = -1,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  testId?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  tone?: "danger" | "success";
  tabIndex?: number;
}) {
  const className = [
    disabled ? disabledClassNames : toneClassNames[tone],
    selected ? selectedClassNames[tone] : ``,
    classNames,
  ]
    .filter(Boolean)
    .join(" ");

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  const Icon = icon;

  if (href) {
    return (
      <a
        data-test={testId}
        href={href}
        className={className}
        tabIndex={tabIndex}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
      >
        <>
          <Icon className="w-5 h-auto" />
          <span className="sr-only">{title}</span>
        </>
      </a>
    );
  }

  return (
    <>
      <button
        data-test={testId}
        ref={setTriggerRef}
        type="button"
        className={className}
        onClick={onClick}
        disabled={disabled}
        tabIndex={tabIndex}
      >
        <Icon className="w-5 h-auto" />
        <span className="sr-only">{title}</span>
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `w-32 text-center z-50 bg-white p-2 rounded-sm shadow-sm text-xs font-medium ${toneTooltipClassNames[tone]}`,
          })}
        >
          <div
            {...getArrowProps({
              className: `absolute bottom-full bg-white h-2 w-4 pointer-events-none`,
              style: { clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)` },
            })}
          />
          {title}
        </div>
      )}
    </>
  );
}

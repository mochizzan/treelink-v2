type CoffeeMugProps = {
  className?: string
}

/**
 * The support CTA's mark. The three steam wisps drift on a slow loop; the
 * pill owns the shine and sparkle so this stays a quiet, reusable icon.
 */
export function CoffeeMug({ className }: CoffeeMugProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="steam steam--1"
        d="M7.5 3.5C7.5 4.8 6.5 5.3 6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        className="steam steam--2"
        d="M11 2.8C11 4.1 10 4.6 10 5.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        className="steam steam--3"
        d="M14.5 3.5C14.5 4.8 13.5 5.3 13.5 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4.5 9H16.5V14.5C16.5 17.5376 14.0376 20 11 20H10C6.96243 20 4.5 17.5376 4.5 14.5V9Z"
        fill="currentColor"
      />
      <path
        d="M16.5 10.5H18.2C19.6359 10.5 20.8 11.6641 20.8 13.1C20.8 14.5359 19.6359 15.7 18.2 15.7H16.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Icon({ children, label }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function PlusIcon() {
  return (
    <Icon>
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </Icon>
  )
}

export function FilterIcon() {
  return (
    <Icon>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </Icon>
  )
}

export function CheckIcon() {
  return (
    <Icon>
      <path
        d="M5 12.5 10 17.5 19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </Icon>
  )
}

export function TrashIcon() {
  return (
    <Icon>
      <path
        d="M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </Icon>
  )
}

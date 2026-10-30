function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d={path} />
    </svg>
  )
}

export function PlusIcon() {
  return <Icon path="M12 5v14M5 12h14" />
}

export function FilterIcon() {
  return <Icon path="M4 6h16M7 12h10M10 18h4" />
}

export function CheckIcon() {
  return <Icon path="M5 12.5 10 17.5 19 7" />
}

export function TrashIcon() {
  return <Icon path="M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13" />
}

export function SunIcon() {
  return (
    <Icon path="M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  )
}

export function MoonIcon() {
  return <Icon path="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
}

export function EyeIcon() {
  return (
    <Icon path="M2 12c2.2-3.6 5.2-5.5 10-5.5S19.8 8.4 22 12c-2.2 3.6-5.2 5.5-10 5.5S4.2 15.6 2 12zM12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
  )
}

export function EyeOffIcon() {
  return (
    <Icon path="M4 4l16 16M9.5 9.7A3.2 3.2 0 0 0 12 15.2M14.6 14.5A3.2 3.2 0 0 0 12 8.8M6.1 6.6C4.2 8 2.8 9.9 2 12c2.2 3.6 5.2 5.5 10 5.5 1.6 0 3-.3 4.3-.9M10.4 6.7C10.9 6.6 11.4 6.5 12 6.5c4.8 0 7.8 1.9 10 5.5-.7 1.2-1.6 2.3-2.7 3.2" />
  )
}

export function GlobeIcon() {
  return (
    <Icon path="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9s1.3-6.5 3.8-9z" />
  )
}

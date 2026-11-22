type SiteFooterProps = {
  name: string
  year: number
}

export function SiteFooter({ name, year }: SiteFooterProps) {
  return (
    <footer className="footer pt-4 text-foreground-muted text-sm leading-[1.4] text-center">
      © {year} {name}
    </footer>
  )
}

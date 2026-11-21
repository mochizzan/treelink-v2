type SiteFooterProps = {
  name: string
  year: number
}

export function SiteFooter({ name, year }: SiteFooterProps) {
  return (
    <footer className="footer">
      © {year} {name}
    </footer>
  )
}

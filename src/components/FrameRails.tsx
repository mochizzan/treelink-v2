export function FrameRails() {
  return (
    <div className="frame absolute inset-0 z-20 pointer-events-none translate-x-[calc(var(--parallax-x,0px)*-0.35)] translate-y-[calc(var(--parallax-y,0px)*-0.35)] will-change-[transform]" aria-hidden="true">
      <span className="frame__rail frame__rail--top absolute bg-foreground opacity-[0.72] top-5 sm:top-11 lg:top-16 right-0 left-0 h-[2px]" />
      <span className="frame__rail frame__rail--bottom absolute bg-foreground opacity-[0.72] bottom-5 sm:bottom-11 lg:bottom-16 left-0 right-0 h-[2px]" />
      <span className="frame__rail frame__rail--left absolute bg-foreground opacity-[0.72] top-0 bottom-0 left-5 sm:left-11 lg:left-16 w-[2px]" />
      <span className="frame__rail frame__rail--right absolute bg-foreground opacity-[0.72] top-0 right-5 sm:right-11 lg:right-16 bottom-0 w-[2px]" />
    </div>
  )
}

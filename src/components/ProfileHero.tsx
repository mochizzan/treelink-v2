import type { Profile } from '../data/site'
import { PortraitAvatar } from './PortraitAvatar'

type ProfileHeroProps = {
  profile: Profile
  onAbout: () => void
}

export function ProfileHero({ profile, onAbout }: ProfileHeroProps) {
  return (
    <header className="flex flex-col items-center">
      <span className="hero__stem w-[2px] h-9 bg-foreground opacity-[0.72]" aria-hidden="true" />
      <button
        type="button"
        className="avatar block w-[104px] h-[104px] p-1 border-2 border-solid border-foreground rounded-full bg-surface transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-y-[-3px] hover:rotate-[1.5deg] hover:scale-[1.03] active:scale-[0.97]"
        onClick={onAbout}
        aria-label={`Buka kartu profil ${profile.name}`}
        aria-haspopup="dialog"
      >
        <PortraitAvatar />
      </button>
      <h1 className="hero__name mt-5 text-[clamp(2.5rem,5.2vw,4.75rem)] font-[900] leading-none tracking-[-0.045em]">{profile.name}</h1>
      <p className="hero__role mt-3.5 text-lg font-bold leading-[1.35]">{profile.role}</p>
      <p className="hero__bio max-w-[50ch] mt-3 text-lg leading-[1.5] text-foreground-muted">{profile.bio}</p>
    </header>
  )
}

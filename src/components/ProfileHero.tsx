import type { Profile } from '../data/site'
import { PortraitAvatar } from './PortraitAvatar'

type ProfileHeroProps = {
  profile: Profile
  onAbout: () => void
}

export function ProfileHero({ profile, onAbout }: ProfileHeroProps) {
  return (
    <header className="hero">
      <span className="hero__stem" aria-hidden="true" />
      <button
        type="button"
        className="avatar"
        onClick={onAbout}
        aria-label={`Buka kartu profil ${profile.name}`}
        aria-haspopup="dialog"
      >
        <PortraitAvatar />
      </button>
      <h1 className="hero__name">{profile.name}</h1>
      <p className="hero__role">{profile.role}</p>
      <p className="hero__bio">{profile.bio}</p>
    </header>
  )
}

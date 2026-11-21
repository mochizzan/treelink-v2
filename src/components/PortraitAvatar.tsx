import portraitUrl from '../assets/moch-izzan.jpg'

/**
 * The profile portrait, cropped square in the asset. The avatar frame masks
 * it to a circle, so the same image works at both the hero and card sizes.
 */
export function PortraitAvatar() {
  return (
    <img
      className="avatar-photo"
      src={portraitUrl}
      alt=""
      width="560"
      height="560"
      decoding="async"
    />
  )
}

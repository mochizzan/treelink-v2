export type SocialLink = {
  id: 'discord' | 'tiktok' | 'github'
  name: string
  label: string
  handle: string
  href: string
  description: string
  ariaLabel: string
}

export const profile = {
  name: 'Moch Izzan',
  role: 'Streamer Gabut & Software Engineer',
  bio: 'Ngoding di siang hari, live pas malam. Kadang bahas kode, kadang cuma gabut bareng.',
  about:
    'Streamer gabut dan software engineer. Ngoding di siang hari, live pas malam. Di Discord biasanya mabar dan ngobrol soal kode; di TikTok lebih sering potongan live dan hal random.',
} as const

export const socials: SocialLink[] = [
  {
    id: 'discord',
    name: 'Discord',
    label: 'discord',
    handle: 'discord.gg/2MrwTkZJZC',
    href: 'https://discord.gg/2MrwTkZJZC',
    description: 'Mabar dan ngobrol soal kode di server Discord.',
    ariaLabel: 'Buka pilihan tautan Discord Moch Izzan',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    label: 'tiktok',
    handle: '@moch.izzan',
    href: 'https://www.tiktok.com/@moch.izzan',
    description: 'Potongan live dan hal random di TikTok.',
    ariaLabel: 'Buka pilihan tautan TikTok Moch Izzan',
  },
  {
    id: 'github',
    name: 'GitHub',
    label: 'github',
    handle: 'github.com/mochizzan',
    href: 'https://github.com/mochizzan?tab=repositories',
    description: 'Repositori dan proyek kode di GitHub.',
    ariaLabel: 'Buka pilihan tautan GitHub Moch Izzan',
  },
]

export const support = {
  href: 'https://tipmi.gg/mochizzan',
  label: 'Traktir kopi',
  ariaLabel: 'Traktir kopi lewat Tipmi di tab baru',
} as const

export type Profile = typeof profile
export type Support = typeof support

export const siteYear = 2026

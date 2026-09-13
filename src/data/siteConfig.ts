export interface SocialLink {
  name: string;
  url: string;
}

export interface SiteConfig {
  brandFirstName: string;
  brandLastName: string;
  monogram: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  whatsappLink: string;
  telegramHandle: string;
  telegramDisplay: string;
  telegramLink: string;
  email: string;
  emailLink: string;
  github: string;
  turnstileSiteKey: string;
  socials: SocialLink[];
}

export const siteConfig: SiteConfig = {
  brandFirstName: 'ALHASSAN',
  brandLastName: 'MOHAMED',
  monogram: 'AM',
  phoneDisplay: '+20 107 047 1954',
  phoneE164: '+201070471954',
  whatsappNumber: '201070471954',
  whatsappLink:
    'https://wa.me/201070471954?text=Hello%20Alhassan,%20I%20would%20like%20to%20discuss%20a%20project',
  telegramHandle: '@salama_83_77',
  telegramDisplay: '@salama_83_77 / +20 107 047 1954',
  telegramLink: 'https://t.me/+201070471954',
  email: 'sm4603097@gmail.com',
  emailLink: 'mailto:sm4603097@gmail.com',
  github: 'https://github.com/sm4603097-cmyk',
  turnstileSiteKey: '0x4AAAAAAExS4vnlmaeqF8pQ',
  socials: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1EnkoF1EQn/?mibextid=wwXIfr',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/sa_la_ma_83_77?stkn=MWh1ZTEzdWtlYXo2OA%3D%3D&utm_source=qr',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@salama_83_77?_r=1&_t=ZS-99dvDws4Pah',
    },
    {
      name: 'Telegram',
      url: 'https://t.me/+201070471954',
    },
  ],
};
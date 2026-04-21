export const autoPrefixHref = (href: string) => {
  if (/^(https?|tel|mailto|viber|tg):/i.test(href)) {
    return href;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href);

  if (isEmail) {
    return `mailto:${href}`;
  }

  const isPhone = /^[\d\s\+\-\(\)]{7,20}$/.test(href);

  if (isPhone) {
    const cleanPhone = href.replace(/[\s\-\(\)]/g, "");

    return `tel:${cleanPhone}`;
  }

  return href;
};

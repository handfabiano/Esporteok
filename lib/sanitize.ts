import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza HTML para prevenir ataques XSS
 * Remove tags e atributos perigosos mantendo apenas formatação básica
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}

/**
 * Converte texto simples em HTML seguro
 * Converte quebras de linha em <br /> e escapa HTML perigoso
 */
export function textToSafeHtml(text: string): string {
  // Primeiro escapa qualquer HTML existente
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Depois converte quebras de linha em <br />
  return escaped.replace(/\n/g, '<br />')
}

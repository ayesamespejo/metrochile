import React, { useMemo } from 'react';
import { Linking, StyleSheet, View, useWindowDimensions } from 'react-native';
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html';
import Globals from '../../Globals';

const SYSTEM_FONTS = [
  ...defaultSystemFonts,
  'GothamRounded-Bold',
  'GothamRounded-Medium',
  'GothamRounded-Book',
  'GothamRounded-Light',
];

const ENTITY_MAP = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  '#34': '"',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  bull: '•',
  copy: '©',
  reg: '®',
  trade: '™',
  euro: '€',
  pound: '£',
};

export function normalizeHtml(input) {
  let html = String(input ?? '');

  if (!html.trim()) {
    return '';
  }

  html = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(html|head|body|meta|link|iframe|object|embed|form|input|button|textarea|select)[^>]*>/gi, '');

  html = html
    .replace(/<\/p>/gi, '<br/>')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/div>/gi, '<br/>')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, '<b>$2</b><br/>')
    .replace(/<\/li>/gi, '<br/>')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '')
    .replace(/<\/?blockquote[^>]*>/gi, '')
    .replace(/<hr\s*\/?>/gi, '<br/>———<br/>')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/<\/?center[^>]*>/gi, '')
    .replace(/<\/?section[^>]*>/gi, '')
    .replace(/<\/?article[^>]*>/gi, '')
    .replace(/<\/?header[^>]*>/gi, '')
    .replace(/<\/?footer[^>]*>/gi, '')
    .replace(/<\/?nav[^>]*>/gi, '')
    .replace(/<\/?main[^>]*>/gi, '')
    .replace(/<\/?figure[^>]*>/gi, '')
    .replace(/<\/?figcaption[^>]*>/gi, '')
    .replace(/<\/?pre[^>]*>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<\/?table[^>]*>/gi, '')
    .replace(/<\/?thead[^>]*>/gi, '')
    .replace(/<\/?tbody[^>]*>/gi, '')
    .replace(/<\/?tfoot[^>]*>/gi, '')
    .replace(/<\/?tr[^>]*>/gi, '<br/>')
    .replace(/<\/?th[^>]*>/gi, ' ')
    .replace(/<\/?td[^>]*>/gi, ' ');

  html = html
    .replace(/<br\s*\/?>/gi, '<br/>')
    .replace(/(?:<br\/>\s*){3,}/gi, '<br/><br/>');

  html = decodeHtmlEntities(html);

  html = html
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html.replace(/\n/g, '<br/>');
  }

  return html;
}

export function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/?[^>]+>/g, ''),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function decodeHtmlEntities(text) {
  return String(text || '')
    .replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g, (match, entity) => {
      const key = entity.toLowerCase();
      if (ENTITY_MAP[key] !== undefined) {
        return ENTITY_MAP[key];
      }
      if (ENTITY_MAP[entity] !== undefined) {
        return ENTITY_MAP[entity];
      }
      if (/^#x[0-9a-f]+$/i.test(entity)) {
        return String.fromCodePoint(parseInt(entity.slice(2), 16));
      }
      if (/^#\d+$/.test(entity)) {
        return String.fromCodePoint(parseInt(entity.slice(1), 10));
      }
      return match;
    });
}

const tagsStyles = {
  body: {
    color: '#000000',
    margin: 0,
    padding: 0,
  },
  p: {
    marginTop: 0,
    marginBottom: 6,
  },
  b: {
    fontWeight: '700',
  },
  strong: {
    fontWeight: '700',
  },
  i: {
    fontStyle: 'italic',
  },
  em: {
    fontStyle: 'italic',
  },
  u: {
    textDecorationLine: 'underline',
  },
  s: {
    textDecorationLine: 'line-through',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  del: {
    textDecorationLine: 'line-through',
  },
  a: {
    color: Globals.COLOR.ROJO_METRO || '#C8102E',
    textDecorationLine: 'underline',
  },
  small: {
    fontSize: 13,
  },
  big: {
    fontSize: 18,
  },
  mark: {
    backgroundColor: '#FFF3A3',
  },
  code: {
    fontFamily: PlatformSelectMono(),
    backgroundColor: '#F2F2F2',
  },
  pre: {
    fontFamily: PlatformSelectMono(),
    backgroundColor: '#F2F2F2',
  },
  h1: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  h4: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  h5: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  h6: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  ul: {
    marginTop: 4,
    marginBottom: 4,
    paddingLeft: 12,
  },
  ol: {
    marginTop: 4,
    marginBottom: 4,
    paddingLeft: 12,
  },
  li: {
    marginBottom: 2,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: Globals.COLOR.GRIS_3 || '#AFB2BA',
    paddingLeft: 8,
    marginVertical: 4,
    color: Globals.COLOR.GRIS_4 || '#43464E',
  },
  br: {
    height: 0,
  },
};

function PlatformSelectMono() {
  return 'monospace';
}

/**
 * Renderiza HTML completo de alertas Firebase/Transapp.
 * Usa react-native-render-html + normalización previa.
 */
export function HtmlText({ html, style, numberOfLines }) {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.max(windowWidth - 140, 200);

  const source = useMemo(() => {
    const normalized = normalizeHtml(html);
    return { html: normalized || ' ' };
  }, [html]);

  const baseStyle = useMemo(() => {
    const flat = StyleSheet.flatten(style) || {};
    return {
      color: flat.color || '#000000',
      fontSize: flat.fontSize || 16,
      lineHeight: flat.lineHeight || Math.round((flat.fontSize || 16) * 1.35),
      fontFamily: flat.fontFamily,
      fontWeight: flat.fontWeight,
      margin: 0,
      padding: 0,
    };
  }, [style]);

  if (!String(html || '').trim()) {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <RenderHTML
        contentWidth={contentWidth}
        source={source}
        baseStyle={baseStyle}
        tagsStyles={tagsStyles}
        systemFonts={SYSTEM_FONTS}
        defaultTextProps={{
          numberOfLines,
          selectable: false,
        }}
        renderersProps={{
          a: {
            onPress: (_event, href) => {
              if (href) {
                Linking.openURL(href).catch(() => {});
              }
            },
          },
        }}
        ignoredDomTags={[
          'script',
          'style',
          'iframe',
          'object',
          'embed',
          'form',
          'input',
          'button',
          'textarea',
          'select',
          'svg',
          'canvas',
          'video',
          'audio',
        ]}
        enableExperimentalBRCollapsing
        enableExperimentalGhostLinesPrevention
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
});
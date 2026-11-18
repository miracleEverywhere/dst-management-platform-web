import DOMPurify from 'dompurify'

// 允许出现在描述类富文本里的标签：只保留 bbcode 解析器可能产出的排版标签。
// script / iframe / style / form / input 等一律不在白名单内。
const ALLOWED_TAGS = [
  'a',
  'b',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'u',
  'ul',
]

// 允许的属性：事件属性（onerror、onclick 等）不在白名单内，会被直接剔除。
const ALLOWED_ATTR = ['alt', 'href', 'src', 'style', 'title']

// Markdown 报告（AI 生成）比 bbcode 描述多出表格、引用块、分割线等结构，
// 单独维护一份白名单，避免复用上面那份时把报告的表格和引用块整块丢掉。
const MARKDOWN_TAGS = [
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'dd',
  'del',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'kbd',
  'li',
  'mark',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
]

// class 用于 md-editor-v3 的代码高亮类名，id 用于标题锚点；colspan/rowspan 用于表格合并。
const MARKDOWN_ATTR = ['align', 'alt', 'class', 'colspan', 'href', 'id', 'rowspan', 'src', 'style', 'title']

// [color=...] / [size=...] 会生成 style 属性。DOMPurify 默认不限制 CSS，
// 而 background-image:url(...) 之类会让浏览器向外部发起请求（可用于追踪管理员 IP），
// 因此这里只保留无副作用的纯色/字号类内联样式。
const ALLOWED_STYLE_PROPS = [
  'background-color', 'color', 'font-size', 'font-style', 'font-weight', 'text-align', 'text-decoration',
]

const DANGEROUS_STYLE_VALUE = /(?:url|expression|image-set|element|var|attr)\s*\(/i

DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName !== 'style') return

  data.attrValue = String(data.attrValue)
    .split(';')
    .map(declaration => declaration.trim())
    .filter(Boolean)
    .filter(declaration => {
      const separator = declaration.indexOf(':')
      if (separator === -1) return false

      const property = declaration.slice(0, separator).trim().toLowerCase()
      const value = declaration.slice(separator + 1).trim()

      return ALLOWED_STYLE_PROPS.includes(property) && !DANGEROUS_STYLE_VALUE.test(value)
    })
    .join('; ')
})

/**
 * 净化不可信 HTML，供 v-html 渲染使用。
 *
 * DOMPurify 会额外处理属性值里的危险内容：
 * - href / src 中的 javascript:、data:text/html 等协议会被移除；
 * - 配合上面的 hook，style 中只保留安全的内联样式声明。
 *
 * @param {String} html 不可信的 HTML 字符串
 * @returns {String} 净化后的 HTML
 */
export const sanitizeHtml = html => DOMPurify.sanitize(html ?? '', {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
})

/**
 * 净化 Markdown 渲染后的 HTML，供 MdPreview 的 sanitize 属性使用。
 *
 * MdPreview 的 sanitize 默认是恒等函数，而它内部用 markdown-it 的 html: true 解析，
 * 因此不可信的 Markdown（例如模型生成的诊断报告）会把原始 HTML 直接写进 DOM。
 *
 * @param {String} html markdown-it 渲染出的 HTML
 * @returns {String} 净化后的 HTML
 */
export const sanitizeMarkdown = html => DOMPurify.sanitize(html ?? '', {
  ALLOWED_TAGS: MARKDOWN_TAGS,
  ALLOWED_ATTR: MARKDOWN_ATTR,
})

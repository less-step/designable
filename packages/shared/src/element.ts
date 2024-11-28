import { Point } from './coordinate'

const InlineLayoutTagNames = new Set([
	'A',
	'ABBR',
	'ACRONYM',
	'AUDIO',
	'B',
	'BDI',
	'BDO',
	'BIG',
	'BR',
	'BUTTON',
	'CANVAS',
	'CITE',
	'CODE',
	'DATA',
	'DATALIST',
	'DEL',
	'DFN',
	'EM',
	'EMBED',
	'I',
	'IFRAME',
	'IMG',
	'INS',
	'KBD',
	'LABEL',
	'MAP',
	'MARK',
	'METER',
	'NOSCRIPT',
	'OBJECT',
	'OUTPUT',
	'PICTURE',
	'PROGRESS',
	'Q',
	'RUBY',
	'S',
	'SAMP',
	'SELECT',
	'SLOT',
	'SMALL',
	'STRONG',
	'SUB',
	'SUP',
	'SVG',
	'TEMPLATE',
	'TEXTAREA',
	'TIME',
	'U',
	'TT',
	'VAR',
	'VIDEO',
	'WBR',
	'INPUT',
	'SPAN',
])

/**
 *
 * @param innerWidth 内部宽度
 * @param style 样式
 * @returns 计算得到一个元素的外部宽度（内部宽度加上边框，内边距和外边距）
 */
export const calcElementOuterWidth = (innerWidth: number, style: CSSStyleDeclaration) => {
	return (
		innerWidth +
		parseFloat(style.marginLeft) +
		parseFloat(style.marginRight) +
		parseFloat(style.paddingLeft) +
		parseFloat(style.paddingRight) +
		parseFloat(style.borderLeftWidth) +
		parseFloat(style.borderRightWidth)
	)
}

/**
 *
 * @param element HTML元素
 * @returns 判断元素是水平还是垂直
 */
export const calcElementLayout = (element: Element) => {
	//如果元素不存在默认就是行元素
	if (!element) return 'vertical'
	const parent = element.parentElement
	//没有父元素那默认就是行元素
	if (!parent) return 'vertical'
	const tagName = element.tagName
	const parentTagName = parent.tagName
	const style = getComputedStyle(element)
	const parentStyle = getComputedStyle(parent)

	/**
	 *
	 * @returns 判断元素是否占满了父元素
	 */
	const isNotFullWidth = () => {
		const innerWidth = element.getBoundingClientRect().width
		const outerWidth = calcElementOuterWidth(innerWidth, style)
		const parentInnerWidth = parent.getBoundingClientRect().width
		return outerWidth.toFixed(0) < parentInnerWidth.toFixed(0)
	}
	if (tagName === 'TH' || tagName === 'TD') {
		if (parentTagName === 'TR') return 'horizontal'
	}
	if (parentStyle.display === 'flex' && parentStyle.flexDirection === 'row') return 'horizontal'
	if (parentStyle.display === 'grid') {
		if (isNotFullWidth()) {
			return 'horizontal'
		}
	}
	if (InlineLayoutTagNames.has(tagName)) {
		if (style.display === 'block') {
			if (style.float === 'left' || style.float === 'right') {
				if (isNotFullWidth()) {
					return 'horizontal'
				}
			}
			return 'vertical'
		}
		return 'horizontal'
	}
}

/**
 *
 * @param element HTML元素
 * @returns 返回元素的偏移量值，如果有transform用transform值，如果没有就用offsetLeft和offsetTop
 */
export const calcElementTranslate = (element: HTMLElement) => {
	const transform = element?.style?.transform
	if (transform) {
		const [x, y] = transform.match(/translate(?:3d)?\(\s*([-\d.]+)[a-z]+?[\s,]+([-\d.]+)[a-z]+?(?:[\s,]+([-\d.]+))?[a-z]+?\s*\)/)?.slice(1, 3) ?? [0, 0]
		return new Point(Number(x), Number(y))
	} else {
		return new Point(Number(element.offsetLeft), Number(element.offsetTop))
	}
}

/**
 *
 * @param element HTML元素
 * @returns 计算元素的旋转值
 */
export const calcElementRotate = (element: HTMLElement) => {
	const transform = element?.style?.transform
	if (transform) {
		return Number(transform.match(/rotate\(\s*([-\d.]+)/)?.[1] ?? 0)
	} else {
		return 0
	}
}

/**
 *
 * @param element HTML元素
 * @returns 计算元素的缩放值
 */
export const calcElementScale = (element: HTMLElement) => {
	const transform = element?.style?.transform
	if (transform) {
		return Number(transform.match(/scale\(\s*([-\d.]+)/)?.[1] ?? 0)
	} else {
		return 0
	}
}

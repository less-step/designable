import { isValidNumber } from './types'

export interface IPoint {
	x: number
	y: number
}

export interface ISize {
	width: number
	height: number
}

export interface ILineSegment {
	start: IPoint
	end: IPoint
}

export interface IRectEdgeLines {
	v: ILineSegment[]
	h: ILineSegment[]
}

export interface IRect {
	x: number
	y: number
	width: number
	height: number
	toJSON: () => string
}

/**
 *
 * @param rect 判断是否是Rect的对象
 * @returns 是否为rect的结果
 *
 * 判断逻辑是rect是否有x,y,width,height这几个属性
 */
export function isRect(rect: any): rect is IRect {
	return isValidNumber(rect?.x) && isValidNumber(rect?.y) && isValidNumber(rect?.width) && isValidNumber(rect?.height)
}

export function isPoint(val: any): val is IPoint {
	return isValidNumber(val?.x) && isValidNumber(val?.y)
}

export function isLineSegment(val: any): val is ILineSegment {
	return isPoint(val?.start) && isPoint(val?.end)
}

export class Point implements IPoint {
	x: number
	y: number
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}

export class Rect implements IRect {
	x = 0
	y = 0
	width = 0
	height = 0
	toJSON() {
		return JSON.stringify(this)
	}
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	get left() {
		return this.x
	}

	get right() {
		return this.x + this.width
	}

	get top() {
		return this.y
	}

	get bottom() {
		return this.y + this.height
	}
}

export class LineSegment {
	start: IPoint
	end: IPoint
	constructor(start: IPoint, end: IPoint) {
		this.start = { ...start }
		this.end = { ...end }
	}
}

export enum RectQuadrant {
	Inner1 = 'I1', //内部第一象限
	Inner2 = 'I2', //内部第二象限
	Inner3 = 'I3', //内部第三象限
	Inner4 = 'I4', //内部第四象限
	Outer1 = 'O1', //内部第五象限
	Outer2 = 'O2', //内部第六象限
	Outer3 = 'O3', //内部第七象限
	Outer4 = 'O4', //内部第八象限
}

export interface IPointToRectRelative {
	quadrant: RectQuadrant
	distance: number
}

export function isPointInRect(point: IPoint, rect: IRect, sensitive = true) {
	const boundSensor = (value: number) => {
		if (!sensitive) return 0
		const sensor = value * 0.1
		if (sensor > 20) return 20
		if (sensor < 10) return 10
		return sensor
	}

	return (
		point.x >= rect.x + boundSensor(rect.width) &&
		point.x <= rect.x + rect.width - boundSensor(rect.width) &&
		point.y >= rect.y + boundSensor(rect.height) &&
		point.y <= rect.y + rect.height - boundSensor(rect.height)
	)
}

export function isEqualRect(target: IRect, source: IRect) {
	return target?.x === source?.x && target.y === source.y && target.width === source.width && target.height === source.height
}

export function getRectPoints(source: IRect) {
	const p1 = new Point(source.x, source.y)
	const p2 = new Point(source.x + source.width, source.y)
	const p3 = new Point(source.x + source.width, source.y + source.height)
	const p4 = new Point(source.x, source.y + source.height)
	return [p1, p2, p3, p4]
}

export function isRectInRect(target: IRect, source: IRect) {
	const [p1, p2, p3, p4] = getRectPoints(target)
	return isPointInRect(p1, source, false) && isPointInRect(p2, source, false) && isPointInRect(p3, source, false) && isPointInRect(p4, source, false)
}

export function isCrossRectInRect(target: IRect, source: IRect) {
	const targetCenterPoint = new Point(target.x + target.width / 2, target.y + target.height / 2)
	const sourceCenterPoint = new Point(source.x + source.width / 2, source.y + source.height / 2)
	return Math.abs(targetCenterPoint.x - sourceCenterPoint.x) <= target.width / 2 + source.width / 2 && Math.abs(targetCenterPoint.y - sourceCenterPoint.y) <= target.height / 2 + source.height / 2
}

/**
 * 计算点在矩形的哪个象限
 * @param point
 * @param rect
 */
export function calcQuadrantOfPointToRect(point: IPoint, rect: IRect) {
	const isInner = isPointInRect(point, rect)
	if (point.x <= rect.x + rect.width / 2) {
		if (point.y <= rect.y + rect.height / 2) {
			if (isInner) {
				return RectQuadrant.Inner1
			} else {
				return RectQuadrant.Outer1
			}
		} else {
			if (isInner) {
				return RectQuadrant.Inner4
			} else {
				return RectQuadrant.Outer4
			}
		}
	} else {
		if (point.y <= rect.y + rect.height / 2) {
			if (isInner) {
				return RectQuadrant.Inner2
			} else {
				return RectQuadrant.Outer2
			}
		} else {
			if (isInner) {
				return RectQuadrant.Inner3
			} else {
				return RectQuadrant.Outer3
			}
		}
	}
}

/**
 *
 * @param point 点数据
 * @param rect 矩形数据
 * @returns 计算点到矩形顶点的距离，如果在矩形内则则为0，如果不是的话，计算点到矩形最近顶点的距离（欧几里得距离）
 */
export function calcDistanceOfPointToRect(point: IPoint, rect: IRect) {
	if (isPointInRect(point, rect)) {
		return 0
	}
	let minX = Math.min(Math.abs(point.x - rect.x), Math.abs(point.x - (rect.x + rect.width)))
	let minY = Math.min(Math.abs(point.y - rect.y), Math.abs(point.y - (rect.y + rect.height)))

	return Math.sqrt(minX ** 2 + minY ** 2)
}

/**
 *
 * @param point 点数据
 * @param rect 矩形数据
 * @returns 计算点到矩形边的距离
 */
export function calcDistancePointToEdge(point: IPoint, rect: IRect) {
	const distanceTop = Math.abs(point.y - rect.y)
	const distanceBottom = Math.abs(point.y - (rect.y + rect.height))
	const distanceLeft = Math.abs(point.x - rect.x)
	const distanceRight = Math.abs(point.x - (rect.x + rect.width))
	return Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight)
}

/**
 *
 * @param point 点数据
 * @param rect 矩形数据
 * @param inline 是否矩形为行内元素
 * @returns 判断点是否在矩形的后面，根据行内元素和行元素做不同判断逻辑。
 */
export function isNearAfter(point: IPoint, rect: IRect, inline = false) {
	if (inline) {
		return Math.abs(point.x - rect.x) + Math.abs(point.y - rect.y) > Math.abs(point.x - (rect.x + rect.width)) + Math.abs(point.y - (rect.y + rect.height))
	}
	return Math.abs(point.y - rect.y) > Math.abs(point.y - (rect.y + rect.height))
}

/**
 *
 * @param point 点数据
 * @param rect 属性数据
 * @returns 计算点鱼矩形的相对位置信息，点到矩形顶点距离&点在矩形的象限
 */
export function calcRelativeOfPointToRect(point: IPoint, rect: IRect): IPointToRectRelative {
	const distance = calcDistanceOfPointToRect(point, rect)
	const quadrant = calcQuadrantOfPointToRect(point, rect)
	return {
		quadrant,
		distance,
	}
}

/**
 *
 * @param rects 矩形数组
 * @returns 计算多个矩形的外包围区域，类似求矩形的区域并集
 */
export function calcBoundingRect(rects: IRect[]) {
	if (!rects?.length) return
	if (rects?.length === 1 && !rects[0]) return
	let minTop = Infinity
	let maxBottom = -Infinity
	let minLeft = Infinity
	let maxRight = -Infinity
	rects.forEach((item) => {
		const rect = new Rect(item.x, item.y, item.width, item.height)
		if (rect.top <= minTop) {
			minTop = rect.top
		}
		if (rect.bottom >= maxBottom) {
			maxBottom = rect.bottom
		}
		if (rect.left <= minLeft) {
			minLeft = rect.left
		}
		if (rect.right >= maxRight) {
			maxRight = rect.right
		}
	})
	return new Rect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop)
}

/**
 * 计算拖动过程中起始点和终止点组成的矩形范围
 * @param startPoint 起始点
 * @param endPoint 终止点
 * @param scrollX 横向滚动距离（拖动过程中发生的）
 * @param scrollY 纵向滚动距离 （拖动过程中发生的）
 * @returns
 */
export function calcRectByStartEndPoint(startPoint: IPoint, endPoint: IPoint, scrollX = 0, scrollY = 0) {
	let drawStartX = 0,
		drawStartY = 0
	if (endPoint.x + scrollX >= startPoint.x && endPoint.y + scrollY >= startPoint.y) {
		//4象限
		drawStartX = startPoint.x
		drawStartY = startPoint.y
		return new Rect(drawStartX - scrollX, drawStartY - scrollY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY))
	} else if (endPoint.x + scrollX < startPoint.x && endPoint.y + scrollY < startPoint.y) {
		//1象限
		drawStartX = endPoint.x
		drawStartY = endPoint.y
		return new Rect(drawStartX, drawStartY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY))
	} else if (endPoint.x + scrollX < startPoint.x && endPoint.y + scrollY >= startPoint.y) {
		//3象限
		drawStartX = endPoint.x
		drawStartY = startPoint.y
		return new Rect(drawStartX - scrollX, drawStartY - scrollY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY))
	} else {
		//2象限
		drawStartX = startPoint.x
		drawStartY = endPoint.y
		return new Rect(drawStartX, drawStartY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY))
	}
}

/**
 *
 * @param rect 矩形
 * @returns 返回矩形的6条绘制线，分别为矩形的四条边和过矩形中点的垂线和水平线
 */
export function calcEdgeLinesOfRect(rect: IRect): IRectEdgeLines {
	return {
		v: [
			new LineSegment(new Point(rect.x, rect.y), new Point(rect.x, rect.y + rect.height)),
			new LineSegment(new Point(rect.x + rect.width / 2, rect.y), new Point(rect.x + rect.width / 2, rect.y + rect.height)),
			new LineSegment(new Point(rect.x + rect.width, rect.y), new Point(rect.x + rect.width, rect.y + rect.height)),
		],
		h: [
			new LineSegment(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y)),
			new LineSegment(new Point(rect.x, rect.y + rect.height / 2), new Point(rect.x + rect.width, rect.y + rect.height / 2)),
			new LineSegment(new Point(rect.x, rect.y + rect.height), new Point(rect.x + rect.width, rect.y + rect.height)),
		],
	}
}

/**
 *
 * @param line 线段
 * @returns 如果是垂线就不做操作，如果不是垂线则为横轴上的投影
 */
export function calcRectOfAxisLineSegment(line: ILineSegment) {
	if (!isLineSegment(line)) return
	const isXAxis = line.start.x === line.end.x
	return new Rect(line.start.x, line.start.y, line.end.x - line.start.x, isXAxis ? line.end.y - line.start.y : 0)
}

/**
 *
 * @param target 目标矩形
 * @param source 源矩形
 * @param type 类型限制（left,right,top,bottom）
 * @returns 如果矩形在正上方，正下方，正左方，正右方则返回两个矩形中间的空间形成的矩形
 */
export function calcSpaceBlockOfRect(target: IRect, source: IRect, type?: string) {
	const targetRect = new Rect(target.x, target.y, target.width, target.height)
	const sourceRect = new Rect(source.x, source.y, source.width, source.height)
	if (sourceRect.bottom < targetRect.top && sourceRect.left > targetRect.right) return
	if (sourceRect.top > targetRect.bottom && sourceRect.left > targetRect.right) return
	if (sourceRect.bottom < targetRect.top && sourceRect.right < targetRect.left) return
	if (sourceRect.top > targetRect.bottom && sourceRect.right < targetRect.left) return
	if (sourceRect.bottom < targetRect.top) {
		const distance = targetRect.top - sourceRect.bottom
		const left = Math.min(sourceRect.left, targetRect.left)
		const right = Math.max(sourceRect.right, targetRect.right)
		if (type && type !== 'top') return
		return {
			type: 'top',
			distance,
			rect: new Rect(left, sourceRect.bottom, right - left, distance),
		}
	} else if (sourceRect.top > targetRect.bottom) {
		const distance = sourceRect.top - targetRect.bottom
		const left = Math.min(sourceRect.left, targetRect.left)
		const right = Math.max(sourceRect.right, targetRect.right)
		if (type && type !== 'bottom') return
		return {
			type: 'bottom',
			distance,
			rect: new Rect(left, targetRect.bottom, right - left, distance),
		}
	} else if (sourceRect.right < targetRect.left) {
		const distance = targetRect.left - sourceRect.right
		const top = Math.min(sourceRect.top, targetRect.top)
		const bottom = Math.max(sourceRect.bottom, targetRect.bottom)
		if (type && type !== 'left') return
		return {
			type: 'left',
			distance,
			rect: new Rect(sourceRect.right, top, distance, bottom - top),
		}
	} else if (sourceRect.left > targetRect.right) {
		const distance = sourceRect.left - targetRect.right
		const top = Math.min(sourceRect.top, targetRect.top)
		const bottom = Math.max(sourceRect.bottom, targetRect.bottom)
		if (type && type !== 'right') return
		return {
			type: 'right',
			distance,
			rect: new Rect(targetRect.right, top, distance, bottom - top),
		}
	}
}

/**
 *
 * @param targetRect 目标矩形
 * @param referRect 相对矩形
 * @returns 根据目标矩形和相对矩形的相对位置来得到矩形的延长线
 *
 */
export function calcExtendsLineSegmentOfRect(targetRect: Rect, referRect: Rect) {
	if (referRect.right < targetRect.right && targetRect.left <= referRect.right) {
		//右侧
		if (referRect.bottom < targetRect.top) {
			//上方
			return {
				start: { x: referRect.right, y: referRect.bottom },
				end: { x: targetRect.right, y: referRect.bottom },
			}
		} else if (referRect.top > targetRect.bottom) {
			//下方
			return {
				start: { x: referRect.right, y: referRect.top },
				end: { x: targetRect.right, y: referRect.top },
			}
		}
	} else if (referRect.left > targetRect.left && targetRect.right >= referRect.left) {
		//左侧
		if (referRect.bottom < targetRect.top) {
			//上方
			return {
				start: { x: targetRect.left, y: referRect.bottom },
				end: { x: referRect.left, y: referRect.bottom },
			}
		} else if (referRect.top > targetRect.bottom) {
			//下方
			return {
				start: { x: targetRect.left, y: referRect.top },
				end: { x: referRect.left, y: referRect.top },
			}
		}
	}
	if (referRect.top < targetRect.top && referRect.bottom >= targetRect.top) {
		//refer在上方
		if (referRect.right < targetRect.left) {
			//右侧
			return {
				start: { x: referRect.right, y: referRect.bottom },
				end: { x: referRect.right, y: targetRect.bottom },
			}
		} else if (referRect.left > targetRect.right) {
			//左侧
			return {
				start: { x: referRect.left, y: referRect.bottom },
				end: { x: referRect.left, y: targetRect.bottom },
			}
		}
	} else if (referRect.bottom > targetRect.bottom && referRect.top <= targetRect.bottom) {
		//refer下方
		if (referRect.right < targetRect.left) {
			//右侧
			return {
				start: { x: referRect.right, y: targetRect.top },
				end: { x: referRect.right, y: referRect.top },
			}
		} else if (referRect.left > targetRect.right) {
			//左侧
			return {
				start: { x: referRect.left, y: targetRect.top },
				end: { x: referRect.left, y: referRect.top },
			}
		}
	}
}

/**
 *
 *
 * @export
 * @param  line 线段数据
 * @param current 矩形
 * @return  返回矩形水平线和垂线中距离线段最近的那条线与矩形x,y的偏移量
 */
export function calcOffsetOfSnapLineSegmentToEdge(line: ILineSegment, current: IRect) {
	/**
	 *
	 * @param rect 矩形
	 * @returns 返回x集合和y集合，分别对应就是矩形的边和垂线，水平线
	 */
	function calcEdgeLinesOfRect(rect: IRect) {
		return {
			x: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
			y: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
		}
	}
	/**
	 *
	 * @param edges 边列表
	 * @param targetValue 目标值
	 * @returns 计算目标值距离边列表中和目标值最近的一个
	 */
	function calcMinDistanceValue(edges: number[], targetValue: number) {
		let minDistance = Infinity,
			minDistanceIndex = -1
		for (let i = 0; i < edges.length; i++) {
			const distance = Math.abs(edges[i] - targetValue)
			if (minDistance > distance) {
				minDistance = distance
				minDistanceIndex = i
			}
		}
		return edges[minDistanceIndex]
	}

	const edges = calcEdgeLinesOfRect(current)
	const isVerticalLine = line.start.x === line.end.x
	if (isVerticalLine) {
		return { x: calcMinDistanceValue(edges.x, line.start.x) - current.x, y: 0 }
	}

	return { x: 0, y: calcMinDistanceValue(edges.y, line.start.y) - current.y }
}

/**
 *
 * @param line 线段
 * @param edges 水平垂线集合
 * @returns 返回线段和水平线或者垂线中最短的距离，如果线段不是水平线或者垂线则会报错
 */
export function calcDistanceOfSnapLineToEdges(line: ILineSegment, edges: IRectEdgeLines) {
	let distance = Infinity
	if (line?.start?.y === line?.end?.y) {
		edges.h.forEach((target) => {
			const _distance = Math.abs(target.start.y - line.start.y)
			if (_distance < distance) {
				distance = _distance
			}
		})
	} else if (line?.start?.x === line?.end?.x) {
		edges.v.forEach((target) => {
			const _distance = Math.abs(target.start.x - line.start.x)
			if (_distance < distance) {
				distance = _distance
			}
		})
	} else {
		throw new Error('can not calculate slash distance')
	}
	return distance
}

/**
 *
 * @param target 线段1
 * @param source 线段2
 * @returns 求出线段的并集（这里应该限制了线段只会是垂线或者水平线）
 */
export function calcCombineSnapLineSegment(target: ILineSegment, source: ILineSegment): ILineSegment {
	if (target.start.x === target.end.x) {
		return new LineSegment(new Point(target.start.x, Math.min(source.start.y, target.start.y)), new Point(target.start.x, Math.max(source.end.y, target.end.y)))
	}

	return new LineSegment(new Point(Math.min(source.start.x, target.start.x), target.start.y), new Point(Math.max(source.end.x, target.end.x), target.end.y))
}

/**
 *
 * @param line 线段
 * @param edges 垂线水平线集合
 * @returns 计算距垂线或者水平线中距离线段line最近的那个线段(这里也是要求line是垂线或者水平线)
 */
export function calcClosestEdges(line: ILineSegment, edges: IRectEdgeLines): [number, ILineSegment] {
	let result: ILineSegment
	let distance = Infinity
	if (line?.start?.y === line?.end?.y) {
		edges.h.forEach((target) => {
			const _distance = Math.abs(target.start.y - line.start.y)
			if (_distance < distance) {
				distance = _distance
				result = target
			}
		})
	} else if (line?.start?.x === line?.end?.x) {
		edges.v.forEach((target) => {
			const _distance = Math.abs(target.start.x - line.start.x)
			if (_distance < distance) {
				distance = _distance
				result = target
			}
		})
	} else {
		throw new Error('can not calculate slash distance')
	}
	return [distance, result]
}

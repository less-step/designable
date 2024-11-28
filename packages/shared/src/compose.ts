/**
 *
 * @param fns 处理函数数组
 * @returns 融合fns后的函数
 */
export const compose = (...fns: ((payload: any) => any)[]) => {
	return (payload: any) => {
		return fns.reduce((buf, fn) => {
			return fn(buf)
		}, payload)
	}
}

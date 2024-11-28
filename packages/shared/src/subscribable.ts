import { isFn } from './types'

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL')

export interface ISubscriber<Payload = any> {
	(payload: Payload): void | boolean
}

export class Subscribable<ExtendsType = any> {
	private subscribers: {
		index?: number
		[key: number]: ISubscriber
	} = {
		index: 0,
	}

	dispatch<T extends ExtendsType = any>(event: T, context?: any) {
		let interrupted = false
		for (const key in this.subscribers) {
			if (isFn(this.subscribers[key])) {
				event['context'] = context
				if (this.subscribers[key](event) === false) {
					interrupted = true
				}
			}
		}
		return interrupted ? false : true
	}

	/**
	 *
	 * @param subscriber 订阅者
	 * @returns 订阅者的id是自增的，注册则可订阅实例上，返回值是一个函数，可以用来取消订阅，函数上面挂载了一个symbol属性用来标记id
	 */
	subscribe(subscriber: ISubscriber): any {
		let id: number
		if (isFn(subscriber)) {
			id = this.subscribers.index + 1
			this.subscribers[id] = subscriber
			this.subscribers.index++
		}

		const unsubscribe = () => {
			this.unsubscribe(id)
		}

		unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id

		return unsubscribe
	}

	/**
	 *
	 * @param id 订阅者的id，如果这个id不存在着会把所有的订阅者都取消掉
	 * @returns
	 */
	unsubscribe = (id?: number | string | (() => void)) => {
		if (id === undefined || id === null) {
			for (const key in this.subscribers) {
				this.unsubscribe(key)
			}
			return
		}
		if (!isFn(id)) {
			delete this.subscribers[id]
		} else {
			delete this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]]
		}
	}
}

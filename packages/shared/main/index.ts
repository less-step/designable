import { compose, globalThisPolyfill, instOf, isNativeObject } from '../src'
console.log(globalThisPolyfill)
console.log(instOf('jss', 'String'))
console.log(instOf(new Map(), 'Map'))
console.log(isNativeObject(new Map()))
let testObj = { name: 'jss' }
function handle1(str) {
	return str + 'handle1'
}

function handle2(str) {
	return str + 'handle2'
}

let handle = compose(handle1, handle2)
console.log(handle(testObj.name))

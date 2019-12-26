
class Observer{
	constructor (value) {
	    this.value = value
	    // 增加dep属性（处理数组时可以直接调用）
	    this.dep = new Dep()
	    //将Observer实例绑定到data的__ob__属性上面去，后期如果oberve时直接使用，不需要从新Observer,
	    //处理数组是也可直接获取Observer对象
	    def(value, '__ob__', this)
	    if (Array.isArray(value)) {
	    	//这里只测试对象
	    } else {
	    	//处理对象
	      	this.walk(value)
	    }
	}
 
	walk (obj) {
    	const keys = Object.keys(obj)
    	for (let i = 0; i < keys.length; i++) {
    		//此处我做了拦截处理，防止死循环，Vue中在oberve函数中进行的处理
    		if(keys[i]=='__ob__') return;
      		defineReactive(obj, keys[i], obj[keys[i]])
    	}
  	}
}
//数据重复Observer
function observe(value){
	if(typeof(value) != 'object' ) return;
	let ob = new Observer(value)
  	return ob;
}
// 把对象属性改为getter/setter，并收集依赖
function defineReactive (obj,key,val) {
  	const dep = new Dep()
  	//处理children
  	let childOb = observe(val)
  	Object.defineProperty(obj, key, {
    	enumerable: true,
    	configurable: true,
    	get: function reactiveGetter () {
    		console.log(`调用get获取值，值为${val}`)
      		const value = val
      		if (Dep.target) {
	        	dep.depend()
		        if (childOb) {
		          	childOb.dep.depend()
		        }
	      	}
      		return value
	    },
	    set: function reactiveSetter (newVal) {
	    	console.log(`调用了set，值为${newVal}`)
	      	const value = val
	       	val = newVal
	       	//对新值进行observe
	      	childOb = observe(newVal)
	      	//通知dep调用,循环调用手机的Watcher依赖，进行视图的更新
	      	dep.notify()
	    }
  })
}
 
//辅助方法
function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

//标识当前的Dep id
let uidep = 0
class Dep{
	constructor () {
		this.id = uidep++
		// 存放所有的监听watcher
    	this.subs = []
  	}
 
  	//添加一个观察者对象
  	addSub (Watcher) {
    	this.subs.push(Watcher)
  	}
 
  	//依赖收集
	depend () {
		//Dep.target 作用只有需要的才会收集依赖
	    if (Dep.target) {
	      Dep.target.addDep(this)
	    }
	}
 
	// 调用依赖收集的Watcher更新
    notify () {
	    const subs = this.subs.slice()
	    for (let i = 0, l = subs.length; i < l; i++) {
	      subs[i].update()
	    }
  	}
}
 
Dep.target = null
const targetStack = []
 
// 为Dep.target 赋值
function pushTarget (Watcher) {
	if (Dep.target) targetStack.push(Dep.target)
  	Dep.target = Watcher
}
function popTarget () {
  Dep.target = targetStack.pop()
}

export default Dep;

/**
 * @desc 属性改变监听，属性被set时出发watch的方法，类似vue的watch
 * @author Jason
 * @data 2018-04-27
 * @constructor 
 * @param {object} opts - 构造参数. @default {data:{},watch:{}};
 * @argument {object} data - 要绑定的属性
 * @argument {object} watch - 要监听的属性的回调 
 * watch @callback (newVal,oldVal) - 新值与旧值 
 */

// 为了函数内部的健壮性，getBaseType是用来做类型校验的。
// Object.defineProperty(this),this把上下文指向当前对象。
// this.$watch[_key].call(this,val,oldVal),把监听事件的上下文页绑定到当前对象，方便在watch内通this获取对象内的值
class watcher {
    constructor(opts) {
        this.$data = this.getBaseType(opts.data) === 'Object' ? opts.data : {};
        this.$watch = this.getBaseType(opts.watch) === 'Object' ? opts.watch : {};
        for (let key in opts.data) {
            this.setData(key)
            // immediate监听
            this.getBaseType(this.$watch[key]) && this.getBaseType(this.$watch[key]) === 'Object' && this.getBaseType(this.$watch[key].immediate) == "Boolean" && (
                this.$watch[key].handler.call(this, this.$data[key], this.$data[key])
            )
        }
    }

    getBaseType(target) {
        const typeStr = Object.prototype.toString.apply(target);
        return typeStr.slice(8, -1);
    }

    setData(_key) {
        Object.defineProperty(this, _key, {
            get: function () {
                return this.$data[_key];
            },
            set: function (val) {
                const oldVal = this.$data[_key];
                if (oldVal === val) return val;
                this.$data[_key] = val;
                //data函数监听
                this.$watch[_key] && typeof this.$watch[_key] === 'function' && (
                    this.$watch[_key].call(this, val, oldVal)
                );

                //handler函数式监听
                this.getBaseType(this.$watch[_key]) && this.getBaseType(this.$watch[_key]) === 'Object' && (
                    this.$watch[_key].handler.call(this, val, oldVal)
                )
                return val;
            },
        });
    }
}

export default watcher;
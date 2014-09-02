/*
	version 0.2
	
*/


// only for object
// usage: each([true,] target, fn)
var each = function loop(isDeep, target, fn, arr) {
	if (typeof isDeep !== "boolean") {
		var start = 0
		arr = arguments[start + 2]
		fn = arguments[start + 1]
		target = arguments[start]
		isDeep = false
	}
	arr = arr ? arr : []
	
	for (var k in target) {
		arr.push(k)
		if (isDeep && toString.call(target[k]).indexOf("Object") > 7) {
			loop(isDeep, target[k], fn, arr)
		} else {
			fn(k, target[k], target, arr)
		}
		arr.pop()
	}
}

// for object and array
// usage: each2([true,] target, fn)
var each2 = function loop2(isDeep, target, fn, arr) {
	if (typeof isDeep !== "boolean") {
		var start = 0
		isDeep = false
		target = arguments[start]
		fn = arguments[start + 1]
		arr = arguments[start + 2]
	}
	arr = arr ? arr : []
	
	var ret, count = 0
	for (var k in target) {
		count += 1
		arr.push(k)
		if (isDeep && (toString.call(target[k]).indexOf("Object") > 7 || toString.call(target[k]).indexOf("Array") > 7 )) {
			ret = loop2(isDeep, target[k], fn, arr)
			if (ret === 0) {
				fn(k, target[k], target, arr)
			}
		} else {
			fn(k, target[k], target, arr)
		}
		arr.pop()
	}
	return count
}

// filter
// using key list such as [l1, l2] for matching
var filter = function(target, model, callback) {
	var mVal,
		keyStr

	callback = typeof callback === "function" ? callback : function() {}

	each2(true, target, function(k, v, who, keyList) {
		callback("all", k, v, who)
		for (var j in model) {
			if (!model.hasOwnProperty(j)) continue
			mVal = model[j]
			keyStr = keyList.join(".")
			if (keyStr.match(j)) {
				callback("before", k, v, who, mVal)
				filter_content(mVal, k, v, who)
				callback("after", k, v, who, mVal)
				return target
			}
		}
		callback("fail", k, v, who)
	})
}

var filter_content = function(rule, key, value, dict) {
	var type = toString.call(rule)
	if (type.indexOf("Boolean") > 7 && rule === true) {
		// keep
	}
	else if (type.indexOf("Boolean") > 7 && rule === false) {
		delete dict[key]
	}
	else if (type.indexOf("String") > 7) {
		var pattern = /(\/.+?\/\w*)\s*,(.+)$/
		var match = rule.match(pattern)

		if (match) {
			var pat = match[1]
			var rep = match[2]
			
			var fnContent = "return str.replace(%s1, %s2);".replace("%s1", pat).replace("%s2", rep)
			var fn = new Function("str, pattern, replacement", fnContent)
			var res = fn(value, pat, rep)
			dict[key] = res
		} else {
			dict[key] = rule
		}
	}
}


// using [l1, l2] or "l1.l2" to get the deep property of the dict
var get = function(dict, arr) {
	if (typeof arr === "string") {
		arr = arr.split(".")
	}
	if (toString.call(arr).indexOf("Array") < 7) { return }
	
	var res = dict
	for (var i = 0; i < arr.length; i++) {
		res = res[arr[i]]
		if (typeof res === "undefined") {
			break
		}
	}
	return res
}

/*
// the test of get() function

var dict = {
	foo: {
		bar: {
			one: 1,
			two: 2
		}
	}
}
var arr1 = ["foo", "none"]
var arr2 = ["foo", "bar"]
var arr3 = ["bar", "foo", "none"]
var arr4 = ["foo", "bar", "one"]
var arr5 = ["foo", "bar", "two", "none"]

*/


var dictTools = {
	each: each,
	each2: each2,
	filter: filter,
	get: get
}


module.exports = dictTools
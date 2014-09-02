
var _ = require("lodash")


/*
	DataModel class
	the base class for the data model object
*/
var DataModel = {
	options: {
		defaultPrefix : "default_"
	},

	init: function(param, type) {
		this.currentDefault = {}
		this.defaultName = ""
		this.data = {}
		this.validFlag = true
		this.filterData = {
			"include": true,
			"exclude": {}
		}

		this.initDefault(param, type)
		this.set(param)
		return this
	},
	initDefault: function(param, type) {
		if (!_.isString(type)) { throw new Error("type should be a string.") }

		var defName = this.options.defaultPrefix + type
		this.defaultName = defName
		this.currentDefault = this.shiftDefaultValues(this.default, this[defName])
	},
	shiftDefaultValues: function(def, dict) {
		var res = {},
			tarValue
		for (var k in dict) {
			if (!dict.hasOwnProperty(k)) continue
			if (typeof def[k] === "undefined") {
				throw new Error("DataModel shifts error: default prop '%s' not set.".replace("%s", k))
			}

			tarValue = dict[k]

			if (tarValue === 1) {
				res[k] = def[k]
			} else if (_.isArray(tarValue) || _.isFunction(tarValue)) {
				res[k] = tarValue
			} else {
				throw new Error("DataModel shifts error: targetValue not reconized.")
			}
		}
		return res
	},

	/**/

	// the include() and exclude() action only apply to the get all situation
	get: function(name) {
		if (_.isString(name)) {
			return this.data[name]
		}
		return this.modify(this.data)
	},
	// will setup the values of data model
	set: function(dict) {
		if (!_.isObject(dict)) {
			dict = {}
		}

		var self = this,
			targetValue

		_.each(this.currentDefault, function(judgement, k) {
			targetValue = dict[k]
			targetValue = self.convert(targetValue, judgement)
			targetValue = self.valid(targetValue, judgement)
			self.data[k] = targetValue
		})
	},
	// used in get() method for filter the keys
	modify: function(data) {
		var res = {}
		for (var k in data) {
			if (!data.hasOwnProperty(k)) continue
			if (this.filterData.exclude[k]) {
				// noop
			} else if (this.filterData.include[k] || this.filterData.include) {
				res[k] = data[k]
			}
		}
		return res
	},
	include: function(dict) {
		this.filterData.include = dict
	},
	exclude: function(dict) {
		this.filterData.exclude = dict
	},

	/**/
	
	convert: function(targetValue, judgement) {
			var type = judgement[1]
		if (type === "number") {
			return parseInt(targetValue)
		}
		return targetValue
	},
	valid: function(targetValue, judgement) {
		if (_.isFunction(judgement)) {
			return judgement(targetValue, this)
		} else {
			var regex,
				type
			if (_.isRegExp(judgement)) {
				regex = judgement
				type = "string"
			} else {
				regex = judgement[0]
				type = judgement[1]
			}
			if (!this.matchType(targetValue, type) || !regex.test(targetValue)) {
				this.validFlag = false
				return undefined
			}
			return targetValue
		}
	},
	matchType: function(value, type) {
		return typeof value === type
	},
	isValid: function() {
		return this.validFlag
	},

	/**/

	extend: function(obj) {
		var fn = function(param, type) { this.init(param, type) }
		fn.prototype = _.extend(Object.create(this), obj)
		return fn
	}
}

module.exports = DataModel
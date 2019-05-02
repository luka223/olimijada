var express = require('express');
var router = express.Router();

module.exports = {
	checkQuotationMarks: function(str)
	{
		var novi = str;
		novi = novi.split('"').join('""');
		return novi;
	}
}
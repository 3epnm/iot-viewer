Date.prototype.getFormatDateTime = function () {
	var pad = function (number) {
		if ( number < 10 ) {
			return '0' + number;
		}
		return number;
	}

	return this.getFullYear() 
		+ '-' 
		+ pad( this.getMonth() + 1 ) 
		+ '-' 
		+ pad( this.getDate() ) 
		+ ' ' 
		+ pad( this.getHours() ) 
		+ ':' 
		+ pad( this.getMinutes() 
	);
}

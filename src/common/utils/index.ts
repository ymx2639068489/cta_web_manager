export function formatDate(time: Date,format = 'YY-MM-DD hh:mm:ss'){
	var date = new Date(time);

	var year = date.getFullYear(),
		month = date.getMonth()+1,
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var preArr = Array.apply(null,Array(10)).map(function(elem, index) {
		return '0'+index;
	});

	var newTime = format.replace(/YY/g, year + '')
                      .replace(/MM/g,preArr[month]||month)
                      .replace(/DD/g,preArr[day]||day)
                      .replace(/hh/g,preArr[hour]||hour)
                      .replace(/mm/g,preArr[min]||min)
                      .replace(/ss/g,preArr[sec]||sec);
	return newTime;
}

export function debounce(fn: Function, awaitTime: number) {
  let timer: any
  return function(...args: any) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), awaitTime)
  }
}
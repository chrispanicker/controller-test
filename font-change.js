//documentation on how to work with variable fonts with js
//https://abcdinamo.com/news/using-variable-fonts-on-the-web

doesExist=true

//ripped map() and constrain() right from p5
function map(n, start1, stop1, start2, stop2) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
};

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
};


function adjustWeight(val){
	var weight = map(val, -1, 1, 900, 100);
	return weight
}

function adjustItalics(val){
	var italic = map(val, -1, 1, 0, 12)
	return italic
}

function adjustWidth(val){
	var width = map(val, -1, 1, 100, 200)
	return width
}

function adjustSize(val){
	var size = map(val, -1, 1, 10, 5)
	return size
}

function adjustSpacing(val){
	var spacing = map(val, 0, 1, 0, .8)
	return spacing
}

function adjustOpacity(val){
	var spacing = map(val, 0, 1, 1, .1)
	return spacing
}




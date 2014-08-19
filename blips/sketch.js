//var img;
//var imgMask;


var data = [];

function preload() {
  //img = loadImage("moonwalk.jpg");
  //imgMask = loadImage("mask.png");
}

function setup() {
  createCanvas(720, 400);
  imageMode(CENTER);
  //img.mask(imgMask);
  data = []
  // data.push({
  // 	x:300,
  // 	y:300,
  // 	val:"t",
  // 	size:32
  // });
  // data.push({
  // 	x:50,
  // 	y:40,
  // 	val:"s",
  // 	size:32
  // });
  // data.push({
  // 	x:20,
  // 	y:100,
  // 	val:"x",
  // 	size:32
  // });
}

function draw() {
  background(0, 102, 153);

  shrinkPointsAndCull();
  sampleNextPoint();
  render();

  //image(img, width/2, height/2);
  //image(img, mouseX, mouseY);
}

var clickedX, clickedY;
function mouseClicked() {
	clickedX = mouseX;
	clickedY = mouseY;
}
function keyTyped() {
	addPoint(clickedX,clickedY,key);
}

function render() {
	_.each(data, function(point) {
		textSize(floor(point.size));
		text(point.val, point.x, point.y);
	});
}

function shrinkPointsAndCull() {
	var culls = [];
	_.each(data, function(point) {
		point.size = point.size*0.99;
		if (floor(point.size)<2)
			culls.push(point);
		point.mom = point.mom*0.95;
		point.x = point.x + point.vx*point.mom;
		point.y = point.y + point.vy*point.mom;
		point.vx = point.vx  + (random()-0.5)*0.3;
		point.vy = point.vy  + (random()-0.5)*0.3;
	});
	data = _.without(data, culls);	
}

function sampleNextPoint() {
	var nextX = Math.random()*width;
	var nextY = Math.random()*height;
	var closePoints = _.filter(data, function(point){
		var dist = sqrt(sq(point.x - nextX) + sq(point.y - nextY));
		return dist < 30;
	});
	if (closePoints.length==0)
		return; // dont add a point at all as nothing close enough to whats there
	var closeVals = _.pluck(closePoints, "val");
	var nextVal = _.sample(closeVals);

	addPoint(nextX, nextY, nextVal);
}

function addPoint(nextX, nextY, nextVal) {
	data.push({
		x:nextX,
		y:nextY,
		val:nextVal,
		size:32,
		mom:5,
		vx: -1,
		vy: 0
	});
}
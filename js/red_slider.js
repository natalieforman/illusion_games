var SlideSize = 100;
var SliderX = 10;
var SliderDist = SlideSize+60;

var SliderY = 550;
var SliderYDist = 30;
 var FontSize = 16;
 
var BottomYheight;
var TopYheight;

var NDots = 2000;
  
 var X =[]
 var Y = []

function setup() {
  var canvas = createCanvas(550,700);
  canvas.parent("illusion-holder");
  colorMode(RGB,255,255,255,100);
  frameRate(2);
  
  BottomYheight = (height-(SliderY-40));
  TopYheight = height-BottomYheight;
  for (var i=0; i<NDots; i++) {
    X[i] = width/4+ random(width/2);
    Y[i] = TopYheight/4+ random(TopYheight/2);
  }

  
  var spot = document.getElementById("illusion-holder");
  var position = getPosition(spot)
  rSliderBack = createSlider(0, 255, 127);
  rSliderBack.position(position.x+SliderX, position.y+SliderY);
  rSliderBack.size(SlideSize);
  gSliderBack = createSlider(0, 255, 127);
  gSliderBack.position(position.x+SliderX, position.y+SliderY+1*SliderYDist);
  gSliderBack.size(SlideSize);
  bSliderBack = createSlider(0, 255, 127);
  bSliderBack.position(position.x+SliderX, position.y+SliderY+2*SliderYDist);
  bSliderBack.size(SlideSize);
  
  rSliderDisk = createSlider(0, 255, 255);
  rSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+0*SliderYDist);
  rSliderDisk.size(SlideSize);
  
  gSliderDisk = createSlider(0, 255, 0);
  gSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+1*SliderYDist);
  gSliderDisk.size(SlideSize);
  
  bSliderDisk = createSlider(0, 255, 0);
  bSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+2*SliderYDist);
  bSliderDisk.size(SlideSize);
  
  rSliderOver = createSlider(0, 255, 0);
  rSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+0*SliderYDist);
  rSliderOver.size(SlideSize);
  
  gSliderOver = createSlider(0, 255, 255);
  gSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+1*SliderYDist);
  gSliderOver.size(SlideSize);
  
  bSliderOver = createSlider(0, 255, 255);
  bSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+2*SliderYDist);
  bSliderOver.size(SlideSize);
  
  aSliderOver = createSlider(0, 100, 51);
  aSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+3*SliderYDist);
  aSliderOver.size(SlideSize);
  
}

function draw() {
  
  noStroke()
  fill(rSliderBack.value(),gSliderBack.value(),bSliderBack.value())
  rect(0,0,width, TopYheight-1);
  
  fill(rSliderDisk.value(),gSliderDisk.value(),bSliderDisk.value())
  ellipse(width/2,TopYheight/2,2, 2);
  
  for (var i=0; i<NDots; i++) {
    ellipse(X[i],Y[i],4, 4);
  }
  
  fill(rSliderOver.value(),gSliderOver.value(),bSliderOver.value(),aSliderOver.value())
  rect(0,0,width, TopYheight-1);
  
  var c = get(width/2, TopYheight/2);
  
  fill(255)
  text("r = "+c[0]+" g = "+c[1]+" b = "+c[2],20,20)
  
  fill(200,200,200)
  rect(1,SliderY-40,width-2, BottomYheight-3);
  
  doText();
}




function doText() {
  noStroke();
  fill(0);
  textSize(FontSize);
  text("Background",SliderX+10,SliderY-20)
  text("Disk",SliderX+SliderDist+30,SliderY-20)
  text("Overlay",SliderX+2*SliderDist+10,SliderY+0*SliderYDist-FontSize)

  text(rSliderBack.value(),SliderX+SlideSize+5,SliderY+0*SliderYDist+FontSize)
  text(gSliderBack.value(),SliderX+SlideSize+5,SliderY+1*SliderYDist+FontSize)
  text(bSliderBack.value(),SliderX+SlideSize+5,SliderY+2*SliderYDist+FontSize)

  text(rSliderDisk.value(),SliderX+1*SliderDist+SlideSize+5,SliderY+0*SliderYDist+FontSize)
  text(gSliderDisk.value(),SliderX+1*SliderDist+SlideSize+5,SliderY+1*SliderYDist+FontSize)
  text(bSliderDisk.value(),SliderX+1*SliderDist+SlideSize+5,SliderY+2*SliderYDist+FontSize)

  text(rSliderOver.value(),SliderX+2*SliderDist+SlideSize+5,SliderY+0*SliderYDist+FontSize)
  text(gSliderOver.value(),SliderX+2*SliderDist+SlideSize+5,SliderY+1*SliderYDist+FontSize)
  text(bSliderOver.value(),SliderX+2*SliderDist+SlideSize+5,SliderY+2*SliderYDist+FontSize)
  text(aSliderOver.value(),SliderX+2*SliderDist+SlideSize+5,SliderY+3*SliderYDist+FontSize)

}

//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
// Helper function to get an element's exact position
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
 
// deal with the page getting resized or scrolled
window.addEventListener("resize", updatePosition, false);
window.addEventListener("scroll", updatePosition, false);


function windowResized() {
  var spot = document.getElementById("illusion-holder");
  var position = getPosition(spot)
  rSliderBack.position(position.x+SliderX, position.y+SliderY);
  gSliderBack.position(position.x+SliderX, position.y+SliderY+1*SliderYDist);
  bSliderBack.position(position.x+SliderX, position.y+SliderY+2*SliderYDist);
  rSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+0*SliderYDist);
  gSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+1*SliderYDist);
  bSliderDisk.position(position.x+SliderX+1*SliderDist, position.y+SliderY+2*SliderYDist);
  rSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+0*SliderYDist);
  gSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+1*SliderYDist);
  bSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+2*SliderYDist);
  aSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+3*SliderYDist);
}
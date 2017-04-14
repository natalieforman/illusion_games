var SlideSize = 100;
var SliderX = 10;
var SliderDist = SlideSize+60;

var SliderY = 550;
var SliderYDist = 30;
 var FontSize = 16;
 
var BottomYheight;
var TopYheight;

var answer;
var NDots = 2000;
  
 var X =[]
 var Y = []

function setup() {
  var canvas = createCanvas(540,570);
  canvas.parent("illusion-holder");
  colorMode(RGB,255,255,255,100);
  frameRate(2);
  
  BottomYheight = (height-(SliderY-40));
  TopYheight = height-BottomYheight;
  for (var i=0; i<NDots; i++) {
    X[i] = width/4+ random(width/2);
    Y[i] = TopYheight/4+ random(TopYheight/2);
  }
  
  aSliderOver = createSlider(0, 100, 51);
  aSliderOver.size(SlideSize);  
}

function draw() {
  
  noStroke()
  fill(127, 127, 127)
  rect(0,0,width, TopYheight-1);
  
  fill(255, 0 ,0);
  ellipse(width/2,TopYheight/2,2, 2);
  
  for (var i=0; i<NDots; i++) {
    ellipse(X[i],Y[i],4, 4);
  }
  
  fill(0, 255, 255, aSliderOver.value())
  rect(0,0,width, TopYheight-1);
  
  var c = get(width/2, TopYheight/2);
  
  fill(255)
  text("r = "+c[0]+" g = "+c[1]+" b = "+c[2],20,20)
  
  fill(255,255,255)
  rect(1,SliderY-40,width-2, BottomYheight-3);
  
  //if they have answered, set it to the answer
  if(window.parent.myAnswers.submit == true && window.parent.myAnswers.slider != true){
      aSliderOver.value(window.parent.myAnswers.answer);
      window.parent.myAnswers.slider = true;
  }
  else{
      window.parent.myAnswers.answer = aSliderOver.value();
  }

  if(window.parent.myAnswers.answer != 51){
    window.parent.myAnswers.submit = true;
  }

  doText();
}

function doText() {
  noStroke();
  fill(0);
  textSize(FontSize);
  //text("Use Slider",SliderX+10,SliderY-20)

  text("Value: "+ aSliderOver.value(), SliderX, SliderY);

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
//window.addEventListener("resize", updatePosition, false);
//window.addEventListener("scroll", updatePosition, false);


function windowResized() {
  var spot = document.getElementById("illusion-holder");
  var position = getPosition(spot)
  //aSliderOver.position(position.x+SliderX+2*SliderDist, position.y+SliderY+3*SliderYDist);
}
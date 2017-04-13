var RecH  = 160;
var RecW  = 80;

var Counter = 0;
var Frequency = 1;
var InitX = 50;
var MaxAmP = 150;
var ScreenH = 500;
var ScreenW = 750;
var Yheight = ScreenH/2;
var steplength = 400;

var FR = 60;
var TempVal, TempVal2;
var Colony = [];
var button;
var SurroundVar = 1;

var HeightSlider;

var HueAngle = 300;
var SatVal = 70;


function setup() {
  frameRate(FR);
  
  colorMode(HSB,360,100,100)
  background(0);
  var canvas = createCanvas(ScreenW, ScreenH);
  canvas.parent("illusion-holder");

//Sliders
  HeightSlider = createSlider(-20, 80, 0.0001);
  HeightSlider.position(20, ScreenH+40);

//intstuff
    for (var i = 0; i < 2; i++) {
        Colony[i] = new DotDotICA(InitX,i,180);
    }     
 
}

function draw() {

  var TempVal, LeftCol, RightCol;
  var H_add = HeightSlider.value();

  var LeftBrightness = 20;
  var RightBrightness = 90;
  var LeftBackColor = color(160, SatVal, LeftBrightness);
  var RightBackColor = color(160, SatVal,RightBrightness);

  var midVal = (LeftBrightness+RightBrightness)/200;
  var ampVal = .55*midVal;

  fill(LeftBackColor);
  noStroke();
  rect(0, 0, ScreenW/2, ScreenH);

  fill(RightBackColor);
  noStroke();
  rect( ScreenW/2, 0, ScreenW/2, ScreenH);

  textAlign(CENTER)
  textSize(50);
  
  Counter = (Counter + 1)%(FR*2);
    
  TempVal = SineTime(Counter, FR, 100, ampVal, midVal, 1.5, 0);
  var ModColor = color(160, SatVal,TempVal);
  
  LeftCol =100;
  RightCol = 0;
  
  for (var i = 0; i < 2; i = i+1) {
    push();
    translate((i*2 +1)*(ScreenW/4)-RecW/2,ScreenH/2-RecH/2)
    if (i == 0) {Colony[i].display(ModColor, RightBackColor,0,H_add); }
    if (i == 1) {Colony[i].display(ModColor, LeftBackColor,0,H_add); }
    pop();
  }

  //if they have answered, set it to the answer
  if(window.parent.myAnswers.choices[1] == true && window.parent.myAnswers.choices[3] != true){
      HeightSlider.value(window.parent.myAnswers.choices[0]);
      window.parent.myAnswers.choices[3] = true;
  }
  else{
      window.parent.myAnswers.choices[0] = HeightSlider.value();
  }
  //default value
  if(window.parent.myAnswers.choices[0] != 0){
    window.parent.myAnswers.choices[1] = true;
  }

  doText();

}

function doText() {
  noStroke();
  fill(255);
  textSize(18);

  text("Value: "+ HeightSlider.value(), 50,490);

}

//*******************************

function DotDotICA(InitX, Num, Phase) {
  this.speed = 1;
  this.display = function(ModulateColor, ColorFlankRect,G,H) {
    fill(ModulateColor);
    noStroke();
    rect(0, 0, RecW, RecH);

    fill(ColorFlankRect);
    noStroke();
    rect(-RecW-G, -H/2, RecW, RecH+H);
    rect(RecW+G, -H/2, RecW, RecH+H);
  };

};

 function SineTime(Count, Steps, Scale, Amp, Mean, Freq, Phase) {
    var V;
    V = Scale*(Amp*sin(Freq*2*3.14159*Count/Steps - Phase*3.1415/180) + Mean);
    return V;
  } 

function ClearSurround(){
  if (SurroundVar ==1) {
    SurroundVar = 0;
  } else {
    SurroundVar = 1;
  }

  print(SurroundVar);
}

 
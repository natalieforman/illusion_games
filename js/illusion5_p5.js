var DiamInner = 60;
var DiamOutter = 120
var DiamGap = DiamInner;

var ScreenH = 550;
var ScreenW = 670;
var InitX = 50;
var MaxAmP = 150;

var FR = 60;
var GapSlider, HeightSlider, HueSlider;

var HueAngle = 300;
var SatVal = 50;

var Colony = [];
var Counter = 0;

var Rows =4;
var Cols =5;

var HueSlider = 200;
var HeightSlider = 0;

function setup() {
  frameRate(FR);
  colorMode(HSB,360,100,100)
  background(0);
  var canvas = createCanvas(ScreenW, ScreenH);
  canvas.parent("illusion-holder");
  
  GapSlider = createSlider(0, DiamOutter-DiamInner, .001);
  GapSlider.position(20, ScreenH+10);
  
  for (var i = 0; i < Rows*Cols; i++) {
        Colony[i] = new ThreeCircICA(InitX,i,180);
    }
  
}

function draw() {
  background(80,20,50)
  
  var TempVal, LeftCol, RightCol;
  var Gap = GapSlider.value();
  var H_add = HeightSlider;

  var LeftBrightness = 30;
  var RightBrightness = 90;
  

  var midVal = (LeftBrightness+RightBrightness)/200;
  var ampVal = .6*midVal;
  
  Counter = (Counter + 1)%(FR*2);
  TempVal = SineTime(Counter, FR, 100, ampVal, midVal, 1.5, 0);
  var ModColor = color((HueSlider+45)%360, SatVal,TempVal);
  
  LeftCol =100;
  RightCol = 0;
  
  for (var j = 0; j < Rows; j = j+1) {
  for (var i = 0; i < Cols; i = i+1) {
    var LeftBackColor = color(HueSlider+(j*6+i*2), SatVal+(j*6+i*2), LeftBrightness);
    var RightBackColor = color(HueSlider+(j*6+i*2), SatVal+(j*6+i*2),RightBrightness);
    var GapColorLeft = color((HueSlider+90)%360, SatVal,RightBrightness);
    var GapColorRight = color((HueSlider+90)%360, SatVal,LeftBrightness);
    push();
    translate(100+(i)*DiamOutter,100+(j)*DiamOutter)
    if (i%2 == 0) {Colony[i].display(ModColor, RightBackColor,GapColorRight,Gap,H_add); }
    if (i%2 == 1) {Colony[i].display(ModColor, LeftBackColor,GapColorLeft,Gap,H_add); }
    pop();
   }
  }

  //if they have answered, set it to the answer
  if(window.parent.myAnswers.submit == true && window.parent.myAnswers.slider != true){
      GapSlider.value(window.parent.myAnswers.answer);
      window.parent.myAnswers.slider = true;
  }
  else{
      window.parent.myAnswers.answer = GapSlider.value();
  }
  //default value
  if(window.parent.myAnswers.answer != 0){
    window.parent.myAnswers.submit = true;
  }

  doText();

  
}


function ThreeCircICA(InitX, Num, Phase) {
   this.speed = 1;
   
   this.display = function(ModulateColor, ColorBack,ColorGap,G,H) {
    
    fill(ColorBack)
    noStroke();
    ellipse(0, 0, DiamOutter, DiamOutter);
    
    fill(ColorGap)
    ellipse(0, 0, DiamInner+GapSlider.value(), DiamInner+GapSlider.value());
  

    fill(ModulateColor);
    ellipse(0, 0, DiamInner, DiamInner);
  }
};



function SineTime(Count, Steps, Scale, Amp, Mean, Freq, Phase) {
    var V;
    V = Scale*(Amp*sin(Freq*2*3.14159*Count/Steps - Phase*3.1415/180) + Mean);
    return V;
  } 

function doText() {
  noStroke();
  fill(255);
  textSize(18);

  text("Value: "+ GapSlider.value(), 50,540);
}
  
  
  
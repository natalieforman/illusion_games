var Count = 0;
var ScreenH = 470;
var ScreenW = 670;
var YDist = 30;
var XDist = 60;
var FR = 60;
var DiamOutter  =5;
var Rows = 4;
var Cols = 4;
var Colony = [];
var colSpot = 1;
var button = 0;


var Yoffset = YDist*3;

function setup() {
  angleMode(DEGREES)
  ellipseMode(CENTER)
  frameRate(FR);
  createCanvas(ScreenW, ScreenH);
  strokeWeight(5)
  background(220);
  var canvas = createCanvas(ScreenW, ScreenH);
  canvas.parent("illusion-holder");
  for (var i = 0; i < Rows*Cols; i++) {
        Colony[i] = new LinesRotate();
    } 
    
  GreenDotFlag = 1;
  YellowDotFlag = 1;

  buttonG = createButton('Clockwise');
  buttonG.position(200, ScreenH-80);
  buttonG.addClass("p5Button");
  buttonG.mousePressed(Clockwise);
  
  buttonY = createButton('Counter Clockwise');
  buttonY.position(300, ScreenH-80);
  buttonY.addClass("p5Button");
  buttonY.mousePressed(Counter);

  buttonN = createButton('Neither');
  buttonN.position(450, ScreenH-80);
  buttonN.addClass("p5Button");
  buttonN.mousePressed(Neither);
}

function draw() {
  var Xpos
  var Y1,Y2
  var Mid = ScreenH/2;
  
  background(220);
  Count = Count+1;
  var X1 =  SineTime(Count, FR*4, XDist, 1, 0, 1, 0);
  var X2 =  SineTime(Count, FR*4, XDist, 1, 0, 1, 180);
  var SZ =  SineTime(Count, FR*4, 5, 1, 0, 1,45)+10;
  var SZ2 = SineTime(Count, FR*4, 5, 1, 0, 1,90)+10;
  for (var i = 0; i < Rows*Cols; i++) {
   Y1 = Mid + (((i%Rows)-2)*Yoffset)-YDist//+SineTime(Count, FR*4, 20, 1, 0, 1, 90);
   Y2 = Mid+ (((i%Rows)-2)*Yoffset) +YDist//+SineTime(Count, FR*4, 20, 1, 0, 1, -90);
   if (i%Rows ===0) { colSpot = colSpot+ 1; } 
   if (colSpot > (Cols)) {colSpot = 1;}
   Colony[i].display(X1+colSpot*ScreenW/(Cols+1),X2 +colSpot*ScreenW/(Cols+1),Y1,Y2,SZ,SZ2)
  }
  
  Count = (Count+1)%(4*FR);

   //if they have answered, set it to the answer
  if(window.parent.myAnswers.submit == true && window.parent.myAnswers.button != true){
    //set color of button clicked
    var buttonSelect = window.parent.myAnswers.answer;
    //console.log(buttonSelect);
    if (buttonSelect == "Clockwise"){
        Clockwise();
    }
    else if(buttonSelect == "Counter Clockwise"){
        Counter();
    }
    else{
      Neither();
    }
    window.parent.myAnswers.button = true;
  }
  //they have pressed a button
  if(window.parent.myAnswers.answer != false){
    window.parent.myAnswers.submit = true;
  }
  
}

function LinesRotate() {
  var Phase;
  var PhaseOffset;
  var Angle;
  var Amp;
  var CX;
  var CY;
  var Frequency;
  var Col;

  this.display = function(X1,X2, Y1, Y2,Rad,Rad2) {
      
      var X1a = X2;
      var X2a = X1;
      
      var Y1a = Y1//+SineTime(Count, FR*4, 20, 1, 0, 1, 90);
      var Y2a = Y2//+SineTime(Count, FR*4, 20, 1, 0, 1, -90);
      
      stroke(130,130,130)
      strokeWeight(2);
      line(X1a,Y1a,X2a,Y2a);
      line(X1,Y1,X2,Y2);
      
      if (YellowDotFlag ==1){
      fill(80,120,164)
      noStroke()
      ellipse(X1,Y1,Rad2,Rad2);
      }
      
      if (GreenDotFlag ==1){
      fill(228,120,128)
      noStroke()
      ellipse(X2,Y2,Rad2,Rad2);
      }
  }
}


 function  SineTime(Ct, Steps, Scale, Amp, Mean, Freq, Phase) 
  {
    var V;
    V = Scale*(Amp*sin(Freq*Ct/Steps*360 - Phase) + Mean);
    return V;
  }

function Clockwise() {
  button = "Clockwise";
  window.parent.myAnswers.answer = button;
  buttonY.removeClass("on");
  buttonG.class("on p5Button");
  buttonN.removeClass("on");
}
function Counter() {
  button = "Counter Clockwise";
  window.parent.myAnswers.answer = button;
  buttonY.class("on p5Button");
  buttonG.removeClass("on");
  buttonN.removeClass("on");
}
function Neither() {
  button = "Neither";
  window.parent.myAnswers.answer = button;
  buttonN.class("on p5Button");
  buttonG.removeClass("on");
  buttonY.removeClass("on");
}
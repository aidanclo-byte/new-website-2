//resizing
const BASE_W = 600;
const BASE_H = 600;
let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;

//prepare stuff
let scene5Started = false
let scene6Started = false
let scene9Started = false
let scene = 0
let img;
let particles = []; // Array to hold all rain particles
let smokeparticles = []; // Array to hold all smoke particles
// movingblonde child scene 0-1 animation
let childX1 = 450
let childY1 = 400
let childMoving = false
let backpackX1
let backpackY1
let backpackMoving = false
let flowerMoving = false
let flowerX1 = 200

// dialogue stuff
let dialogueVisible = false;
let currentDialogue = [];
let dialogueIndex = 0;

// destinations
let childdestinationX
let childdestinationY
let backpackdestinationX
let backpackdestinationY

//sounds
let badrouterain
let cardiacarrest
let enteredbadroute;
let enteredgoodroutescene4;
let goodroutebackgroundsounds;
let scene1womanscream
let stressedheartbeat
let ambulancesiren;
let buttonsound;

// button stuff
let buttonX = 500
let buttonY = 530
let buttonW = 80
let buttonH = 40
//standard setup

const dialogue = {

    0: [
        // scene 0

        //nothing
    ],

    1: [
        // scene 1

        
        "oh no! There’s been a beach accident! A motorized boat has crashed into a family! Let’s evacuate the harmed child and the backpack they’re holding to the ambulance!"

    ],

    2: [
        // scene 2

        "let’s get the child and their backpack from the ambulance to the hospital for triage!"
    ],

    3: [
        // scene 3

        "it’s been determined that they got off quite well for such a deadly accident - only a broken leg. However, they’re having a panic attack from the stress! Choose how the nurse in charge should interact with her! The child is known to have a high risk of heart disease."

    ],

    4: [
        //scene 4

        "you’ve given the child the backpack, and they calmed down enough to be properly treated. They now have a leg cast, and the worst case scenario was avoided. Good job!"
    ],

    5: [
        // scene 5

        "let’s get the child home so she can rest. Her father brought his truck to help carry her home given that she now has a cast. "
    ],

    6: [
        // scene 6

        "unfortunately, not everyone survived. Not everything can be perfectly within a person’s control - the mother did not survive the accident. let’s put some flowers into the garnet red backpack."
    ],

    7: [
        // scene 7

        "THE END OF GOOD ROUTE. Both father and daughter are healthy and brought flowers to the mother’s grave. Please press NEXT to restart the story."
    ],

    8: [
        // scene 8

        "oh no! The child’s panic attack escalated into triggering a heart attack during treatment! She may not survive… The nurse calls for the father to come to the hospital immediately!"
    ],

    9: [
        // scene 9

        "she … did not make it. During the chaos of treatment, her garnet red backpack got lost … at least let the father take her away…"
    ],

    10: [
        // scene 10

        "the father now needs to grieve.  The mother did not survive the accident, and the child did not survive the heart attack. The father is now next to the child’s coffin, mourning."
    ], 

    11: [
        // scene 11
        "THE END OF BAD ROUTE. Only the father survived the boating beach accident; the mother and daughter are dead. Maybe if you restart with the NEXT button, you can prevent this worst-case secnario from occuring? (unlike in real life)"
    ]

};
function setup() {

const sketchDiv = document.getElementById("sketch");

let c = createCanvas(
    sketchDiv.offsetWidth,
    sketchDiv.offsetHeight
);

c.parent("sketch");

// ADD: volume slider hookup
const vol = document.getElementById('vol')
const volVal = document.getElementById('volVal')
if (currentMusic) {
    currentMusic.setVolume(parseFloat(vol.value));
}
volVal.textContent = parseFloat(vol.value).toFixed(2)

vol.addEventListener("input", () => {

    const v = parseFloat(vol.value);
    if (currentMusic) {
        currentMusic.setVolume(v)
    }
    volVal.textContent = v.toFixed(2)
});

// ADD: play/stop button
document.getElementById("toggle-sound").addEventListener("click", () => {

    if (!currentMusic) return
    if (!currentMusic.isPlaying()) {
        currentMusic.play()
        currentMusic.setLoop(true)
    } else {
        currentMusic.stop();

    }

});

//for dialogue 
document.getElementById("dialogue-btn").addEventListener("click", () => {
    showDialogue(scene);
});

}
//particles for rain in scenes 9 and 11
class Particle {
  constructor() {
    this.x = random(-offsetX / scaleFactor, BASE_W + offsetX / scaleFactor);//starting x location
    this.y = random(-offsetY / scaleFactor - 100, -offsetY / scaleFactor) //starting y elevation
    this.vy = random(2, 5); // random vertical velocity (+ is downward, - is upward)
    this.alpha = 255; // full opacity
  }

  update() {
    this.vy += 0.1 //gravity
    this.y += this.vy; // move the particle vertically
    this.alpha -= 2; // fade out
  }

  show() {
    noStroke();
    fill(0,0, 255, this.alpha);
    //noStroke()
    //ellipse(this.x, this.y, 16,50);
    stroke(0,0,255, this.alpha)
    strokeWeight(4)
    line(this.x, this.y, this.x, this.y+10)
  }

  isFinished() {
    return this.alpha <= 0; // Particle is finished when it's fully transparent
    //return this.y > height || this.alpha <=0
  }
}

// particles for smoke in scene 1
class sParticle {
  constructor() {
    this.sx = 500;
    this.sy = 300;
    this.svy = random(-2, -7); // random upward velocity
    this.salpha = 255; // full opacity
  }

  update() {
    this.sy += this.svy; // move the particle upward
    this.salpha -= 5; // fade out
  }

  show() {//draws the particle 
    noStroke();
    fill(128,128,128, this.salpha);//as alpha decreases, more and more transparent
    ellipse(this.sx, this.sy, 16);
    ellipse(this.sx - 50, this.sy +70, 16)
  }

  isFinished() {
    return this.salpha <= 0; // Particle is finished when it's fully transparent
  }
}

function windowResized() {
    const sketchDiv = document.getElementById("sketch");

    resizeCanvas(
        sketchDiv.offsetWidth,
        sketchDiv.offsetHeight
    );
}

function preload(){
  //music
  badrouterain = loadSound('assets/badrouterain.mp3')
  cardiacarrest = loadSound('assets/cardiacarrest.mp3')
  enteredbadroute = loadSound('assets/enteredbadroute.mp3')
  enteredgoodroutescene4 = loadSound('assets/enteredgoodroutescene4.mp3')
  goodroutebackgroundsounds = loadSound('assets/goodroutebackgroundsounds.mp3')
  scene1womanscream = loadSound('assets/scene1womanscream.mp3')
  stressedheartbeat = loadSound('assets/stressedheartbeat.mp3')
  ambulancesiren = loadSound('assets/ambulancesiren.mp3')
  buttonsound = loadSound('assets/buttonsound.mp3')
//images
     img = loadImage('assets/garnetredbackpack.png')
  imgs = loadImage('assets/scene1background.png')
  imgss = loadImage('assets/blondchildMC.png')
  imgnurse = loadImage('assets/goodnurse.png')
  imggc = loadImage('assets/treatedchild.png')
  imgf = loadImage('assets/transparentflowerintro.png')
  imgs6 = loadImage('assets/backgroundofscene6.jpeg')
  imgbf = loadImage('assets/flowersforbackpack.png')
  imgkf = loadImage('assets/kneelingfather.png')
  imgbrn = loadImage('assets/stressednurse.png')
  imghak = loadImage('assets/heartattackkid.png')
  imgdc = loadImage('assets/worried-father-sitting-ill-little-girl-resting-patient-bed-inside-hospital-pediatrics-ward-room-unwell-sick-kid-sleeping-while-uneasy-parent-sitting-beside-her-inside-healthcare-facility_482257-47042.jpg')
   imgcd = loadImage('assets/coffindad.png')     
  imgemoji = loadImage('assets/sad-face-emoji.gif')
  imgfloor = loadImage('assets/hardwoodfloor.png')
}

function sketchMouseX() {
    return (mouseX - offsetX) / scaleFactor;
}

function sketchMouseY() {
    return (mouseY - offsetY) / scaleFactor;
}

//actual painful coding
function draw() {

background(255)
//rescaling 
  

 scaleFactor = min(width / BASE_W, height / BASE_H);

offsetX = (width - BASE_W * scaleFactor) / 2;
offsetY = (height - BASE_H * scaleFactor) / 2;

push();

translate(offsetX, offsetY);
scale(scaleFactor);


  // scenes
  //intro
  if (scene == 0) drawScene0()
    //scene 1 (boating accident)
  else if (scene == 1) drawScene1()
//scene 2 (ambulance drive to hospital)
  else if (scene == 2) drawScene2()
  //scene 3 (decision!)
  else if (scene == 3) drawScene3()
  //scene 4 (begin good route, treated!)
  else if (scene == 4) drawScene4()
    // scene 5 (continue good route, treated child goes to truck)
  else if (scene == 5) drawScene5()
    //scene 6 (continue good route, flowers go to backpack)
  else if (scene == 6) drawScene6()
    //scene 7, end of good route, child and father at cemetery, click on next button to return to start
  else if (scene == 7) drawScene7()
    //scene 8, start of bad route, kid is on table having heart attack. AED flickering (that's the animation), nurse calls for dad 
  else if (scene == 8) drawScene8()
    //scene 9, dead kid is transported to dad truck
  else if (scene == 9) drawScene9()
    //scene 10, dad is next to coffin of child (mother hidden)
  else if (scene == 10) drawScene10()
    //scene 11, end of bad route, dad is mourning next to 2 graves at cemetary, click on next button to return to start
  else if (scene == 11) drawScene11();

  if (scene != 3) {
  drawNextButton()

}
pop()
  if (dialogueVisible) {
push()
    fill(255, 235);
    stroke(0);
    strokeWeight(2);
    rect(20, height-580, width-40, 120, 15);
    noStroke();
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text(
        currentDialogue[dialogueIndex],
        40,
        height-570,
        width-80
    );
pop()
}

}


  function drawScene0() {
  background(255,255,0);
  image(img, -40- offsetX / scaleFactor, 100, 500 + ( offsetX) / scaleFactor, 500);
  image(imgf, 350- offsetX / scaleFactor,100,550 + ( offsetX) / scaleFactor,500)
    
 //text box that says "Backpack, A Short Story"
  strokeWeight(5)
  stroke(148,0,211)
  fill('pink')
  rect(70,100,470,100)
    fill('red')
        textSize(39)
    text("A Garnet Red Backpack,", 100,140)
    text("A Short Story",180,180)

// text box that says "by Aidan L"
  strokeWeight(5)
    stroke(18,97,128)
  fill(0,255,255)
  rect(125,300,350,50)
    fill('blue')
    textSize(38)
    text("By Aidan L", 200,340)

  //text box for disclaimer
  strokeWeight(5)
  stroke(1,68,33)
  fill(143,188,143)
  rect(80,440,480,120)
    fill('green')
    textSize(19)
    text("disclaimer, the story is inspired by the author's real",100,460)
    text("life experience volunteering at the hospital. All ",100,480)
    text("names, locations, and other personal identifiers were ",100,500)
    text("scrubbed. If this story resembles a real-life scenario, ", 100, 520)
    text("it is entirely coincidental.",100,540)
 
}

function drawScene1() {
background(210, 180, 140)
//background skycolor
fill(206, 205, 233);   
rect( -offsetX / scaleFactor, -1000,BASE_W + (2 * offsetX) / scaleFactor, 1300);

// Sand
fill(220, 175, 170)
rect(-offsetX / scaleFactor, 430,BASE_W + (2 * offsetX) / scaleFactor,1000);
  //background beach + boat
  image(imgs, -offsetX / scaleFactor, 0, BASE_W + (2 * offsetX) / scaleFactor, 600)
  //smoke particles for beached boat 
   // add a new particle to the system every frame
  smokeparticles.push(new sParticle());

  // loop through each particle in reverse order
  for (let si = smokeparticles.length - 1; si >= 0; si--) {
    smokeparticles[si].update(); // update the particle's position
   smokeparticles[si].show(); // display the particle

    // remove the particle from the array if it's finished
    if (smokeparticles[si].isFinished()) {
      smokeparticles.splice(si, 1);
    }
  }
//child+backpck moving
  image(img, childX1, childY1, 100, 100)
  image(imgss, childX1, childY1, 100, 100)

  if (childMoving) {
    if (childX1 > childdestinationX) {
      childX1 -= 2
    }

    if (childX1 <= childdestinationX) {
      childX1 = childdestinationX
      childMoving = false
    }
  }
}

function drawScene2() {
     background(135,206,235);
  

  // road + parking lot 
 noStroke()
fill(128, 128, 128);
rect(-offsetX / scaleFactor, 400,
     BASE_W + (2 * offsetX) / scaleFactor,
     1000);
 image(img,childX1, childY1, 100,100)
image (imgss,childX1,childY1,100,100)
  // hospital buildings
 stroke('black')
 strokeWeight(5)
 fill(255,255,255)
 rect (0,100,200,300)
 rect(200,250,200,150)
  
  //hospital sign
  strokeWeight(10)
 stroke('red')
 line(50,175,150,175)
 line(100,125,100,225)

  //hospital doors 
  stroke('red')
  strokeWeight(2)
  fill(255,255,255)
  rect(225,300,150,100)
 line(300,300,300,400)

  //ambulance body
  stroke('red')
  strokeWeight(1)
  fill(255,255,255)
  rect(450,300,100,90)
  //ambulance head
  fill(255,255,255)
  rect(550,350,40,40)
//ambulance wheels
  stroke('grey')
  fill('black')
  circle(575,390,20)
  circle(480,390,20)
  //ambulance side
  strokeWeight(10)
  stroke('red')
  line(475,350,525,350)
  line(500,325,500,375)
  
 // ambulance lights
  
  // Switch every 200 ms
  //discovered floor bc no such thing as too much math in today's world
  let flash = floor(millis() / 200) % 2
noStroke()
  if (flash === 0) {
   // light going red
    fill('red')          
    rect(565, 335, 15,15)
  } else {
// light going blue
    fill(0, 0, 255)
   rect(565, 335, 15,15)
  }
    if (childMoving) {
    if (childX1 > childdestinationX) {
      childX1 -= 1
    }

    if (childX1 <= childdestinationX) {
      childX1 = childdestinationX;
      childMoving = false;
    }
    }
}

function drawScene3() {
    background(255,140,0);
  //options
    strokeWeight(1)
    stroke('black')
    rect(500,330,80,40)
    strokeWeight(0.5)
    stroke('black')
    textSize(12)
    fill('black')
    text('give backpack',500,350)
    fill('white')
    strokeWeight(1)
    stroke('black')
    rect(500,180, 80, 40)
    fill('black')
    strokeWeight(0.5)
    textSize(13)
    text("treat the kid",510,200)

     fill(255,140,0)
    
    //red border for tension
    {strokeWeight(10)
    stroke(255,0,0)}
//meeting tabletop to meet nurse+doctor
  strokeWeight(2)
  fill(65,105,225)
  rect(30,400,300,20)
  
  //meeting table legs
  strokeWeight(10)
    stroke('black')
 line(50,420,50,600)
 line(300,420,300,600)

// dark/garnet red backpack (ellpise)
  fill(164,0,0)
 ellipse(500, 550, 50,100)
 
  
  //red circles/ellipses/lines = extremely nervous/panic attxing MC
  //body
  {
    fill(164,0,0)
  ellipse(100,350,70,130)
  //legs
  line(80,410,80,500)
line(120,410,120,450)
  line(120,450,140,490)
  //arms
  line(70,320,50,240)
  line(130,320,190,250)
  //head
  circle(100,300,80)
  }
  //white circles/ellipse/line = nurse (choice!)
  fill(255,255,255)
  //body
  ellipse(300,360,100,230)
  //legs
  line(270,450,250,600)
  line(320,460,360,600)
  //head
  circle(300,250,80)
  //arms
  line(250,300,230,420)
  line(340,300,390,420) 
//images used
    image(imgnurse, 170,200,200,300)
   image(img,450,500,100,150)
    image(imgss,10,200,200,200)
}
function drawScene4() {
  background(255,228,255)

    
    //green border for "good route" 
    {strokeWeight(10)
    stroke(0,255,0)
 //meeting tabletop to meet nurse+doctor
  {
    {
     stroke('black')
      
    }
  strokeWeight(2)
  fill(65,105,225)
  rect(30,400,300,20)
  
  //meeting table legs
  strokeWeight(10)
 line(50,420,50,600)
  line(300,420,300,600)

  //peach puff circles/ellipses/lines = no longer as nervous, no panic attack MC
  //body
  {
    fill(255,218,185)
  ellipse(100,350,70,130)
  //legs
  line(80,410,80,500)
  line(120,410,120,500)
  //arms
  line(70,320,160,340)
  line(130,320,190,340)
  //head
  circle(100,300,80)
  }

  //dark blue circles/ellipse/line = nurse 
   fill(0,0,128)
  //body
  ellipse(300,360,100,230)
  //legs
  line(270,450,250,600)
  line(320,460,360,600)
  //head
  circle(300,250,80)
  //arms
  line(250,300,230,420)
 line(340,300,390,420)
    
    image(imgnurse, 180,200,200,300)
image(imggc,10,200,200,400)
     image(img,150,300,100,150)
        
//cast on leg
    {noStroke()}
    fill(255,255,255)
    rect(70,450,20,30)
    
    
  }
     
    }
}
function drawScene5() {
     background(255,228,255)
 // road + parking lot 
 noStroke()
 fill(128,128,128)
rect(-offsetX / scaleFactor, 400,
     BASE_W + (2 * offsetX) / scaleFactor, 1000);
  
  //hospital buildings
 stroke('black')
  strokeWeight(5)
  fill(255,255,255)
  rect (0,100,200,300)
  rect(200,250,200,150)
  
 // hospital sign
  strokeWeight(10)
  stroke('red')
  line(50,175,150,175)
  line(100,125,100,225)

 // hospital doors 
  stroke('red')
  strokeWeight(2)
  fill(255,255,255)
  rect(225,300,150,100)
line(300,300,300,400)

 // dad's truck body
  stroke('blue')
  strokeWeight(1)
  fill(0,0,156)
  rect(450,300,100,90)
 // truck head
  fill(0,0,156)
  rect(550,350,40,40)
//truck wheels
  stroke('grey')
  fill('black')
  circle(575,390,20)
 circle(480,390,20)

  //smile - left happy and treated :)
stroke('green')
                  strokeWeight(10)
                  noFill()
line(555,100,555,200)
line(480,100,480,200)
  curve(450,0,450,250,570,250,570,0)
  
  //child + backpack movement 
    
  image(imggc, childX1, childY1, 100, 100)
image(img, childX1, childY1, 50, 50)
  if (childMoving) {
    if (childX1 < childdestinationX) {
      childX1 += 2
    }

    if (childX1 >= childdestinationX) {
      childX1 = childdestinationX
      childMoving = false
    }
  }
}
function drawScene6() {

fill(240,239,235)
rect(-offsetX/scaleFactor, -1000, BASE_W + (2*offsetX)/scaleFactor,1000)
image(
    imgfloor, -offsetX/scaleFactor,0,BASE_W + (2*offsetX)/scaleFactor,1040)
 

  if (!scene6Started) {
  flowerX1 = 200
  flowerdestinationX = 400
  flowerMoving = true
  scene6Started = true
}
  image(imgs6, -offsetX / scaleFactor, 0, BASE_W + (2 * offsetX) / scaleFactor, 640)
  image(imggc,200,300,100,200)
  image(imgbf,flowerX1,200,100,400)
  image(img,400,400,100,200)
  if (flowerMoving) {
    if (flowerX1 < flowerdestinationX) {
      flowerX1 += 2
    } 
    if (flowerX1 >= flowerdestinationX){
      flowerX1 = flowerdestinationX
      flowerMoving = false
    }
    }
  }

function drawScene7() {
     background(255,182,193)

  //hill in cemetery
 fill(124,252,0)
 curve(0,2000,0,500,600,500,500,1000)
 rect(-offsetX / scaleFactor, 450, BASE_W + (2 * offsetX) / scaleFactor, 1000)

  //tree trunk
 fill('brown')
 rect(200,200,50,175)

  //tree leaves
 fill('green')
 circle(200,200,90)
 circle(250,200,90)
 circle(225,180,90)
 circle(200,160,90)
 circle(250,160,90)

  //gravestone of mom
  strokeWeight(4)
  stroke('black')
  fill('grey')
 rect(300,400,40,80)
  
 
  {
  //garnet backpack
 fill(164,0,0)
  ellipse(350,500,30,50)}

  image(imggc,400,450,100,100)
  image(imgkf, 500,450,100,100)
  image(imgbf, 300,450,100,100)
  image(img,300,500,100,100)
}
//begin bad route
function drawScene8() {
      background(255,0,0)
  
  //meeting tabletop to meet nurse+doctor
 stroke('black')
  strokeWeight(2)
 fill(65,105,225)
rect(30,400,300,20)
  
  //meeting table legs
 strokeWeight(10)
 line(50,420,50,600)
 line(300,420,300,600)
  
  //red circles/ellipses/lines = panic attack + heart attack MC
  //body
  {
   fill(164,0,0)
 ellipse(150,370,130,70)
  //legs
 line(210,360,300,400)
 line(210,390,300,400)
  //arm right
 line(130,380,50,240)
  //head
 circle(100,360,80)
    //left arm
   line(140,360,190,250)
  }
  //white circles/ellipse/line = nurse 
 fill(255,255,255)
 // body
 ellipse(400,360,100,230)
  //legs
 line(370,450,350,600)
 line(420,460,460,600)
  //head
 circle(400,250,80)
  //arms
 line(350,300,200,320)
 line(440,300,200,340)
  //child image 
  image(imghak,25,300,200,130)
  //nurse image 
image(imgbrn,50,170,400,300)
  
  //AED
  {
   strokeWeight(5)
   fill(173,255,47)
   rect(180,310,50,50)
    
  }
  
  push()
  //lightning of AED
 line(220,320,200,330)
 line(200,330,210,340)
 line(210,340,190,350)
  //  AED flickering
  // Switch coloring every 200 ms
 
  let flash = floor(millis() / 200) % 2;
noStroke()
  if (flash === 0) {
   // lightning bolt going yellow
    stroke('yellow') 
    line(220,320,200,330)
    line(200,330,210,340)
    line(210,340,190,350)
    
  } else {
// lightning bolt going blue
    stroke('blue')
    line(220,320,200,330)
    line(200,330,210,340)
    line(210,340,190,350)
  pop()
  
  }
}
function drawScene9() {
     background(255,0,0)

 // road + parking lot 
 noStroke()
 fill(128,128,128)
rect(-offsetX / scaleFactor, 400,
     BASE_W + (2 * offsetX) / scaleFactor, 1000);
  
  //hospital buildings
 stroke('black')
  strokeWeight(5)
  fill(255,255,255)
  rect (0,100,200,300)
  rect(200,250,200,150)
  
 // hospital sign
  strokeWeight(10)
  stroke('red')
  line(50,175,150,175)
  line(100,125,100,225)

 // hospital doors 
  stroke('red')
  strokeWeight(2)
  fill(255,255,255)
  rect(225,300,150,100)
line(300,300,300,400)

 // dad's truck body
  stroke('blue')
  strokeWeight(1)
  fill(0,0,156)
  rect(450,300,100,90)
 // truck head
  fill(0,0,156)
  rect(550,350,40,40)
//truck wheels
  stroke('grey')
  fill('black')
  circle(575,390,20)
 circle(480,390,20)

  //rain particles 
   // add a new particle to the system every frame
  particles.push(new Particle());

  // loop through each particle in reverse order
  for (let i = particles.length - 1; i >= 3; i--) {
    particles[i].update(); // update the particle's position
    particles[i].show(); // display the particle

    // remove the particle from the array if it's finished
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
  
  //actual image moving 
image(imgemoji, 400,100,100,100)
  image(imgdc,childX1, childY1, 50, 50)
  if (childMoving) {
    if (childX1 < childdestinationX) {
      childX1 += 2
    }

    if (childX1 >= childdestinationX) {
      childX1 = childdestinationX
      childMoving = false
    }
  }
        
}
function drawScene10() {
  background('red')
  //extended carpet
  fill(90);
rect(-offsetX/scaleFactor,500, BASE_W + (2*offsetX)/scaleFactor, 1000);
  image(imgcd , -offsetX / scaleFactor, 0, BASE_W + (2 * offsetX) / scaleFactor, 600)
     //rain
   // add a new particle to the system every frame
  particles.push(new Particle());

  // loop through each particle in reverse order
  for (let i = particles.length - 1; i >= 1; i--) {
    particles[i].update(); // update the particle's position
    particles[i].show(); // display the particle

    // remove the particle from the array if it's finished
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}
function drawScene11() {
       background(255,0,0)

  //hill in cemetery
 fill(124,252,0)
 curve(0,2000,0,500,600,500,500,1000)
 rect(-offsetX / scaleFactor, 450, BASE_W + (2 * offsetX) / scaleFactor, 1000)


  //tree trunk
 fill('brown')
 rect(200,200,50,175)

  //tree leaves
 fill('green')
 circle(200,200,90)
 circle(250,200,90)
 circle(225,180,90)
 circle(200,160,90)
 circle(250,160,90)

  //gravestone of mom
  strokeWeight(2)
  stroke('black')
  fill('grey')
 rect(300,400,40,80)
  //gravestone of child
  rect(250,400,40,80)

  //kneeling dad
   image(imgkf, 300,450,100,100)

    //rain
   // add a new particle to the system every frame
  particles.push(new Particle());

  // loop through each particle in reverse order
  for (let i = particles.length - 1; i >= 1; i--) {
    particles[i].update(); // update the particle's position
    particles[i].show(); // display the particle

    // remove the particle from the array if it's finished
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}
 
//global Next button in each scene
function drawNextButton() {
  push()
  
//rectangle of button
  fill(255)
  stroke(0)
  strokeWeight(2)
  rect(buttonX, buttonY, buttonW, buttonH)
//text of button
  fill(0)
  noStroke()
  textSize(16)
  text("NEXT", buttonX+buttonH/2, buttonY + buttonH/2 )

  pop()
}


 function drawCursor() {
  strokeWeight(3)
  stroke('black')
  fill('white')
  circle(mouseX, mouseY, 40)
}

//changing music
let currentMusic = null;

function changeMusic(newMusic) {

    if (currentMusic === newMusic) return;

    if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
    }

    currentMusic = newMusic;

    if (currentMusic) {
       currentMusic.setLoop(true);
const vol = document.getElementById("vol");
currentMusic.setVolume(parseFloat(vol.value));
currentMusic.play();
    }
}

function goToScene(newScene) {

    scene = newScene;
    if (newScene == 0) {
        changeMusic(null);
    }
    else if (newScene == 1) {
        changeMusic(scene1womanscream);
    }
    else if (newScene == 2) {
        changeMusic(ambulancesiren)
    }
    else if (newScene == 3) {
        changeMusic(stressedheartbeat)
    }
    else if (newScene == 4) {
        changeMusic(enteredgoodroutescene4)
    }
    else if (
        newScene == 5 ||
        newScene == 6 ||
        newScene == 7
    ) {
        changeMusic(goodroutebackgroundsounds);
    }
    else if (newScene == 8) {
        changeMusic(cardiacarrest)
    }
    else if (
        newScene == 9 ||
        newScene == 10 ||
        newScene == 11
    ) {
        changeMusic(badrouterain)
    }

}
//note, sketchMouse stuff above draw()
  // Check if button was clicked
  function mousePressed() {
    let mx = sketchMouseX();
    let my = sketchMouseY();

    if (dialogueVisible) {
        nextDialogue();
        return;
    }
if (dialogueVisible) {
    nextDialogue();
    return;
}

  if (scene != 3 && !nextClicked()) return;


  // main scene transitions
 if (scene == 0 ) {

    goToScene(1)


childX1 = 450
childY1 = 400

childdestinationX = 250
childdestinationY = 400

childMoving = true
}

  else if (scene == 1) {
    goToScene(2)
        childX1 = 450
childY1 = 350

childdestinationX = 250

childMoving = true
  }

  else if (scene == 2 ) {
    goToScene(3);
  }

  // decision
  else if (scene == 3) {

    // GOOD route
  if (
mx > 500 &&
mx < 580 &&
my > 330 &&
my < 370
) {
goToScene(4)
}
//bad route
   else if (
mx > 500 &&
mx < 580 &&
my > 180 &&
my < 220
) {
goToScene(8)
}

  }

  // good route
 else if (scene == 4) {
  goToScene(5);
//start child at hospital door
  childX1 = 250          
  childY1 = 350
   //end child at truck 
  childdestinationX = 450 
  childMoving = true

  scene5Started = true
}

else if (scene == 5) {

  //advances the  after animation finishes
  if (!childMoving) {
    goToScene(6)
    scene5Started = false
  }

}

  else if (scene == 6) {

  if (!flowerMoving) {
    goToScene(7)
    scene6Started = false
  }

}

    else if (scene == 7) {
      if (
    mx > buttonX &&
    mx < buttonX + buttonW &&
    my > buttonY &&
    my < buttonY + buttonH
  ) {
         
    }
      goToScene(0);
    }
  
  // bad route
    
  
  else if (scene == 8) {
    goToScene(9);
//start at hospital doors
  childX1 = 250         
  childY1 = 350
    //end near truck 
  childdestinationX = 450 
  childMoving = true

  scene9Started = true
}

else if (scene == 9) {

  // advance after animation finishes
  if (!childMoving) {
    if (
    mx > buttonX &&
    mx < buttonX + buttonW &&
    my > buttonY &&
    my < buttonY + buttonH
  )
    goToScene(10)
    scene9Started = false
  }
  }

  else if (scene == 10 ) {
     if (
    mx > buttonX &&
    mx < buttonX + buttonW &&
    my > buttonY &&
    my < buttonY + buttonH
  ) {
  goToScene(11)
  }
    
  }
    else if (scene == 11) {
      if (
    mx > buttonX &&
    mx < buttonX + buttonW &&
    my > buttonY &&
    my < buttonY + buttonH
  ) {
         
    }
      goToScene(0)
  } 
function nextClicked() {
  return (
    mx > buttonX &&
    mx < buttonX + buttonW &&
    my > buttonY &&
    my < buttonY + buttonH
  )
}


  }
//for dialogue when scene changing
  function showDialogue(sceneNumber) {
      if (sceneNumber == 0) return;

    if (!dialogue[sceneNumber]) return;
    currentDialogue = dialogue[sceneNumber];
    dialogueIndex = 0;
    dialogueVisible = true;
}
function nextDialogue() {
    dialogueIndex++;
    if (dialogueIndex >= currentDialogue.length) {
        dialogueVisible = false;
    }
}
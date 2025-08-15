let classifier;
let video;
let resultLabel;
let confidence;

let database;

let img;

let detected;
let loading;

let time;
let loadingTime;
let delay = 2000;
let pageShowingDelay = 8000;

let isProductDetected = false;

// p5 objets
let page_0;
let page_01;
let page_02;
let page_03;
let page_04;
let bar;
let pages = [];
let slideIndex = 0;

function preload() {
  classifier = ml5.imageClassifier(
    "https://teachablemachine.withgoogle.com/models/Dbvw0N8-h/"
  );
  database = loadJSON("database_01.json");
  detected = loadSound("./../audio/correct.mp3");
  loading = loadSound("./../audio/rising-choir.mp3");

  page_0 = select('#page-0');
  page_01 = select('#page-01');
  page_02 = select('#page-02');
  page_03 = select('#page-03');
  page_04 = select('#page-04');
  bar = select('#page-status');

  pages[0] = (page_01);
  pages[1] = (page_02);
  pages[2] = (page_03);
  pages[3] = (page_04);
}

function getResults(result) {
  resultLabel = result[0].label;
  confidence = result[0].confidence;
  console.log(resultLabel, confidence);
}

function classifyVideo() {
  classifier.classify(video, getResults);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  time = millis();
  loadingTime = millis();
}

function draw() {
  background("coral");
  image(video, 0, 0, width, height);

  if (millis() - time >= delay) {
    classifyVideo();
    time = millis();
  }

  fill("white");
  rectMode(CENTER);
  rect(width / 2, height / 2, width, height);
  textSize(32);
  fill("black");

  switchCase(resultLabel);
}

function prodDetected(x) {
  updateHTML(x);
  page_0.addClass('hide');
  textAlign(CENTER);
  text('Detecting Product . .', width / 2, height / 2)

  if (millis() - loadingTime >= pageShowingDelay) {
    for (let i = 0; i < pages.length; i++) {
      pages[i].addClass('hide');
    }
    bar.removeClass('hide');
    bar.addClass('animate-status');
    pages[slideIndex].toggleClass('hide');
    slideIndex++;
    if (slideIndex >= pages.length) {
      slideIndex = 0;
    }
    gsap.fromTo('.animate-status', { width: 0 }, { width: '100%', duration: 8, ease: 'none' });
    loadingTime = millis();
  }

  if (isProductDetected) {
    console.log('Product Detected');
    isProductDetected = false;
  }
}

function resetToWelcome() {
  isProductDetected = false;
  page_0.removeClass('hide');
  bar.addClass('hide');
  slideIndex = 0;
  for (let i = 0; i < pages.length; i++) {
    pages[i].addClass('hide');
  }
  // THIS NEW LINE RESETS THE COLOR
  document.documentElement.style.setProperty('--brand-primary-color', '#96349B');
}

function switchCase(resultLabel) {
  switch (resultLabel) {
    case "dermaCo":
      prodDetected(0);
      break;
    case "TheBodyShop":
      prodDetected(1);
      break;
    case "Minimalist":
      prodDetected(2);
      break;
    case "Brinton":
      prodDetected(3);
      break;
    case "Welcome!":
      console.log('welcome');
      resetToWelcome();
      break;
    case "COSRX":
      prodDetected(4);
      break;
    case "mCaffine_Toner":
      prodDetected(5);
      break;
    case "Minimalist_Niacinamide":
      prodDetected(6);
      break;
    case "mCaffine_Kojic":
      prodDetected(7);
      break;
    case "Pond's":
      prodDetected(8);
      break;
    case "mCaffine_Moisturizer":
      prodDetected(9);
      break;
    case "Cetaphil":
      prodDetected(10);
      break;
    case "Neutrogena":
      prodDetected(11);
      break;
    case "Loreal_serum":
      prodDetected(12);
      break;
    case "mCaffine_aging":
      prodDetected(13);
      break;
    case "Dr_Sheths":
      prodDetected(14);
      break;
    case "Plum":
      prodDetected(15);
      break;
    case "Dot_Key":
      prodDetected(16);
      break;
    case "Loreal_cream":
      prodDetected(17);
      break;
    default:
      resetToWelcome();
      break;
  }
}
/**
 * All application-related variables and functions are encapsulated within this object
 * to prevent polluting the global namespace.
 */
const app = {};

/**
 * Configuration and constants for the application.
 * Using a config object makes it easy to change settings in one place.
 */
const config = {
  modelURL: "https://teachablemachine.withgoogle.com/models/Dbvw0N8-h/",
  databasePath: "./../database_01.json",
  audio: {
    correct: "./../audio/correct.mp3",
    loading: "./../audio/rising-choir.mp3"
  },
  classificationDelay: 2000, // Time in milliseconds between each classification
  pageDisplayDelay: 8000 // Time in milliseconds each product info page is shown
};

/**
 * State management for the application.
 * This object holds all dynamic data and references to DOM elements.
 */
const appState = {
  classifier: null,
  video: null,
  database: null,
  audio: {
    detected: null,
    loading: null
  },
  htmlElements: {
    welcomePage: null,
    productPages: [],
    statusBar: null
  },
  lastClassificationTime: 0,
  lastPageDisplayTime: 0,
  currentDetectedProduct: 'Welcome!', // The label of the currently detected product
  currentPageIndex: 0, // Index for the product info page slideshow
};

/**
 * A lookup table to map detected product labels to their corresponding data index.
 * This replaces the long and repetitive switch statement, making the code cleaner.
 */
const productHandlers = {
  "dermaCo": 0,
  "TheBodyShop": 1,
  "Minimalist": 2,
  "Brinton": 3,
  "COSRX": 4,
  "mCaffine_Toner": 5,
  "Minimalist_Niacinamide": 6,
  "mCaffine_Kojic": 7,
  "Pond's": 8,
  "mCaffine_Moisturizer": 9,
  "Cetaphil": 10,
  "Neutrogena": 11,
  "Loreal_serum": 12,
  "mCaffine_aging": 13,
  "Dr_Sheths": 14,
  "Plum": 15,
  "Dot_Key": 16,
  "Loreal_cream": 17,
  "Welcome!": "reset"
};

/**
 * P5.js Preload function.
 * This is where all assets (ML model, JSON, sounds, etc.) are loaded before setup runs.
 */
function preload() {
  appState.classifier = ml5.imageClassifier(config.modelURL);
  appState.database = loadJSON(config.databasePath);
  appState.audio.detected = loadSound(config.audio.correct);
  appState.audio.loading = loadSound(config.audio.loading);

  // Select all the necessary HTML elements from the DOM
  appState.htmlElements.welcomePage = select('#page-0');
  appState.htmlElements.statusBar = select('#page-status');
  appState.htmlElements.productPages = [
    select('#page-01'),
    select('#page-02'),
    select('#page-03'),
    select('#page-04')
  ];
}

/**
 * P5.js Setup function.
 * This runs once at the beginning to initialize the canvas and video stream.
 */
function setup() {
  createCanvas(windowWidth, 768);
  appState.video = createCapture(VIDEO);
  appState.video.hide();
  appState.lastClassificationTime = millis();
  appState.lastPageDisplayTime = millis();
}

/**
 * P5.js Draw function.
 * This runs on every frame and serves as the main application loop.
 */
function draw() {
  // Draw the video feed as the background
  image(appState.video, 0, 0, width, height);

  // Classify the video feed at regular intervals
  if (millis() - appState.lastClassificationTime >= config.classificationDelay) {
    classifyVideo();
    appState.lastClassificationTime = millis();
  }

  // Display the status text
  fill("white");
  rectMode(CENTER);
  rect(width / 2, height / 2, width, height);
  textSize(32);
  fill("black");
  textAlign(CENTER);
  text('Detecting Product . .', width / 2, height / 2);

  // Update the UI based on the classification result
  updateUI(appState.currentDetectedProduct);
}

/**
 * Starts the image classification process using ml5.js.
 */
function classifyVideo() {
  if (appState.classifier && appState.video) {
    appState.classifier.classify(appState.video, (results, err) => {
      if (err) {
        console.error("Classification error:", err);
        return;
      }
      // Update the state with the new classification result
      appState.currentDetectedProduct = results[0].label;
      console.log(`Detected: ${appState.currentDetectedProduct}, Confidence: ${results[0].confidence}`);
    });
  }
}

// function classifyVideo() {
//   appState.classifier.classify(appState.video, (results, err) => {
//     console.log(results[0].label);
//     appState.currentDetectedProduct = results[0].label;
//   });
// }

/**
 * Updates the UI based on the detected product label.
 * This function handles showing product pages or resetting to the welcome screen.
 * @param {string} label - The label of the product returned by the classifier.
 */
function updateUI(label) {
  // Check if the label exists in our lookup table
  if (productHandlers.hasOwnProperty(label)) {
    const handlerValue = productHandlers[label];
    if (handlerValue === "reset") {
      resetToWelcomeScreen();
    } else {
      showProductInfo(handlerValue);
    }
  } else {
    // If the label is not found, reset the UI
    resetToWelcomeScreen();
  }
}

/**
 * Handles the display of product information pages.
 * @param {number} productIndex - The index for the product data in the database.
 */
function showProductInfo(productIndex) {
  // Calls a function in the main HTML file to update the content
  window.updateHTML(productIndex); 
  
  // Hide the welcome screen
  appState.htmlElements.welcomePage.addClass('hide');
  // appState.htmlElements.statusBar.removeClass('hide');

  // Logic to cycle through product pages with a delay
  if (millis() - appState.lastPageDisplayTime >= config.pageDisplayDelay) {
    // Hide all product pages first
    appState.htmlElements.productPages.forEach(page => page.addClass('hide'));
    
    // Show the next page in the slideshow
    const currentPage = appState.htmlElements.productPages[appState.currentPageIndex];
    if (currentPage) {
      currentPage.removeClass('hide');
    }

    // Show the status bar
    appState.htmlElements.statusBar.removeClass('hide');
    // appState.htmlElements.statusBar.addClass('animate-status');
    
    // Animate the status bar to show progress
    gsap.fromTo('#page-status', 
      { width: 0 }, 
      { width: '100%', duration: (config.pageDisplayDelay / 1000), ease: 'none' }
    );

    // Increment the page index for the next cycle
    appState.currentPageIndex = (appState.currentPageIndex + 1) % appState.htmlElements.productPages.length;
    appState.lastPageDisplayTime = millis();
  }
}

/**
 * Resets the application state and UI back to the welcome screen.
 */
function resetToWelcomeScreen() {
  appState.htmlElements.welcomePage.removeClass('hide');
  appState.htmlElements.statusBar.addClass('hide');
  appState.currentPageIndex = 0;
  
  // Hide all product pages
  appState.htmlElements.productPages.forEach(page => page.addClass('hide'));

  // Reset the brand's primary color
  document.documentElement.style.setProperty('--brand-primary-color', '#96349B');
}
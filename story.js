/* =====================================================================
   STORY.JS — every word in the game lives in this file.

   How to edit:
   - Change any text inside the quotes. Lines auto-wrap in the game,
     so write them however you like.
   - Each [ ... ] list is a conversation. Every "line" is one text box.
   - Start a line with a name ("DANNY: ...") when someone is talking.
   - A photo pop-up looks like:  { photo: "roses", caption: "..." }
     The photo name must match one in PHOTOS just below.
   - Keep the commas between lines, and don't use a plain " inside a
     line (use ' or “ ” instead).
   ===================================================================== */

const PHOTOS = {
  mirror:   "images/mirror.jpg",
  roses:    "images/roses-and-mitsi.jpg",
  post:     "images/dk-post.jpg",
  card:     "images/birthday-card.jpg",
  coloring: "images/coloring-night.jpg",
  words:    "images/word-games.jpg",
  trunk:    "images/trunk.jpg"
};

const STORY = {

  /* ---------- screens and messages used everywhere ---------- */
  ui: {
    titleHeading: "Danny and Katelynn",
    titleText: "ONE YEAR TOGETHER!!! WHAT! Here are my fav memories from the start of us talking :D",
    titleControls: "Use the arrows on your phone to walk. Press A to talk and look at things. There will be a yellow square thing on things you need to interact with.",
    startButton: "Start",

    stageWord: "",
    stageHint: "",
    playButton: "Play",

    exitLocked: "HOL UP! There is shtuff you gotta interact with first",
    allDone: "Lessgo to the next memory, find the exit",

    souvenirLabel: "STOP WHAT UR DOING",
    souvenirNote: "I have a gift for you",
    nextButton: "Next stage",

    finaleLabel: "One year COMPLETE!! MANY TO GO",
    finaleHeading: "Happy anniversary",
    finaleLines: [
      "8/9/2025, was our first date!",
      "10/4/2025, you stayed up till midnight and agreed to let me be your boyfriend",
      "10/4/2026, one year of us together :D"
    ],
    signoff: "I LOVE YOU (more)!!! ~Danny",
    againButton: "Play again",

    foundWord: "Found",
    closePhoto: "Close"
  },

  stages: {

    /* ---------- STAGE 1 ---------- */
    nortons: {
      date: "8/9/2025",
      title: "Norton's at Green Lake",
      caption: "Our first date!! I was so nervous >.<",
      //souvenir: "The stars from the night of our first date",   // "" to skip

      mirror: {
        look: [
          "A mirror. Lemme take a quick check before dinner...",
          { photo: "mirror", caption: "First date ready" },
          "DAMNNNNN!!! I'M FINE AS HAIL!!!"
        ],
        after: ["Still lookin good B)"]
      },
      plate: {
        eat:   ["Dinner time! You dig in.", "YUMMM... but there's way too much food ;-;"],
        after: ["I think I gotta ask the waitress for a to-go bag."]
      },
      waitress: {
        beforeEating: ["WAITRESS: Enjoy your dinner! Let me know if you want a box."],
        giveBag:      ["WAITRESS: All done? Here are your to-go bags!", "You got your TO-GO BAG!"],
        after:        ["WAITRESS: Have a great night, you two!"]
      },
      danny: {
        beforeEating: ["DANNY: I'm a little nervous. First dates, amiright?"],
        afterEating:  ["DANNY: Too full? Same. Let's get these boxed up."],
        afterBag:     ["DANNY: Maybe we should take a stroll at the park?"]
      },
      leaving: ["Wait... does this bag say DANNY?"]
    },

    /* ---------- STAGE 2 ---------- */
    golf: {
      date: "8/23/2025",
      title: "Mini golf",
      caption: "Our second date!! MINI GOLF AWWWW YEAHHHH",
      //souvenir: "A golf ball, to remember your victory.",

      danny: {
        gift: [
          "DANNY: Before we start... these are for you!",
          { photo: "roses", caption: "Yellow roses and Mitsi" },
          "You got YELLOW ROSES and a plushie named MITSI!",
          "DANNY: Now lemme whoop ya butt in some golf"
        ],
        beforeGolf: ["DANNY: You go first. The hole's up top."],
        afterGolf:  ["DANNY: Rematch? PLEASE!!!"]
      },
      post: {
        look: [
          "Something is written on this post...",
          { photo: "post", caption: "D + K" },
          "D + K looks good together i think <3"
        ]
      },
      hole: {
        putt:  ["You line up your putt...", "Plunk! Right in the hole.", "Danny takes... seven strokes.", "Final score: you 2, Danny 7. You win!"],
        after: ["The scene of your victory."]
      }
    },

    /* ---------- STAGE 3 ---------- */
    margaritas: {
      date: "8/30/2025",
      title: "Margaritas",
      caption: "My first time staying over at your place. Getting Margaritas down the road.",
      //souvenir: "",   // add the taco night token here

      tacos: {
        eat:   ["A plate of tacos!", "NAM NAM NAM NAM", "BUSSSSSSSSSSSSSSSSSS"],
        after: ["Just crumbs left, dat shi good"]
      },
      danny: {
        beforeTacos: ["DANNY: *sips an enormous blue drink*", "DANNY: First time staying over AND tacos? THIS IS AMAZING"],
        afterTacos:  ["DANNY: Okay, you were right about this place. SO GOOD"]
      },
      // plays when she walks out the door
      leaving: [
        "Later, back at your place...",
        { photo: "words", caption: "Connections after tacos" },
        "DANNY: How are u so good at this..."
      ]
    },

    /* ---------- STAGE 4 ---------- */
    birthday: {
      date: "9/6/2025",
      title: "Your birthday",
      caption: "24 YEARS OLD! Got you some red velvet cake, a couple cards, and spent the whole day wit my baby",
      //souvenir: "A slice of red velvet cake.",

      cake: {
        blowOut: ["A red velvet cake, just for me?!?!", "Lemme make a wish...", "Fwoosh! You blew out the candles!"],
        after:   ["Red velvet. My fav cake ^.^ time to dig in"]
      },
      card: {
        open: [
          "A card and a gift card!",
          { photo: "card", caption: "Enjoy the day" },
          "Enjoy the day? Don't mind if I do B)"
        ]
      },
      danny: {
        beforeCake: ["DANNY: Happy birthday, Katelynn!", "DANNY: Go blow out your candles!"],
        afterCake:  ["DANNY: Did you make a good wish?", "DANNY: DON'T TELL ME!! I want it to come true!!"]
      }
    },

    /* ---------- STAGE 5 ---------- */
    coloring: {
      date: "9/27/2025",
      title: "Coloring night",
      caption: "Your first time staying over at my place. A brown hoodie, a blue blanket, and colored pencils.",
      //souvenir: "A coloring book of your own.",

      hoodie: {
        putOn: ["Danny's brown hoodie.", "It looks so cozy... imma put it on.", "Perfect fit. AND DANGGGGG I LIKE GOOD!!"],
        after: ["This hoodie is all mine."]
      },
      coloringTray: {
        notComfy: ["Colored pencils and a coloring page!", "But it's kinda cold, I should get comfy first..."],
        color: [
          "You curl up on the blanket and color for hours.",
          { photo: "coloring", caption: "Coloring night" },
          "A masterpiece."
        ],
        after: ["Your masterpiece. Fridge-worthy."]
      },
      danny: {
        beforeColoring: ["DANNY: Make yourself at home."],
        afterColoring:  ["DANNY: Let's go cuddle up now."]
      }
    },

    /* ---------- STAGE 6 ---------- */
    trunk: {
      date: "10/4/2025",
      title: "The question",
      caption: "We should go grab something from my trunk...",
      souvenir: "",

      danny: {
        before: ["DANNY: Hey... could you grab something out of my trunk for me?"],
        after:  ["DANNY: WOOOOOOOOOHOOOOOOOOOOOOOOOOOOOO"]
      },
      trunk: {
        open: [
          "The trunk is... glowing?",
          "You open it...",
          { photo: "trunk", caption: "October 4th, 2025" }
        ],
        question: "KATELYNN, WILL YOU BE MY GIRLFRIEND?",
        yesButton: "Yes",
        noButtons: ["No", "Are you sure?", "PLEASE"],
        afterYes: ["You said YES!", "DANNY: WOOOOOOOOHOOOOOOOOOOOOOOOO"],
        after: ["Balloons, fairy lights, roses... and the best yes ever :D"]
      }
    }
  }
};

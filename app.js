const state = {
  journey: null,
  qIndex: 0,
  answers: {},
  score: 0,
  purchased: null
};

const questions = {

  wedding: [
    {
      key: "date",
      title: "When is your wedding?",
      hint: "Pick a date, or tell us it's not decided yet.",
      type: "date"
    },
    {
      key: "guests",
      title: "How many guests are you expecting?",
      type: "options",
      options: [
        "Under 100",
        "100–250",
        "250–500",
        "500+"
      ]
    },
    {
      key: "budget",
      title: "What's your approximate budget?",
      type: "options",
      options: [
        "Under ₹2 lakh",
        "₹2–5 lakh",
        "₹5–10 lakh",
        "₹10–25 lakh",
        "₹25 lakh+"
      ]
    },
    {
      key: "stage",
      title: "Where are you in the planning process?",
      type: "options",
      options: [
        "Just starting",
        "Venue searching",
        "Vendors searching",
        "Most things booked",
        "Final preparations"
      ]
    },
    {
      key: "focus",
      title: "What matters most right now?",
      type: "options",
      options: [
        "Budget",
        "Vendors",
        "Guest management",
        "Timeline",
        "Everything"
      ]
    }
  ],

  pregnancy: [
    {
      key: "stage",
      title: "What stage are you currently in?",
      type: "options",
      options: [
        "Preparing for pregnancy",
        "Pregnant",
        "Preparing for hospital",
        "Preparing for baby"
      ]
    },
    {
      key: "deliveryMonth",
      title: "Expected month of delivery?",
      type: "month"
    },
    {
      key: "bag",
      title: "Have you started preparing your hospital bag?",
      type: "options",
      options: [
        "Yes",
        "Partly",
        "Not yet"
      ]
    },
    {
      key: "docs",
      title: "Are your important documents organized?",
      type: "options",
      options: [
        "Yes",
        "Partly",
        "Not yet"
      ]
    },
    {
      key: "focus",
      title: "What do you want help organizing?",
      type: "options",
      options: [
        "Hospital bag",
        "Baby essentials",
        "Documents",
        "Transport/contact plan",
        "Everything"
      ]
    }
  ],

  astrology: [
    {
      key: "dob",
      title: "What is your date of birth?",
      type: "date"
    },
    {
      key: "birthTime",
      title: "What is your birth time?",
      type: "time"
    },
    {
      key: "birthplace",
      title: "Where were you born?",
      hint: "City or town.",
      type: "text",
      placeholder: "e.g. Amritsar"
    },
    {
      key: "focus",
      title: "What are you interested in?",
      type: "options",
      options: [
        "Marriage",
        "Family",
        "Career",
        "Business",
        "General traditional astrology"
      ]
    },
    {
      key: "auspicious",
      title: "Do you want to explore auspicious-date information?",
      type: "options",
      options: [
        "Yes",
        "No"
      ]
    }
  ]

};


function $(id) {
  return document.getElementById(id);
}


function showScreen(n) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => screen.classList.remove("active"));

  $("screen" + n).classList.add("active");

  $("resetBtn").classList.toggle("hidden", n === 1);

  if (n === 3) {
    renderQuestion();
  }

  if (n === 4) {
    renderResult();
  }

  if (n === 5) {
    renderPlan();
  }

  if (n === 7) {
    renderSaved();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function goHome() {
  showScreen(1);
}


function resetApp() {

  if (confirm("Start over and clear this plan?")) {

    localStorage.removeItem("lifepathState");

    location.reload();

  }

}


function chooseJourney(journey) {

  state.journey = journey;

  state.qIndex = 0;

  state.answers = {};

  state.purchased = null;

  showScreen(3);

}


function renderQuestion() {

  const qs = questions[state.journey];

  const q = qs[state.qIndex];

  $("stepLabel").textContent =
    `STEP 2 OF 4 • ${state.qIndex + 1}/${qs.length}`;

  $("progressBar").style.width =
    ((state.qIndex + 1) / qs.length * 100) + "%";

  $("questionTitle").textContent = q.title;

  $("questionHint").textContent = q.hint || "";

  const area = $("questionArea");

  area.innerHTML = "";


  if (q.type === "options") {

    const wrap = document.createElement("div");

    wrap.className = "option-list";


    q.options.forEach(option => {

      const button = document.createElement("button");

      button.className =
        "option" +
        (state.answers[q.key] === option
          ? " selected"
          : "");

      button.textContent = option;

      button.onclick = function () {

        state.answers[q.key] = option;

        renderQuestion();

      };

      wrap.appendChild(button);

    });


    area.appendChild(wrap);

  } else {

    const field = document.createElement("div");

    field.className = "field";


    const input = document.createElement("input");

    input.type =
      q.type === "month"
        ? "month"
        : q.type === "time"
          ? "time"
          : q.type === "date"
            ? "date"
            : "text";

    input.placeholder = q.placeholder || "";

    input.value = state.answers[q.key] || "";

    input.oninput = function () {

      state.answers[q.key] = input.value;

    };


    field.appendChild(input);

    area.appendChild(field);


    if (q.type === "date" && q.key === "date") {

      const button = document.createElement("button");

      button.className = "secondary full";

      button.textContent = "Not decided yet";

      button.onclick = function () {

        state.answers[q.key] = "Not decided";

        nextQuestion();

      };

      area.appendChild(button);

    }

  }

}


function nextQuestion() {

  const q =
    questions[state.journey][state.qIndex];

  if (!state.answers[q.key]) {

    toast("Please answer this question first.");

    return;

  }


  if (
    state.qIndex <
    questions[state.journey].length - 1
  ) {

    state.qIndex++;

    renderQuestion();

  } else {

    save();

    showScreen(4);

  }

}


function prevQuestion() {

  if (state.qIndex > 0) {

    state.qIndex--;

    renderQuestion();

  } else {

    showScreen(2);

  }

}


function calcScore() {

  const answers = state.answers;


  if (state.journey === "wedding") {

    let score =
      {
        "Just starting": 30,
        "Venue searching": 45,
        "Vendors searching": 60,
        "Most things booked": 80,
        "Final preparations": 90
      }[answers.stage] || 30;


    if (answers.guests) {

      score +=
        answers.guests === "500+"
          ? 2
          : 4;

    }


    if (answers.budget) {

      score += 4;

    }


    if (answers.focus === "Everything") {

      score -= 3;

    }


    return Math.max(
      0,
      Math.min(100, score)
    );

  }


  if (state.journey === "pregnancy") {

    let score = 0;


    if (answers.bag === "Yes") {

      score += 20;

    } else if (answers.bag === "Partly") {

      score += 10;

    }


    if (answers.docs === "Yes") {

      score += 20;

    } else if (answers.docs === "Partly") {

      score += 10;

    }


    if (answers.focus === "Everything") {

      score += 20;

    } else {

      score += 10;

    }


    if (
      answers.stage ===
      "Preparing for hospital"
    ) {

      score += 20;

    }


    if (
      answers.stage ===
      "Preparing for baby"
    ) {

      score += 15;

    }


    return Math.min(100, score);

  }


  return answers.dob && answers.birthplace
    ? 75
    : 55;

}


function journeyName() {

  return {

    wedding: "Wedding",

    pregnancy: "Baby Preparation",

    astrology: "Astrology"

  }[state.journey];

}


function renderResult() {

  state.score = calcScore();


  const journey = state.journey;


  if (journey === "wedding") {

    $("resultTitle").textContent =
      "Your Wedding Readiness";

    $("resultSubtitle").textContent =
      "A quick planning snapshot based on your answers.";

  }


  if (journey === "pregnancy") {

    $("resultTitle").textContent =
      "Your Preparation Status";

    $("resultSubtitle").textContent =
      "An organization snapshot — not a medical assessment.";

  }


  if (journey === "astrology") {

    $("resultTitle").textContent =
      "Your Personal Astro Plan";

    $("resultSubtitle").textContent =
      "Traditional astrology-oriented planning based on the details you provided.";

  }


  $("scoreValue").textContent =
    journey === "astrology"
      ? "★"
      : state.score + "%";


  const body = $("resultBody");


  if (journey === "wedding") {

    const tasks = [

      "Confirm or review venue",

      "Shortlist photographer",

      "Confirm guest estimate",

      "Review budget",

      "Start invitations"

    ];


    body.innerHTML = `

      <div class="result-card">

        <h3>Priority this week</h3>

        ${tasks.slice(0,3).map(
          (task,index) => `

          <div class="task">

            <b>${index + 1}</b>

            <span>${task}</span>

          </div>

        `
        ).join("")}

      </div>


      <div class="result-card">

        <h3>Planning areas</h3>

        <div class="status-grid">

          ${[
            "Venue",
            "Guests",
            "Photography",
            "Makeup",
            "Invitations",
            "Transport"
          ].map(
            (item,index) => `

            <div class="status">

              <span>${item}</span>

              <strong>
                ${
                  index <
                  Math.round(state.score / 18)
                    ? "On track"
                    : "Needs attention"
                }
              </strong>

            </div>

          `
          ).join("")}

        </div>

      </div>

    `;

  }


  else if (journey === "pregnancy") {

    const missing = [];


    if (state.answers.bag !== "Yes") {

      missing.push("Hospital bag");

    }


    if (state.answers.docs !== "Yes") {

      missing.push("Important documents");

    }


    missing.push(
      "Baby essentials",
      "Transport/contact plan"
    );


    body.innerHTML = `

      <div class="result-card">

        <h3>Still to organize</h3>

        ${missing.slice(0,4).map(
          item => `

          <div class="task">

            <b>☐</b>

            <span>${item}</span>

          </div>

        `
        ).join("")}

      </div>


      <div class="notice">

        This app is for organization and preparation only.

        For medical questions, follow guidance from
        your qualified healthcare professional.

      </div>

    `;

  }


  else {

    body.innerHTML = `

      <div class="result-card">

        <h3>Your selected focus</h3>

        <p>
          ${state.answers.focus ||
          "General traditional astrology"}
        </p>

      </div>


      <div class="result-card">

        <h3>What you can explore</h3>

        <div class="task">

          <b>✦</b>

          <span>
            Traditional astrology information
          </span>

        </div>


        <div class="task">

          <b>✦</b>

          <span>
            Compatibility information
          </span>

        </div>


        <div class="task">

          <b>✦</b>

          <span>
            Auspicious-date planning information
          </span>

        </div>

      </div>


      <div class="notice">

        Astrology content is presented for
        traditional/cultural and entertainment
        purposes, not as scientific prediction
        or professional advice.

      </div>

    `;

  }

}


function renderPlan() {

  $("planTitle").textContent =
    `Your ${journeyName()} Plan`;


  const lists = {

    wedding: [

      "Review your guest estimate",

      "Confirm key vendors",

      "Check your budget",

      "Update your wedding timeline",

      "Prepare invitation list"

    ],


    pregnancy: [

      "Organize hospital bag",

      "Gather important documents",

      "Prepare baby essentials",

      "Create a transport/contact plan",

      "Save your preparation checklist"

    ],


    astrology: [

      "Review your selected focus",

      "Explore traditional astrology information",

      "Save any dates you want to research",

      "Keep your birth details available",

      "Review your personalized report"

    ]

  };


  $("planBody").innerHTML = `

    <div class="result-card">

      <h3>This week</h3>

      ${lists[state.journey].map(
        item => `

        <div class="task">

          <b>☐</b>

          <span>${item}</span>

        </div>

      `
      ).join("")}

    </div>


    <div class="result-card">

      <h3>Your answers</h3>

      ${Object.entries(state.answers).map(
        ([key,value]) => `

        <div class="task">

          <b>•</b>

          <span>

            <strong>${pretty(key)}:</strong>

            ${value}

          </span>

        </div>

      `
      ).join("")}

    </div>

  `;

}


function pretty(key) {

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, letter =>
      letter.toUpperCase()
    );

}


function purchase(type) {

  state.purchased = type;

  save();


  toast(
    type === "complete"
      ? "Complete Plan unlocked in this demo."
      : "Quick Report unlocked in this demo."
  );


  setTimeout(
    () => showScreen(7),
    700
  );

}


function renderSaved() {

  $("savedTitle").textContent =
    `Your ${journeyName()} Plan`;


  const product =
    state.purchased === "complete"
      ? "Complete Plan"
      : state.purchased === "quick"
        ? "Quick Report"
        : "Free Plan";


  const priorities = {

    wedding: [
      "Review vendors",
      "Check budget",
      "Update guest list"
    ],

    pregnancy: [
      "Hospital bag",
      "Documents",
      "Baby essentials"
    ],

    astrology: [
      "Review your selected focus",
      "Explore traditional information",
      "Save planning dates"
    ]

  };


  $("savedBody").innerHTML = `

    <div class="saved-section">

      <h3>✓ ${product}</h3>

      <p>
        Your plan is saved on this device.
      </p>

    </div>


    <div class="saved-section">

      <h3>Priority</h3>

      <ul>

        ${priorities[state.journey].map(
          item => `<li>${item}</li>`
        ).join("")}

      </ul>

    </div>


    <div class="saved-section">

      <h3>Journey</h3>

      <p>

        ${journeyName()} •

        ${
          state.journey === "astrology"
            ? "Traditional focus"
            : "Score " + state.score + "%"
        }

      </p>

    </div>

  `;

}


function shareText() {

  return (

    `My LifePath ${journeyName()} plan is ready. ` +

    (

      state.journey === "astrology"

        ? "Traditional astrology planning."

        : "My preparation score is " +
          state.score +
          "%."

    )

  );

}


async function shareResult() {

  const text = shareText();


  if (navigator.share) {

    try {

      await navigator.share({

        title: "LifePath",

        text: text

      });

    }

    catch (error) {}

  }

  else {

    if (navigator.clipboard) {

      await navigator.clipboard.writeText(text);

    }

    toast("Result copied to clipboard.");

  }

}


async function sharePlan() {

  const text =

    `LifePath — ${journeyName()} Plan\n\n` +

    shareText() +

    `\n\nCreated with LifePath.`;


  if (navigator.share) {

    try {

      await navigator.share({

        title: "My LifePath Plan",

        text: text

      });

    }

    catch (error) {}

  }

  else {

    if (navigator.clipboard) {

      await navigator.clipboard.writeText(text);

    }

    toast("Plan copied to clipboard.");

  }

}


function editAnswers() {

  state.qIndex = 0;

  showScreen(3);

}


function startAnother() {

  state.qIndex = 0;

  state.answers = {};

  state.purchased = null;

  showScreen(2);

}


function save() {

  localStorage.setItem(
    "lifepathState",
    JSON.stringify(state)
  );

}


function toast(message) {

  const element = $("toast");

  element.textContent = message;

  element.classList.add("show");


  setTimeout(
    () => element.classList.remove("show"),
    2200
  );

}


(function init() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem("lifepathState")
      );


    if (saved && saved.journey) {

      Object.assign(state, saved);

    }

  }

  catch (error) {

    console.log("No saved LifePath plan.");

  }

})();

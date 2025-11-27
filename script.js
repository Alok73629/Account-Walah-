// Dark/Light Mode Toggle
const modeToggle = document.getElementById('mode-toggle');
if(modeToggle){
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
  });
}

// AI Doubt Solver (Dummy for all pages)
function initAIDoubtSolver(inputId, btnId, answerId){
  const btn = document.getElementById(btnId);
  if(btn){
    btn.addEventListener('click', () => {
      const question = document.getElementById(inputId).value;
      const answerDiv = document.getElementById(answerId);
      if(question.trim()===""){ answerDiv.textContent="Please type a doubt first!"; return; }
      answerDiv.textContent = `AI Answer: Your doubt "${question}" will be solved soon.`;
    });
  }
}

// Initialize Class11
initAIDoubtSolver('doubt-input-11','solve-btn-11','doubt-answer-11');
// Initialize Class12
initAIDoubtSolver('doubt-input-12','solve-btn-12','doubt-answer-12');

// Auto-Checking Test System & Leaderboard
function initAutoTest(startBtnId, containerId, classId, chapterQuestions){
  const startBtn = document.getElementById(startBtnId);
  if(!startBtn) return;
  startBtn.addEventListener('click',()=>{
    const container = document.getElementById(containerId);
    let chapters = chapterQuestions;
    let currentChapter = Object.keys(chapters)[0];
    let currentQuestion=0, score=0, questions=chapters[currentChapter];

    function showQuestion(){
      if(currentQuestion>=questions.length){
        saveScore(currentChapter,score,classId);
        displayLeaderboard(currentChapter,classId);
        container.innerHTML += `<p>${currentChapter} Completed! Score: ${score}/${questions.length}</p>
          <button id="next-chapter-${classId}">Next Chapter</button>
          <button id="retake-test-${classId}">Retake</button>`;
        document.getElementById(`next-chapter-${classId}`).addEventListener('click',()=>{
          const chaptersArray = Object.keys(chapters);
          const nextIndex = chaptersArray.indexOf(currentChapter)+1;
          if(nextIndex<chaptersArray.length){
            currentChapter = chaptersArray[nextIndex]; questions=chapters[currentChapter]; currentQuestion=0; score=0; showQuestion();
          } else { container.innerHTML+="<p>All chapters done!</p>"; }
        });
        document.getElementById(`retake-test-${classId}`).addEventListener('click',()=>{currentQuestion=0; score=0; showQuestion();});
        return;
      }
      const q = questions[currentQuestion];
      container.innerHTML = `<div class="question-card"><h3>${currentChapter} - ${q.question}</h3>
        <ul class="options">${q.options.map((opt,i)=>`<li><button class="option-btn" data-index="${i}">${opt}</button></li>`).join('')}</ul></div>`;
      document.querySelectorAll('.option-btn').forEach(btn=>{btn.addEventListener('click',e=>{if(parseInt(e.target.dataset.index)===q.answer) score++; currentQuestion++; showQuestion();});});
    }
    showQuestion();
  });
}

// Leaderboard functions
function saveScore(chapter,score,classId){
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
  if(!leaderboard[classId]) leaderboard[classId]={};
  if(!leaderboard[classId][chapter]) leaderboard[classId][chapter]=[];
  leaderboard[classId][chapter].push({score:score,date:new Date().toLocaleString()});
  leaderboard[classId][chapter].sort((a,b)=>b.score-a.score);
  leaderboard[classId][chapter] = leaderboard[classId][chapter].slice(0,10);
  localStorage.setItem('leaderboard',JSON.stringify(leaderboard));
}

function displayLeaderboard(chapter,classId){
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
  const container = document.getElementById(`test-container-${classId}`);
  if(!leaderboard[classId] || !leaderboard[classId][chapter]) return;
  let html = `<h3>Leaderboard - ${chapter}</h3><ol>`;
  leaderboard[classId][chapter].forEach(entry=>{html+=`<li>Score: ${entry.score} - ${entry.date}</li>`;});
  html += "</ol>";
  container.innerHTML += html;
}

// Initialize tests
initAutoTest('start-test-11','test-container-11','11',{
  "Chapter 1":[
    {question:"What is Accounting?", options:["System of recording","Cooking","Sport","None"],answer:0},
    {question:"Which is an asset?", options:["Cash","Liability","Expense","Revenue"],answer:0}
  ],
  "Chapter 2":[
    {question:"Capital means?", options:["Owner's Investment","Debt","Revenue","Liability"],answer:0}
  ]
});
initAutoTest('start-test-12','test-container-12','12',{
  "Chapter 1":[
    {question:"What is Capital Reserve?", options:["Profit kept for future use","Debt","Revenue","Liability"],answer:0},
    {question:"Which is an intangible asset?", options:["Patent","Cash","Stock","Building"],answer:0}
  ],
  "Chapter 2":[
    {question:"Share Capital is?", options:["Funds from shareholders","Loan","Revenue","Expense"],answer:0}
  ]
});
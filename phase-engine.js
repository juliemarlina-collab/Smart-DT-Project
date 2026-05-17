/**
 * Smart DT Project V3 — js/phase-engine.js
 * ─────────────────────────────────────────────────────────────────
 * Handles everything inside a phase page:
 *   Tab switching  ·  Quiz runner  ·  Template form save/restore
 *   Phase submission  ·  Supervisor gate  ·  AI Coach
 *
 * HOW TO LOAD (just before </body>, in this exact order):
 *   <script src="js/data.js"></script>
 *   <script src="js/ui.js"></script>
 *   <script src="js/phase-engine.js"></script>
 *
 * HOW TO USE on each phase page (inline script after the above):
 *   <script>
 *     window.addEventListener('load', function () {
 *       PhaseEngine.init({
 *         phaseNum:  1,
 *         namespace: 'df_p01_',
 *         hasGate:   false,
 *         gateNum:   0,
 *         sheetUrl:  'YOUR_APPS_SCRIPT_URL',
 *       });
 *     });
 *   </script>
 *
 * ARCHITECTURE — why an IIFE?
 *   Wrapping everything in an IIFE (Immediately Invoked Function
 *   Expression) means window.PhaseEngine is set the moment the file
 *   finishes executing. Nothing inside the IIFE can prevent the
 *   export from happening — it is the last line of the IIFE.
 *   No 'PhaseEngine is not defined' errors.
 * ─────────────────────────────────────────────────────────────────
 */

(function (global, doc) {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     SECTION 1 — QUIZ DATA
     5 questions per phase · 4 options each · correctIndex is 0-based
     ═══════════════════════════════════════════════════════════════ */

  var QUIZ_DATA = {

    /* ── Phase 01 Empathy ─────────────────────────────────────── */
    1: [
      {
        question:     'What is the MAIN goal of the Empathy phase?',
        options:      [
          'To design the final solution quickly',
          'To understand users\' real feelings, needs and experiences',
          'To test the prototype with users',
          'To select the best idea from brainstorming',
        ],
        correctIndex: 1,
      },
      {
        question:     'Should you already know the solution BEFORE interviewing users?',
        options:      [
          'Yes — it saves time during interviews',
          'Yes — the lecturer already knows the answer',
          'No — keep an open mind and let users guide you',
          'No — only if the project is technical',
        ],
        correctIndex: 2,
      },
      {
        question:     'Which is the BEST interview question for Empathy research?',
        options:      [
          'Do you like the current canteen system? Yes or No?',
          'Would you prefer option A or option B?',
          'Tell me about your experience using the canteen during peak hours.',
          'How many times do you visit the canteen per week?',
        ],
        correctIndex: 2,
      },
      {
        question:     'Is interviewing ONE person enough for the Empathy phase?',
        options:      [
          'Yes — one deep interview is sufficient',
          'No — interview at least 3 users to find patterns',
          'Yes — if the person is an expert',
          'No — you need at least 20 people',
        ],
        correctIndex: 1,
      },
      {
        question:     'Which tool maps what a user SAYS, THINKS, DOES and FEELS?',
        options:      [
          'SCAMPER sheet',
          'Idea Selection Matrix',
          'User Feedback Form',
          'Empathy Map — the 4-quadrant visual tool',
        ],
        correctIndex: 3,
      },
    ],

    /* ── Phase 02 Define ──────────────────────────────────────── */
    2: [
      {
        question:     'What is the MAIN output of the Define phase?',
        options:      [
          'A working prototype',
          'A list of 20 ideas',
          'A clear user-centred problem statement based on research',
          'A final reflection on the project',
        ],
        correctIndex: 2,
      },
      {
        question:     'Should the problem statement include a solution?',
        options:      [
          'Yes — the solution helps focus the problem',
          'No — define the problem only, never the solution',
          'Yes — if the solution is obvious',
          'No — only if the supervisor agrees',
        ],
        correctIndex: 1,
      },
      {
        question:     'Which HMW (How Might We) question is correctly formatted?',
        options:      [
          'How might we build a mobile app for students?',
          'How might we fix the canteen queue problem?',
          'How might we help students eat lunch faster on campus?',
          'How might we redesign the whole canteen system?',
        ],
        correctIndex: 2,
      },
      {
        question:     'Can you skip Define if Empathy was thorough enough?',
        options:      [
          'Yes — Empathy already covers problem definition',
          'No — Empathy and Define serve different purposes',
          'Yes — if you already have a good idea',
          'No — only if the supervisor asks for it',
        ],
        correctIndex: 1,
      },
      {
        question:     'What should a good problem statement focus on?',
        options:      [
          'The technology stack to be used',
          'The budget and timeline',
          'The team member strengths',
          'The user\'s need and the insight behind it',
        ],
        correctIndex: 3,
      },
    ],

    /* ── Phase 03 Ideation ────────────────────────────────────── */
    3: [
      {
        question:     'What is the golden rule of brainstorming?',
        options:      [
          'Only write down practical ideas',
          'No judging or evaluating ideas during the session',
          'The team leader chooses the best idea immediately',
          'Always start with the most expensive idea',
        ],
        correctIndex: 1,
      },
      {
        question:     'Should you stop when you find your FIRST good idea?',
        options:      [
          'Yes — act on it immediately',
          'Yes — one great idea is enough',
          'No — push for 20+ ideas before evaluating',
          'No — only if the supervisor disagrees',
        ],
        correctIndex: 2,
      },
      {
        question:     'What does the S in SCAMPER stand for?',
        options:      [
          'Simplify — make the idea simpler',
          'Substitute — replace or swap a part of the solution',
          'Share — present the idea to the class',
          'Scale — make the idea bigger',
        ],
        correctIndex: 1,
      },
      {
        question:     'Does the Idea Selection Matrix use gut feelings to choose ideas?',
        options:      [
          'Yes — gut feeling is the most important factor',
          'Yes — if the whole team agrees',
          'No — it uses objective criteria with numerical scores',
          'No — only the supervisor can decide',
        ],
        correctIndex: 2,
      },
      {
        question:     'What is the correct order for the Ideation phase?',
        options:      [
          'Select → Brainstorm → SCAMPER → Justify',
          'SCAMPER → Brainstorm → Select → Justify',
          'Brainstorm → Select → SCAMPER → Justify',
          'Brainstorm → SCAMPER → Select → Justify',
        ],
        correctIndex: 3,
      },
    ],

    /* ── Phase 04 Prototype ───────────────────────────────────── */
    4: [
      {
        question:     'What type of prototype should students build FIRST?',
        options:      [
          'A polished high-fidelity digital prototype',
          'A working coded mobile app',
          'A low-fidelity rough sketch or paper prototype',
          'A 3D-printed physical model',
        ],
        correctIndex: 2,
      },
      {
        question:     'Must the prototype be polished before testing with users?',
        options:      [
          'Yes — users will not take rough prototypes seriously',
          'No — rough prototypes generate the most honest feedback',
          'Yes — the supervisor requires a polished version',
          'No — only if time is limited',
        ],
        correctIndex: 1,
      },
      {
        question:     'What is the MAIN purpose of building a prototype?',
        options:      [
          'To impress the supervisor with design skills',
          'To have something to present at the end of the semester',
          'To test the idea and learn from real user feedback',
          'To demonstrate technical programming ability',
        ],
        correctIndex: 2,
      },
      {
        question:     'If a prototype fails during testing, has the project failed?',
        options:      [
          'Yes — the team should restart from the beginning',
          'Yes — a failed prototype means a failed project',
          'No — failure reveals problems, which is the whole point',
          'No — only if the supervisor says so',
        ],
        correctIndex: 2,
      },
      {
        question:     'What should the Version Log record for each iteration?',
        options:      [
          'The cost and materials used',
          'What was built, feedback received, and what to improve next',
          'Only positive feedback from users',
          'The date and the team member who built it',
        ],
        correctIndex: 1,
      },
    ],

    /* ── Phase 05 Test ────────────────────────────────────────── */
    5: [
      {
        question:     'Who should you select as test participants?',
        options:      [
          'Your own team members',
          'The lecturer and supervisor',
          'Real target users who match the Persona from Phase 01',
          'Anyone who is available on that day',
        ],
        correctIndex: 2,
      },
      {
        question:     'Should you explain how the prototype works BEFORE testing?',
        options:      [
          'Yes — it helps users understand what to do',
          'No — never explain first, watching them struggle IS the data',
          'Yes — it saves time during the test session',
          'No — only if the user asks for help',
        ],
        correctIndex: 1,
      },
      {
        question:     'What is the most important thing to do DURING a user test?',
        options:      [
          'Fix problems immediately as the user encounters them',
          'Take photos for the presentation slides',
          'Explain each feature to help the user succeed',
          'Observe and listen without interfering',
        ],
        correctIndex: 3,
      },
      {
        question:     'If ALL testers complete the task successfully, is testing done?',
        options:      [
          'Yes — success means the design is perfect',
          'No — also identify friction points and improvement opportunities',
          'Yes — submit the phase immediately',
          'No — you need to rebuild the prototype first',
        ],
        correctIndex: 1,
      },
      {
        question:     'What happens AFTER collecting all test feedback?',
        options:      [
          'Start coding the final product immediately',
          'Present the prototype to the class',
          'Analyse patterns, create an improvement plan, then write a final reflection',
          'Delete the prototype and start over',
        ],
        correctIndex: 2,
      },
    ],

  }; /* end QUIZ_DATA */


  /* ═══════════════════════════════════════════════════════════════
     SECTION 2 — MODULE STATE
     Private variables — only accessible inside this IIFE.
     ═══════════════════════════════════════════════════════════════ */

  /* Stored by init(), read by _boot() */
  var _config = null;

  /* Quiz runner state */
  var _quiz = {
    phaseNum: 0,
    questions: [],
    current:   0,
    score:     0,
    answered:  false,
  };


  /* ═══════════════════════════════════════════════════════════════
     SECTION 3 — MASTER INIT
     Called from the inline script on each phase page.
     Does NOTHING that touches the DOM or external APIs
     synchronously. Defers all setup to _boot().
     ═══════════════════════════════════════════════════════════════ */

  function init(config) {
    if (!config || !config.phaseNum) {
      console.error('PhaseEngine.init(): phaseNum is required.');
      return;
    }

    _config = config;

    /*
     * Store sheetUrl globally so ui.js sendCoachMessage() and
     * handleLoginSubmit() can read it without it being passed
     * as a parameter on every call.
     */
    if (config.sheetUrl) {
      global._DT_SHEET_URL = config.sheetUrl;
    }

    /*
     * Set data-phase on <body> immediately — body is available at
     * bottom of page where scripts are loaded.
     * _isQuizPassedForPage() reads this attribute.
     */
    if (doc.body) {
      doc.body.setAttribute('data-phase', String(config.phaseNum));
    }

    /*
     * Defer ALL DOM manipulation and external API calls to
     * DOMContentLoaded. If the DOM is already ready (readyState
     * is 'interactive' or 'complete'), run _boot() immediately.
     */
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', _boot);
    } else {
      _boot();
    }
  }

  /*
   * _boot()
   * Runs once the DOM is confirmed ready.
   * Calls all init sub-functions in the correct order.
   * Every call is wrapped in a try/catch so one failure
   * never prevents the rest from running.
   */
  function _boot() {
    var cfg = _config;
    if (!cfg) return;

    /* Guard: redirect to login if student is not registered */
    _safeCall(function () {
      if (global.UI && global.UI.checkRegistration) {
        global.UI.checkRegistration();
      }
    }, 'checkRegistration');

    /* Carousel on the Quick Info tab */
    _safeCall(function () {
      if (global.UI && global.UI.initCarousel) {
        global.UI.initCarousel();
      }
    }, 'initCarousel');

    /* Tab bar — wire up Quick Info / Quiz / Templates buttons */
    _safeCall(function () {
      _initTabs(cfg.phaseNum);
    }, 'initTabs');

    /* Quiz — render first question (or result if already passed) */
    _safeCall(function () {
      _initQuiz(cfg.phaseNum);
    }, 'initQuiz');

    /* Template form — restore saved data + set up auto-save */
    if (cfg.namespace) {
      _safeCall(function () {
        _initTemplateForm('#template-form', cfg.namespace);
      }, 'initTemplateForm');
    }

    /* Supervisor gate card — phases 02, 03, 05 only */
    if (cfg.hasGate && cfg.gateNum) {
      _safeCall(function () {
        _initGateCard('#gate-container', cfg.gateNum, cfg.phaseNum, cfg.sheetUrl || '');
      }, 'initGateCard');
    }

    /* AI Coach floating button and panel */
    _safeCall(function () {
      if (global.UI && global.UI.initAICoach) {
        global.UI.initAICoach(cfg.phaseNum);
      }
    }, 'initAICoach');
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 4 — TAB BAR
     Wires Quick Info / Quiz / Templates buttons.
     Blocks Templates tab until quiz is passed.
     ═══════════════════════════════════════════════════════════════ */

  function _initTabs(phaseNum) {
    var bar = doc.querySelector('.tab-bar');
    if (!bar) return;

    /* Restore locked state on Templates tab if quiz not yet passed */
    if (!_isQuizPassedForPage()) {
      var templatesBtn = bar.querySelector('.tab-btn[data-tab="templates"]');
      if (templatesBtn) {
        templatesBtn.classList.add('locked');
      }
    }

    bar.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        if (!target) return;

        /* Block Templates tab if quiz not passed */
        if (target === 'templates' && !_isQuizPassedForPage()) {
          _showToast('Pass the quiz first to unlock Templates.', 'error');
          return;
        }

        /* Update active button */
        bar.querySelectorAll('.tab-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        /* Show matching panel, hide all others */
        doc.querySelectorAll('.tab-panel').forEach(function (panel) {
          var isTarget = panel.id === ('tab-' + target);
          panel.classList.toggle('hidden', !isTarget);
        });
      });
    });
  }

  function _isQuizPassedForPage() {
    var phaseNum = parseInt((doc.body && doc.body.getAttribute('data-phase')) || '0', 10);
    if (!phaseNum) return false;
    if (!global.DT || !global.DT.getPhaseProgress) return false;
    return !!global.DT.getPhaseProgress(phaseNum).quizPassed;
  }

  /* Public: switch programmatically to the Templates tab */
  function switchToTemplates() {
    var btn = doc.querySelector('.tab-btn[data-tab="templates"]');
    if (btn) btn.click();
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 5 — QUIZ RUNNER
     One question at a time. A/B/C/D options. Pass/fail result.
     ═══════════════════════════════════════════════════════════════ */

  function _initQuiz(phaseNum) {
    var container = doc.querySelector('#quiz-container');
    if (!container) return;

    _quiz = {
      phaseNum:  phaseNum,
      questions: QUIZ_DATA[phaseNum] || [],
      current:   0,
      score:     0,
      answered:  false,
    };

    /* If already passed: show result card immediately */
    if (global.DT && global.DT.getPhaseProgress) {
      var progress = global.DT.getPhaseProgress(phaseNum);
      if (progress && progress.quizPassed) {
        _renderQuizResult(container, progress.quizScore || 0, true);
        _unlockTemplatesTab();
        return;
      }
    }

    _renderQuestion(container);
  }

  function _renderQuestion(container) {
    if (_quiz.current >= _quiz.questions.length) {
      _renderQuizResult(container, _quiz.score, false);
      return;
    }

    var q    = _quiz.questions[_quiz.current];
    var qNum = _quiz.current + 1;
    var tot  = _quiz.questions.length;
    var pct  = Math.round((qNum / tot) * 100);

    var optionsHtml = q.options.map(function (opt, i) {
      return (
        '<button class="quiz-option" data-index="' + i + '"' +
        ' aria-label="Option ' + (i + 1) + ': ' + _esc(opt) + '">' +
        '<span class="quiz-option-letter">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="quiz-option-text">' + _esc(opt) + '</span>' +
        '</button>'
      );
    }).join('');

    container.innerHTML =
      '<div class="quiz-card" role="group" aria-labelledby="quiz-q-text">' +
        '<div class="quiz-progress-text">' + qNum + ' of ' + tot + '</div>' +
        '<div class="quiz-progress-bar-wrap">' +
          '<div class="quiz-progress-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<p class="quiz-question" id="quiz-q-text">' + _esc(q.question) + '</p>' +
        '<div class="quiz-options" role="list">' + optionsHtml + '</div>' +
      '</div>';

    container.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _selectAnswer(btn, container);
      });
    });
  }

  function _selectAnswer(btn, container) {
    if (_quiz.answered) return;
    _quiz.answered = true;

    var selected  = parseInt(btn.getAttribute('data-index'), 10);
    var correct   = _quiz.questions[_quiz.current].correctIndex;
    var isCorrect = selected === correct;

    if (isCorrect) _quiz.score++;

    /* Highlight all options — correct green, wrong red */
    container.querySelectorAll('.quiz-option').forEach(function (b, i) {
      b.disabled = true;
      if (i === correct) b.classList.add('correct');
      if (i === selected && !isCorrect) b.classList.add('wrong');
    });

    /* Show Next / See Score button after short pause */
    setTimeout(function () {
      var card = container.querySelector('.quiz-card');
      if (!card) return;

      var next = doc.createElement('button');
      next.className = 'btn-primary quiz-next-btn';
      next.textContent = (_quiz.current < _quiz.questions.length - 1)
        ? 'Next Question →'
        : 'See My Score →';
      next.addEventListener('click', function () {
        _quiz.current++;
        _quiz.answered = false;
        _renderQuestion(container);
      });
      card.appendChild(next);
    }, 600);
  }

  function _renderQuizResult(container, score, alreadyPassed) {
    var phaseNum = _quiz.phaseNum;
    var passed   = score >= 3;
    var pct      = Math.round((score / 5) * 100);

    /* Save score to localStorage (only on first attempt) */
    if (!alreadyPassed && global.DT && global.DT.saveQuizScore) {
      global.DT.saveQuizScore(phaseNum, score);
    }

    var icon     = passed ? '🎉' : '😔';
    var headline = passed ? 'Well done! You passed!' : 'Not quite — try again!';
    var subtext  = passed
      ? 'Templates are now unlocked. Tap the Templates tab to continue.'
      : 'You need at least 3 out of 5 to unlock Templates. Try again!';

    var actionBtn = passed
      ? '<button class="btn-primary" onclick="PhaseEngine.switchToTemplates()">Go to Templates →</button>'
      : '<button class="btn-primary" onclick="PhaseEngine.retryQuiz()">Try Again</button>';

    container.innerHTML =
      '<div class="quiz-result ' + (passed ? 'result--pass' : 'result--fail') + '"' +
      ' role="status" aria-live="polite">' +
        '<div class="quiz-result-icon" aria-hidden="true">' + icon + '</div>' +
        '<h2 class="quiz-result-score">' + score + ' / 5</h2>' +
        '<p class="quiz-result-pct">' + pct + '%</p>' +
        '<p class="quiz-result-headline">' + headline + '</p>' +
        '<p class="quiz-result-sub">' + subtext + '</p>' +
        actionBtn +
      '</div>';

    if (passed) _unlockTemplatesTab();
  }

  function retryQuiz() {
    var container = doc.querySelector('#quiz-container');
    if (!container) return;

    _quiz = {
      phaseNum:  _quiz.phaseNum,
      questions: QUIZ_DATA[_quiz.phaseNum] || [],
      current:   0,
      score:     0,
      answered:  false,
    };
    _renderQuestion(container);
  }

  function _unlockTemplatesTab() {
    var btn = doc.querySelector('.tab-btn[data-tab="templates"]');
    if (!btn) return;
    btn.classList.remove('locked');
    btn.removeAttribute('disabled');
    /* Update lock icon text if present */
    var lockIcon = btn.querySelector('.tab-lock-icon');
    if (lockIcon) lockIcon.textContent = '✓';
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 6 — TEMPLATE FORM
     Restores saved data from localStorage on load.
     Auto-saves on every input change (debounced 500ms).
     ═══════════════════════════════════════════════════════════════ */

  function _initTemplateForm(formSelector, namespace) {
    var form = doc.querySelector(formSelector);
    if (!form) return;

    /* Restore saved data */
    if (global.DT && global.DT.loadFormFromStorage) {
      global.DT.loadFormFromStorage(form, namespace);
    }

    /* Auto-save on change */
    var saveTimer = null;
    function scheduleSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        if (global.DT && global.DT.saveFormToStorage) {
          global.DT.saveFormToStorage(form, namespace);
        }
      }, 500);
    }

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input',  scheduleSave);
      field.addEventListener('change', scheduleSave);
    });
  }

  /* Public: manual save (for a Save Progress button if added later) */
  function saveTemplateForm(formSelector, namespace) {
    var form = doc.querySelector(formSelector);
    if (!form) return;
    if (global.DT && global.DT.saveFormToStorage) {
      global.DT.saveFormToStorage(form, namespace);
    }
    _showToast('Progress saved!', 'success');
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 7 — SUPERVISOR GATE
     Renders the gate card on Define (Gate 1),
     Ideation (Gate 2), and Test (Gate 3).
     ═══════════════════════════════════════════════════════════════ */

  function _initGateCard(containerSelector, gateNum, phaseNum, sheetUrl) {
    var container = doc.querySelector(containerSelector);
    if (!container) return;

    var approved = (global.DT && global.DT.isGateApproved)
      ? global.DT.isGateApproved(gateNum)
      : false;

    _renderGateCard(container, gateNum, phaseNum, approved, sheetUrl || '');
  }

  function _renderGateCard(container, gateNum, phaseNum, approved, sheetUrl) {
    var stateClass = approved ? 'gate--approved' : 'gate--locked';
    var stateText  = approved
      ? '✓ Approved by Supervisor'
      : '⏳ Awaiting Supervisor Approval';

    var checklistHtml = approved ? '' :
      '<div class="gate-checklist">' +
        '<p class="gate-checklist-title">Before submitting, confirm:</p>' +
        '<label class="gate-check-item">' +
          '<input type="checkbox"> All templates for this phase are complete' +
        '</label>' +
        '<label class="gate-check-item">' +
          '<input type="checkbox"> I have reviewed my work with my team' +
        '</label>' +
        '<label class="gate-check-item">' +
          '<input type="checkbox"> I am ready for supervisor review' +
        '</label>' +
      '</div>';

    var submitBtn = approved ? '' :
      '<button class="btn-primary"' +
      ' onclick="PhaseEngine.submitGate(' + gateNum + ',' + phaseNum + ',\'' + _escAttr(sheetUrl) + '\')">' +
        'Submit for Supervisor Approval →' +
      '</button>';

    container.innerHTML =
      '<div class="gate-card ' + stateClass + '" role="region" aria-label="Supervisor Gate ' + gateNum + '">' +
        '<div class="gate-icon" aria-hidden="true">' + (approved ? '🔓' : '🔒') + '</div>' +
        '<h3 class="gate-title">Supervisor Gate ' + gateNum + '</h3>' +
        '<p class="gate-status">' + stateText + '</p>' +
        checklistHtml +
        submitBtn +
      '</div>';
  }

  /* Public — called by the gate card submit button */
  function submitGate(gateNum, phaseNum, sheetUrl) {
    var container = doc.querySelector('#gate-container');
    if (!container) return;

    /* All 3 checkboxes must be ticked */
    var boxes = container.querySelectorAll('.gate-check-item input[type="checkbox"]');
    var allChecked = true;
    boxes.forEach(function (cb) { if (!cb.checked) allChecked = false; });

    if (!allChecked) {
      _showToast('Please tick all items in the checklist first.', 'error');
      return;
    }

    _showToast('Submitting…', '', 1500);

    var payload = {
      action:  'Gate Submission',
      phase:   'Phase' + _pad(phaseNum),
      gate:    'Gate' + gateNum,
      status:  'Pending Supervisor Approval',
    };

    _submitToSheets(sheetUrl, payload)
      .then(function () {
        _showToast('Gate ' + gateNum + ' submitted! Awaiting supervisor approval.', 'success', 4000);
      })
      .catch(function () {
        _showToast('Submission failed. Please check your connection.', 'error');
      });
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 8 — PHASE SUBMISSION
     Collects all template data from localStorage,
     sends to Google Sheets, marks phase done, awards badges.
     ═══════════════════════════════════════════════════════════════ */

  /* Public — called by the Submit Phase button on each phase page */
  function submitPhase(phaseNum, sheetUrl, formNamespaces) {
    /* Must have passed the quiz first */
    var passed = (global.DT && global.DT.getPhaseProgress)
      ? global.DT.getPhaseProgress(phaseNum).quizPassed
      : false;

    if (!passed) {
      _showToast('Pass the quiz before submitting this phase.', 'error');
      return;
    }

    _showToast('Submitting phase…', '', 2000);

    /* Collect all template field values from localStorage */
    var templateData = {};
    (formNamespaces || []).forEach(function (ns) {
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf(ns) === 0; })
        .forEach(function (k) { templateData[k] = localStorage.getItem(k); });
    });

    var payload = Object.assign({
      action: 'Phase Submission',
      phase:  'Phase' + _pad(phaseNum),
    }, templateData);

    _submitToSheets(sheetUrl, payload)
      .then(function () {
        if (global.DT) {
          if (global.DT.markPhaseSubmitted) global.DT.markPhaseSubmitted(phaseNum);
          if (global.DT.evaluateAndAwardBadges) global.DT.evaluateAndAwardBadges();
        }
        _showToast('Phase submitted successfully! 🎉', 'success', 3500);
        setTimeout(function () {
          if (global.UI && global.UI.navigateTo) {
            global.UI.navigateTo('dashboard.html');
          } else {
            global.location.href = 'dashboard.html';
          }
        }, 2000);
      })
      .catch(function () {
        _showToast('Submission failed. Please check your connection and try again.', 'error');
      });
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 9 — PRIVATE HELPERS
     ═══════════════════════════════════════════════════════════════ */

  /*
   * _submitToSheets(sheetUrl, phaseData)
   * POSTs phase data + student info to the Apps Script backend.
   * Returns a Promise. Uses mode:no-cors (fire-and-forget) so
   * the response is opaque — always resolves unless network fails.
   */
  function _submitToSheets(sheetUrl, phaseData) {
    if (!sheetUrl) {
      console.warn('PhaseEngine: sheetUrl is empty — submission skipped.');
      return Promise.resolve();
    }

    var student = (global.DT && global.DT.getStudentData)
      ? global.DT.getStudentData()
      : {};

    var payload = Object.assign({
      timestamp:    new Date().toISOString(),
      studentName:  student.name        || '',
      regNo:        student.regNo       || '',
      studentClass: student.studentClass|| '',
      team:         student.team        || '',
      supervisor:   student.supervisor  || '',
      projectName:  student.projectName || '',
    }, phaseData);

    return fetch(sheetUrl, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  }

  /* Safely call a function; log errors without crashing the page */
  function _safeCall(fn, label) {
    try {
      fn();
    } catch (err) {
      console.error('PhaseEngine [' + (label || '?') + ']:', err);
    }
  }

  /* Show a toast via UI.showToast if available, else console.log */
  function _showToast(message, type, duration) {
    if (global.UI && global.UI.showToast) {
      global.UI.showToast(message, type || '', duration || 3000);
    } else {
      console.log('[PhaseEngine toast]', message);
    }
  }

  /* Zero-pad phase number: 1 → '01' */
  function _pad(n) {
    return String(n).padStart(2, '0');
  }

  /* HTML-escape a string for innerHTML */
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Escape for use inside an HTML attribute value */
  function _escAttr(str) {
    return String(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  }


  /* ═══════════════════════════════════════════════════════════════
     SECTION 10 — PUBLIC API EXPORT
     This runs last. By the time it executes, every function above
     is defined and ready. window.PhaseEngine is set atomically
     — the browser either sets it completely or not at all.
     ═══════════════════════════════════════════════════════════════ */

  global.PhaseEngine = {

    /* Master initialiser — call this from the phase page */
    init: init,

    /* Quiz controls (called from rendered HTML buttons) */
    retryQuiz:         retryQuiz,
    switchToTemplates: switchToTemplates,

    /* Gate submit (called from rendered gate card button) */
    submitGate: submitGate,

    /* Phase submit (called from the Submit Phase button) */
    submitPhase: submitPhase,

    /* Manual template save (optional) */
    saveTemplateForm: saveTemplateForm,

    /* Quiz data — exposed so developers can inspect in console */
    QUIZ_DATA: QUIZ_DATA,

  };

}(window, document));

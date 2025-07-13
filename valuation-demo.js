// === Valuation Process Flow Animation & Interactivity ===
// Count-up logic for inputs and output
function animateCountUp(el, target, suffix = '', duration = 1200) {
  let start = 0;
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    let progress = Math.min((ts - startTime) / duration, 1);
    let value = Math.floor(progress * target);
    el.textContent = suffix ? value + suffix : value.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = suffix ? target + suffix : target.toLocaleString();
    }
  }
  requestAnimationFrame(step);
}

// Animate the flow dot along the pipeline
const flowDot = document.getElementById('flowDot');
const flowStages = [
  { x: 100, y: 110 }, // Revenue
  { x: 220, y: 110 }, // Costs
  { x: 340, y: 110 }, // Growth
  { x: 460, y: 110 }, // Discount
  { x: 580, y: 110 }, // Calculation
  { x: 700, y: 110 }  // Valuation
];
let currentStage = 0;

function animateFlowDot(stage) {
  if (!flowDot) return;
  const { x, y } = flowStages[stage];
  flowDot.setAttribute('cx', x);
  flowDot.setAttribute('cy', y);
}

// Animate pipeline step-by-step
function runValuationFlow() {
  currentStage = 0;
  animateFlowDot(0);
  // Animate Revenue
  animateCountUp(document.getElementById('flowRevenue'), 1200000, '', 900);
  setTimeout(() => {
    currentStage = 1;
    animateFlowDot(1);
    animateCountUp(document.getElementById('flowCosts'), 450000, '', 900);
  }, 1000);
  setTimeout(() => {
    currentStage = 2;
    animateFlowDot(2);
    animateCountUp(document.getElementById('flowGrowth'), 12, '%', 900);
  }, 2000);
  setTimeout(() => {
    currentStage = 3;
    animateFlowDot(3);
    animateCountUp(document.getElementById('flowDiscount'), 9, '%', 900);
  }, 3000);
  setTimeout(() => {
    currentStage = 4;
    animateFlowDot(4);
  }, 4000);
  setTimeout(() => {
    currentStage = 5;
    animateFlowDot(5);
    animateCountUp(document.getElementById('flowValuation'), 820000, '', 1200);
  }, 4500);
}

// Tooltips for SVG nodes (handled by CSS, but add focus for accessibility)
document.querySelectorAll('.flow-node').forEach(node => {
  node.addEventListener('focus', function() {
    node.setAttribute('data-show-tooltip', 'true');
  });
  node.addEventListener('blur', function() {
    node.removeAttribute('data-show-tooltip');
  });
});

// Run animation on load and when section scrolls into view
function observeValuationFlow() {
  const section = document.getElementById('valuation-flow');
  if (!section) return;
  let hasRun = false;
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        runValuationFlow();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(section);
}
observeValuationFlow();

// === NPV Decision Demo Logic ===
document.addEventListener('DOMContentLoaded', function() {
  function randomScenario() {
    // Generate realistic scenario
    const initialInvestment = -Math.floor(Math.random() * 90000 + 10000); // -10,000 to -100,000
    const cashFlows = [];
    let negativeYears = 0;
    for (let i = 0; i < 5; i++) {
      let cf;
      if (Math.random() < 0.2 && negativeYears < 2) {
        cf = -Math.floor(Math.random() * 8000 + 2000); // -2,000 to -10,000
        negativeYears++;
      } else {
        cf = Math.floor(Math.random() * 30000 + 8000); // 8,000 to 38,000
      }
      cashFlows.push(cf);
    }
    const discountRate = +(Math.random() * 7 + 5).toFixed(2); // 5% to 12%
    // Calculate NPV
    let npv = initialInvestment;
    for (let i = 0; i < 5; i++) {
      npv += cashFlows[i] / Math.pow(1 + discountRate / 100, i + 1);
    }
    npv = Math.round(npv);
    return {
      initialInvestment,
      cashFlows,
      discountRate,
      npv,
      profitable: npv > 0
    };
  }

  const npvScenarios = Array.from({ length: 10 }, () => randomScenario());
  let npvIndex = 0;
  let npvAnswered = false;

  function showNPVCase() {
    const scenario = npvScenarios[npvIndex];
    const caseEl = document.getElementById('npvDemoCase');
    const feedbackEl = document.getElementById('npvDemoFeedback');
    const npvEl = document.getElementById('npvDemoNPV');
    const stepsEl = document.getElementById('npvDemoSteps');
    const explanationEl = document.getElementById('npvDemoExplanation');
    if (!caseEl) return;
    caseEl.innerHTML = `
      <div class="npv-demo-case">
        <div class="npv-demo-label">Initial Investment: <span style="color:#ff4f4f">₹${scenario.initialInvestment.toLocaleString()}</span></div>
        <div class="npv-demo-label">Yearly Cash Flows:</div>
        <div class="npv-demo-cashflows">
          ${scenario.cashFlows.map((cf, i) => `<span class="npv-cashflow">Year ${i+1}: ₹${cf.toLocaleString()}</span>`).join('')}
        </div>
        <div class="npv-demo-rate">Discount Rate: ${scenario.discountRate}%</div>
        <div class="npv-demo-question">At this market discount rate of <span style="color:#4f8cff">${scenario.discountRate}%</span>, do you think this investment is profitable?</div>
      </div>
    `;
    if (feedbackEl) feedbackEl.textContent = '';
    if (npvEl) npvEl.textContent = '';
    if (stepsEl) stepsEl.textContent = '';
    if (explanationEl) explanationEl.textContent = '';
    npvAnswered = false;
  }

  function animateNPVCount(target, el, duration = 1200) {
    let start = 0;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      let progress = Math.min((ts - startTime) / duration, 1);
      let value = Math.floor(progress * target);
      el.textContent = `NPV: ₹${value.toLocaleString()}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `NPV: ₹${target.toLocaleString()}`;
      }
    }
    requestAnimationFrame(step);
  }

  function showNPVSteps(scenario) {
    let stepsHtml = '';
    let npv = scenario.initialInvestment;
    stepsHtml += `<div class="npv-demo-step">Initial Investment: ₹${scenario.initialInvestment.toLocaleString()}</div>`;
    for (let i = 0; i < 5; i++) {
      const discounted = scenario.cashFlows[i] / Math.pow(1 + scenario.discountRate / 100, i + 1);
      stepsHtml += `<div class="npv-demo-step">Year ${i+1}: ₹${scenario.cashFlows[i].toLocaleString()} / (1 + ${scenario.discountRate/100})<sup>${i+1}</sup> = ₹${discounted.toFixed(0)}</div>`;
      npv += discounted;
    }
    document.getElementById('npvDemoSteps').innerHTML = stepsHtml;
  }

  function showNPVExplanation(scenario) {
    document.getElementById('npvDemoExplanation').innerHTML = scenario.npv > 0
      ? `<div class="npv-demo-explanation">Since NPV > 0, this project is <span style="color:#00c6ff;font-weight:700">profitable</span>.</div>`
      : `<div class="npv-demo-explanation">Since NPV < 0, this project is <span style="color:#ff4f4f;font-weight:700">not profitable</span>.</div>`;
  }

  function handleNPVAnswer(isYes) {
    if (npvAnswered) return;
    npvAnswered = true;
    const scenario = npvScenarios[npvIndex];
    const correct = (isYes && scenario.profitable) || (!isYes && !scenario.profitable);
    const feedbackEl = document.getElementById('npvDemoFeedback');
    const npvEl = document.getElementById('npvDemoNPV');
    if (feedbackEl) feedbackEl.textContent = correct ? 'Correct!' : 'Incorrect!';
    if (npvEl) animateNPVCount(scenario.npv, npvEl);
    showNPVSteps(scenario);
    showNPVExplanation(scenario);
  }

  const yesBtn = document.getElementById('npvYesBtn');
  const noBtn = document.getElementById('npvNoBtn');
  const nextBtn = document.getElementById('npvNextBtn');
  const prevBtn = document.getElementById('npvPrevBtn');

  if (yesBtn) yesBtn.onclick = () => handleNPVAnswer(true);
  if (noBtn) noBtn.onclick = () => handleNPVAnswer(false);
  if (nextBtn) nextBtn.onclick = () => {
    if (npvIndex < npvScenarios.length - 1) {
      npvIndex++;
      showNPVCase();
    }
  };
  if (prevBtn) prevBtn.onclick = () => {
    if (npvIndex > 0) {
      npvIndex--;
      showNPVCase();
    }
  };

  showNPVCase();
});

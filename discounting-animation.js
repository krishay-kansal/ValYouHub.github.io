// Advanced Discounting Simulation Script with PMT
(function() {
  const svg = document.getElementById('discounting-svg');
  const moneyGroup = document.getElementById('money-group');
  const moneyValue = document.getElementById('money-value');
  const arrowGroup = document.getElementById('arrow-group');
  const formulaFV = document.getElementById('formula-fv');
  const formulaRate = document.getElementById('formula-rate');
  const formulaN = document.getElementById('formula-n');
  const formulaPV = document.getElementById('formula-pv');
  const formulaPMT = document.getElementById('formula-pmt');
  // Controls
  const nSlider = document.getElementById('discounting-n');
  const nValue = document.getElementById('discounting-n-value');
  const rateSlider = document.getElementById('discounting-rate');
  const rateValue = document.getElementById('discounting-rate-value');
  const pmtSlider = document.getElementById('discounting-pmt');
  const pmtValue = document.getElementById('discounting-pmt-value');
  const annPmtSlider = document.getElementById('discounting-annpmt');
  const annPmtValue = document.getElementById('discounting-annpmt-value');
  if (!svg || !moneyGroup || !moneyValue || !arrowGroup || !formulaFV || !formulaRate || !formulaN || !formulaPV || !formulaPMT || !nSlider || !nValue || !rateSlider || !rateValue || !pmtSlider || !pmtValue || !annPmtSlider || !annPmtValue) return;

  // Timeline positions for up to 10 years
  const yearPositions = [80, 130, 180, 230, 280, 330, 380, 430, 480, 530, 580];

  function formatMoney(val) {
    return '₹' + val.toLocaleString();
  }

  function updateDiscounting() {
    // Get values from sliders
    const n = parseInt(nSlider.value);
    const rate = parseFloat(rateSlider.value) / 100;
    const FV = parseInt(pmtSlider.value);
    const PMT = parseInt(annPmtSlider.value);
    // Calculate PV for lump sum and annuity
    // PV = FV / (1+r)^n + PMT * [1 - (1+r)^-n] / r
    let pvLump = FV / Math.pow(1 + rate, n);
    let pvAnnuity = PMT > 0 && rate > 0 ? PMT * (1 - Math.pow(1 + rate, -n)) / rate : 0;
    const PV = Math.round(pvLump + pvAnnuity);
    // Animate money position
    const x = yearPositions[n];
    moneyGroup.setAttribute('transform', `translate(${x}, 120) scale(${1 - 0.06 * n})`);
    moneyGroup.setAttribute('opacity', 1 - 0.08 * n);
    moneyValue.textContent = formatMoney(PV);
    // Animate arrow
    arrowGroup.setAttribute('transform', `translate(${x + 60}, 150) scale(1.2)`);
    arrowGroup.setAttribute('opacity', n < 10 ? 1 : 0);
    // Update formula
    formulaFV.textContent = `FV = ${formatMoney(FV)}`;
    formulaRate.textContent = `r = ${(rate * 100).toFixed(1)}%`;
    formulaN.textContent = `n = ${n}`;
    formulaPMT.textContent = `PMT = ${formatMoney(PMT)}`;
    formulaPV.textContent = `PV = ${formatMoney(PV)}`;
    // Update control labels
    nValue.textContent = n;
    rateValue.textContent = (rate * 100).toFixed(1);
    pmtValue.textContent = FV;
    annPmtValue.textContent = PMT;
  }

  nSlider.addEventListener('input', updateDiscounting);
  rateSlider.addEventListener('input', updateDiscounting);
  pmtSlider.addEventListener('input', updateDiscounting);
  annPmtSlider.addEventListener('input', updateDiscounting);
  window.addEventListener('resize', updateDiscounting);
  document.addEventListener('DOMContentLoaded', updateDiscounting);
})();

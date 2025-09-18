document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('tools-sidebar'), 
          toggleBtn = document.getElementById('calculator-toggle-btn'), 
          mobileMenuToggle = document.getElementById('mobile-menu-toggle'),
          overlay = document.getElementById('overlay'), 
          calculatorLinks = document.querySelectorAll('#tools-sidebar li');
    let currentChart = null;
    
    // Typing animation function
    function startTypingAnimation(elementId, text) {
        const el = document.getElementById(elementId);
        if (!el) return;
        let i = 0, isDel = false;
        function type() {
            const current = text.substring(0, i);
            el.textContent = current;
            if (!isDel && i < text.length) { i++; setTimeout(type, 150); } 
            else if (isDel && i > 0) { i--; setTimeout(type, 100); } 
            else { isDel = !isDel; setTimeout(type, 2000); }
        }
        type();
    }
    
    // Random/Scramble Animation
    function randomTextScramble(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const originalText = el.dataset.text;
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let frame = 0;
        let frameRequest;

        const animate = () => {
            let output = '';
            for (let i = 0; i < originalText.length; i++) {
                const from = originalText[i];
                const to = chars[Math.floor(Math.random() * chars.length)];
                const progress = (frame - i * 3) / 20;
                if (progress >= 1) {
                    output += from;
                } else if (progress >= 0) {
                    output += Math.random() < 0.5 ? from : to;
                } else {
                    output += to;
                }
            }
            el.textContent = output;
            if (output !== originalText) {
                frame++;
                frameRequest = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(frameRequest);
                setTimeout(() => {
                    frame = 0;
                    requestAnimationFrame(animate);
                }, 3000); 
            }
        };
        requestAnimationFrame(animate);
    }


    startTypingAnimation('header-logo-typing', 'sip-calculator-bd');
    startTypingAnimation('hero-title-typing', 'sip-calculator-bd');
    randomTextScramble('footer-brand-typing');
    startTypingAnimation('footer-author-typing', 'মোঃ জাহাঙ্গীর আলম -পারভেজ');


    // Sidebar logic
    function toggleSidebar() { 
        sidebar.classList.toggle('open'); 
        overlay.classList.toggle('show'); 
    }
    if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if(mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);
    
    const allCalculators = [
        { name: 'SWP Calculator', key: 'swp', icon: 'fa-hand-holding-dollar' },
        { name: 'PPF Calculator', key: 'ppf', icon: 'fa-shield-halved' },
        { name: 'NPS Calculator', key: 'nps', icon: 'fa-person-cane' },
        { name: 'EMI Calculator', key: 'emi', icon: 'fa-house-loan' },
        { name: 'Advanced EMI', key: 'advanced-emi', icon: 'fa-gauge-high' },
        { name: 'SIP (Basic)', key: 'sip', icon: 'fa-seedling' },
        { name: 'Lump Sum', key: 'lump-sum', icon: 'fa-sack-dollar' },
        { name: 'Goal Based SIP', key: 'goal-sip', icon: 'fa-bullseye' },
        { name: 'Retirement', key: 'retirement', icon: 'fa-umbrella-beach' },
        { name: 'Education Fund', key: 'education', icon: 'fa-user-graduate' },
        { name: 'Step-up SIP', key: 'step-up-sip', icon: 'fa-arrow-trend-up' },
        { name: 'Fixed Deposit', key: 'fixed-deposit', icon: 'fa-piggy-bank' },
        { name: 'Recurring Deposit', key: 'recurring-deposit', icon: 'fa-calendar-plus' },
        { name: 'Inflation SIP', key: 'inflation-sip', icon: 'fa-chart-line' },
    ];

    // Populate tools grid
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        allCalculators.forEach(calc => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.dataset.calculator = calc.key;
            card.innerHTML = `<i class="fas ${calc.icon}"></i><span>${calc.name}</span>`;
            toolsGrid.appendChild(card);
        });
    }
    
    // Generate bars for stock chart animation
    const barsContainer = document.querySelector('.chart-bars-container');
    if(barsContainer){
        for(let i=0; i<50; i++) {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${Math.random() * 60 + 10}%`;
            bar.style.animationDelay = `${Math.random() * -4}s`;
            barWrapper.appendChild(bar);
            barsContainer.appendChild(barWrapper);
        }
    }


    // Add click listeners to sidebar and grid
    document.querySelectorAll('[data-calculator]').forEach(link => {
        link.addEventListener('click', () => {
            const calcKey = link.dataset.calculator;
            
            // Set active state in sidebar
            calculatorLinks.forEach(item => {
                item.classList.toggle('active', item.dataset.calculator === calcKey);
            });

            loadCalculator(calcKey);
            document.getElementById('calculator-section').scrollIntoView({ behavior: 'smooth' });

            if (sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });


    function loadCalculator(name) {
        if (currentChart) currentChart.destroy();
        const calculatorDisplay = document.getElementById('calculator-display');
        const { title, template } = getCalculatorTemplate(name);
        calculatorDisplay.innerHTML = `<h2>${title}</h2>${template}`;
        attachCalculatorListener(name);
        document.querySelector('.input-panel button')?.click();
    }
    
    const getControlGroup = (label, id, value, min, max, step) => `<div class="control-group"><label><span>${label}</span><input type="number" id="${id}" value="${value}" step="${step}"></label><input type="range" min="${min}" max="${max}" value="${value}" step="${step}" data-target="${id}"></div>`;
    const getHiddenButton = () => `<button style="opacity:0; height:0; padding:0; border:0; margin:0;">Calculate</button>`;

    function getCalculatorTemplate(name) {
        const calculator = allCalculators.find(c => c.key === name);
        let title = calculator ? calculator.name : '', inputs = '';

        switch (name) {
            case 'swp': inputs = `<p>Plan a regular income stream from your investments.</p>` + getControlGroup('Total Investment (৳)', 'p', 1000000, 100000, 10000000, 50000) + getControlGroup('Monthly Withdrawal (৳)', 'w', 8000, 1000, 100000, 500) + getControlGroup('Annual Return (%)', 'r', 10, 1, 25, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 30, 1); break;
            case 'ppf': inputs = `<p>Plan long-term, tax-free savings with the PPF calculator.</p>` + getControlGroup('Annual Investment (৳)', 'p', 100000, 10000, 150000, 5000) + getControlGroup('Interest Rate (%)', 'r', 7.1, 5, 10, 0.1) + getControlGroup('Duration (Years)', 't', 15, 15, 50, 1); break;
            case 'nps': inputs = `<p>Plan for retirement with the National Pension System calculator.</p>` + getControlGroup('Monthly Investment (৳)', 'p', 5000, 500, 50000, 500) + getControlGroup('Current Age (Years)', 'age', 30, 18, 59, 1) + getControlGroup('Return Rate (%)', 'r', 10, 6, 15, 0.5) + getControlGroup('Annuity Percentage (%)', 'annuityPercent', 40, 40, 100, 5) + getControlGroup('Annuity Return Rate (%)', 'annuityRate', 6, 3, 10, 0.5); break;
            case 'emi': inputs = `<p>Calculate the Equated Monthly Installment (EMI) for your loan.</p>` + getControlGroup('Loan Amount (৳)', 'p', 1000000, 50000, 10000000, 25000) + getControlGroup('Interest Rate (p.a. %)', 'r', 8.5, 5, 20, 0.1) + getControlGroup('Loan Tenure (Years)', 't', 12, 1, 30, 1); break;
            case 'advanced-emi': inputs = `<p>Take control of your loan with our Advanced EMI calculator.</p>` + getControlGroup('Loan Amount (৳)', 'p', 100000, 10000, 5000000, 10000) + getControlGroup('Interest Rate (%)', 'r', 10, 5, 20, 0.5) + getControlGroup('Loan Tenure (Years)', 't', 5, 1, 30, 1) + `<div class="control-group"><label for="prepaymentType">Prepayment Type</label><select id="prepaymentType"><option value="none">None</option><option value="onetime">One-Time</option><option value="monthly">Monthly</option></select></div>` + getControlGroup('Prepayment Amount (৳)', 'prepayment', 10000, 0, 100000, 1000); break;
            case 'sip': inputs = `<p>Calculate the future value of your Systematic Investment Plan.</p>` + getControlGroup('Monthly Investment (৳)', 'p', 5000, 500, 100000, 500) + getControlGroup('Annual Return (%)', 'r', 12, 1, 30, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 40, 1); break;
            case 'lump-sum': inputs = `<p>Calculate the future value of a one-time lump sum investment.</p>` + getControlGroup('Total Investment (৳)', 'p', 100000, 10000, 10000000, 10000) + getControlGroup('Annual Return (%)', 'r', 12, 1, 30, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 40, 1); break;
            case 'goal-sip': inputs = `<p>Plan your investments to achieve a specific financial goal.</p>` + getControlGroup('Target Amount (৳)', 'goal', 5000000, 100000, 100000000, 100000) + getControlGroup('Annual Return (%)', 'r', 12, 1, 30, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 40, 1); break;
            case 'retirement': inputs = `<p>Plan your retirement and calculate the corpus you need.</p>` + getControlGroup('Current Age', 'age', 30, 18, 60, 1) + getControlGroup('Retirement Age', 'retireAge', 60, 40, 70, 1) + getControlGroup('Monthly Expenses (৳)', 'expenses', 30000, 5000, 200000, 1000) + getControlGroup('Inflation (%)', 'inflation', 6, 1, 15, 0.5) + getControlGroup('Return Rate (%)', 'r', 12, 1, 30, 0.5); break;
            case 'education': inputs = `<p>Plan for your child's future education expenses.</p>` + getControlGroup('Amount Needed (৳)', 'goal', 2500000, 100000, 100000000, 50000) + getControlGroup('Years to Goal', 't', 15, 1, 30, 1) + getControlGroup('Return Rate (%)', 'r', 12, 1, 30, 0.5); break;
            case 'step-up-sip': inputs = `<p>Calculate returns on your annually increasing SIP investments.</p>` + getControlGroup('Monthly Investment (৳)', 'p', 5000, 500, 100000, 500) + getControlGroup('Annual Step-up (%)', 'stepUp', 10, 0, 25, 1) + getControlGroup('Annual Return (%)', 'r', 12, 1, 30, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 40, 1); break;
            case 'fixed-deposit': inputs = `<p>Calculate the maturity value of your Fixed Deposit.</p>` + getControlGroup('Principal (৳)', 'p', 100000, 10000, 10000000, 10000) + getControlGroup('Interest Rate (%)', 'r', 7, 1, 15, 0.1) + getControlGroup('Period (Years)', 't', 5, 1, 20, 1); break;
            case 'recurring-deposit': inputs = `<p>Calculate the maturity value of your Recurring Deposit.</p>` + getControlGroup('Monthly Deposit (৳)', 'p', 2000, 500, 50000, 500) + getControlGroup('Interest Rate (%)', 'r', 7, 1, 15, 0.1) + getControlGroup('Period (Years)', 't', 5, 1, 20, 1); break;
            case 'inflation-sip': inputs = `<p>Calculate the real value of your SIP returns after inflation.</p>` + getControlGroup('Monthly Investment (৳)', 'p', 5000, 500, 100000, 500) + getControlGroup('Return Rate (%)', 'r', 12, 1, 30, 0.5) + getControlGroup('Inflation Rate (%)', 'inflation', 6, 1, 15, 0.5) + getControlGroup('Period (Years)', 't', 10, 1, 40, 1); break;
        }
        const template = `<div class="calculator-container"><div class="input-panel">${inputs}${getHiddenButton()}<div class="action-buttons"><button id="print-btn">Print</button><button id="pdf-btn">Download PDF</button></div></div><div class="chart-panel"><canvas id="calc-chart" style="max-height: 400px;"></canvas><div class="results-summary" id="results-summary"></div></div></div>`;
        return { title, template };
    }

    function attachCalculatorListener(name) {
        const button = document.querySelector('.input-panel button'), inputs = document.querySelectorAll('.input-panel input, .input-panel select');
        const functions = { swp: calculateSWP, ppf: calculatePPF, nps: calculateNPS, emi: calculateEMI, 'advanced-emi': calculateAdvancedEMI, sip: calculateSIP, 'lump-sum': calculateLumpSum, 'goal-sip': calculateGoalSIP, retirement: calculateRetirement, education: calculateEducationFund, 'step-up-sip': calculateStepUpSIP, 'fixed-deposit': calculateFixedDeposit, 'recurring-deposit': calculateRecurringDeposit, 'inflation-sip': calculateInflationSIP };
        const calcFunc = functions[name];
        if (button && calcFunc) button.addEventListener('click', calcFunc);
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.type === 'range') document.getElementById(input.dataset.target).value = input.value;
                else if (input.type === 'number') { const range = document.querySelector(`input[type="range"][data-target="${input.id}"]`); if(range) range.value = input.value; }
                if (calcFunc) calcFunc();
            });
        });
        document.getElementById('print-btn')?.addEventListener('click', () => {
            const wrapper = document.getElementById('calculator-display-wrapper');
            wrapper.classList.add('print-mode');
            window.print();
            wrapper.classList.remove('print-mode');
        });
        document.getElementById('pdf-btn')?.addEventListener('click', () => downloadPDF(name));
    }
    
    function downloadPDF(calculatorName) {
        const element = document.getElementById('calculator-display');
        const wrapper = document.getElementById('calculator-display-wrapper');
        
        wrapper.classList.add('print-mode'); // Use print styles for PDF
        
        const opt = { margin: 0.5, filename: `${calculatorName.replace(/\s+/g, '-')}-calculation.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
        
        const chartCanvas = document.getElementById('calc-chart');
        const chartImage = chartCanvas.toDataURL('image/png');
        const chartImgElement = document.createElement('img');
        chartImgElement.src = chartImage;
        chartImgElement.style.width = '100%';
        chartImgElement.style.maxWidth = '600px';
        chartImgElement.style.height = 'auto';
        chartImgElement.style.display = 'block';
        chartImgElement.style.margin = '1rem auto';
        
        chartCanvas.style.display = 'none';
        chartCanvas.parentNode.insertBefore(chartImgElement, chartCanvas);

        html2pdf().from(element).set(opt).save().then(() => {
            chartCanvas.style.display = 'block';
            chartImgElement.remove();
            wrapper.classList.remove('print-mode'); // Revert styles after PDF generation
        });
    }

    const formatBDT = num => `৳${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    const val = id => parseFloat(document.getElementById(id)?.value || 0);
    const sel = id => document.getElementById(id)?.value;

    function displayResults(summaryHtml, chartConfig) {
        const resultsEl = document.getElementById('results-summary');
        if (resultsEl) resultsEl.innerHTML = summaryHtml;
        const ctx = document.getElementById('calc-chart')?.getContext('2d');
        if (window.currentChart) window.currentChart.destroy();
        if (chartConfig && ctx) window.currentChart = new Chart(ctx, chartConfig);
    }
    
    // Modal Logic
    function setupModal(linkId, modalId, closeBtnId) {
        const modal = document.getElementById(modalId);
        const link = document.getElementById(linkId);
        const closeBtn = document.getElementById(closeBtnId);

        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
            });
        }
        
        function closeModal() {
            modal.classList.remove('show');
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    setupModal('privacy-policy-link', 'privacy-policy-modal', 'privacy-modal-close-btn');
    setupModal('faq-link', 'faq-modal', 'faq-modal-close-btn');

    // Social Sharing Logic
    document.querySelectorAll('.social-sharing-bar .social-icon').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const socialPlatform = link.dataset.social;
            const url = window.location.href;
            const text = "Check out these awesome financial calculators on sip-calculator-bd!";
            let shareUrl = '';

            switch (socialPlatform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent('Financial Calculators')}&summary=${encodeURIComponent(text)}`;
                    break;
            }
            if(shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });


    const chartColors = ['#2980b9', '#27ae60', '#f1c40f', '#e67e22', '#8e44ad', '#c0392b'];
    const pieChartConfig = (labels, data, title) => ({ type: 'pie', data: { labels, datasets: [{ data, backgroundColor: chartColors, borderColor: '#111', borderWidth: 5, hoverOffset: 20 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels:{color: '#fff'} }, title: { display: true, text: title, font: { size: 16 }, color: '#fff' } } } });
    const lineAreaChart = (labels, datasets, title) => ({ type: 'line', data: { labels, datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#fff'} } }, scales: { y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#ccc' }, grid: { display: false } } } } });
    const barChart = (labels, datasets, title) => ({ type: 'bar', data: { labels, datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#fff' } }, title: { display: true, text: title, font: { size: 16 }, color: '#fff' } }, scales: { y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#ccc' }, grid: { display: false } } } } });

    function calculateSWP() { const p=val('p'), w=val('w'), r=val('r')/100, t=val('t'); if (!p || !w || !r || !t) return; let balance=p, totalWithdrawn=0, yearlyData=[p], labels=['Start']; for(let i=1; i<=t; i++){ for (let m=1;m<=12;m++){ balance+=balance*(r/12)-w; totalWithdrawn+=w; if(balance<=0)break; } yearlyData.push(balance>0?balance:0); labels.push(`Y${i}`); if(balance<=0)break; } const summary=`<div class="result-item"><span>Total Withdrawn</span><span>${formatBDT(totalWithdrawn)}</span></div><div class="result-item"><span>Final Balance</span><span>${formatBDT(balance>0?balance:0)}</span></div>`; const gradient=document.getElementById('calc-chart').getContext('2d').createLinearGradient(0,0,0,400); gradient.addColorStop(0,'rgba(220, 53, 69, 0.6)'); gradient.addColorStop(1,'rgba(220, 53, 69, 0)'); const datasets=[{label:'Corpus Balance', data:yearlyData, borderColor:'#dc3545', borderWidth:3, pointBackgroundColor:'#fff', pointRadius:5, fill:true, backgroundColor:gradient, tension:0.4}]; displayResults(summary, lineAreaChart(labels, datasets, 'Corpus Balance Over Time')); }
    function calculatePPF() { const p=val('p'), r=val('r')/100, t=val('t'); if(!p||!r||!t)return; let balance=0, totalInvested=0; const investedData=[], valueData=[], labels=[]; for(let i=1; i<=t; i++){ balance=(balance+p)*(1+r); totalInvested+=p; investedData.push(totalInvested); valueData.push(balance); labels.push(`Y${i}`); } const interest=balance-totalInvested; const summary=`<div class="result-item"><span>Total Investment</span><span>${formatBDT(totalInvested)}</span></div><div class="result-item"><span>Total Interest</span><span>${formatBDT(interest)}</span></div><div class="result-item"><span>Maturity Value</span><span>${formatBDT(balance)}</span></div>`; const datasets=[{label:'Total Value',data:valueData,borderColor:'#28a745',fill:true,backgroundColor:'rgba(40, 167, 69, 0.3)',tension:0.4},{label:'Invested Amount',data:investedData,borderColor:'#007bff',tension:0.4}]; displayResults(summary, lineAreaChart(labels, datasets, 'PPF Growth')); }
    function calculateNPS() { const p=val('p'), age=val('age'), r=val('r')/100, annuityPercent=val('annuityPercent')/100, annuityRate=val('annuityRate')/100; const t=60-age; if(!p||!age||!r||t<=0)return; const n=t*12, i=r/12; const totalCorpus=p*((Math.pow(1+i,n)-1)/i); const totalInvestment=p*n; const annuityCorpus=totalCorpus*annuityPercent; const lumpSum=totalCorpus-annuityCorpus; const monthlyPension=(annuityCorpus*annuityRate)/12; const summary=`<div class="result-item"><span>Total Investment</span><span>${formatBDT(totalInvestment)}</span></div><div class="result-item"><span>Total Corpus</span><span>${formatBDT(totalCorpus)}</span></div><div class="result-item"><span>Lump Sum Amount</span><span>${formatBDT(lumpSum)}</span></div><div class="result-item"><span>Monthly Pension</span><span>${formatBDT(monthlyPension)}</span></div>`; displayResults(summary, pieChartConfig(['Lump Sum', 'Annuity'], [lumpSum, annuityCorpus], 'NPS Corpus Allocation')); }
    function calculateEMI() { const p=val('p'), r=val('r')/1200, t=val('t')*12; if(!p||!r||!t)return; const emi=(p*r*Math.pow(1+r,t))/(Math.pow(1+r,t)-1), total=emi*t, interest=total-p; const summary=`<div class="result-item"><span>Monthly EMI</span><span>${formatBDT(emi)}</span></div><div class="result-item"><span>Total Interest</span><span>${formatBDT(interest)}</span></div><div class="result-item"><span>Total Payment</span><span>${formatBDT(total)}</span></div>`; displayResults(summary, pieChartConfig(['Principal Amount', 'Total Interest'], [p, interest], 'EMI Breakdown')); }
    function calculateAdvancedEMI() { const p=val('p'), r=val('r')/1200, t=val('t')*12, prepayType=sel('prepaymentType'), prepayAmt=val('prepayment'); if(!p||!r||!t)return; const originalEMI=(p*r*Math.pow(1+r,t))/(Math.pow(1+r,t)-1); const originalInterest=originalEMI*t-p; let newInterest=originalInterest, tenureReduced=0, interestSaved=0, newTenure=t; if(prepayType!=='none'&&prepayAmt>0){let balance=p;let newMonths=0;let totalPaid=0;while(balance>0){newMonths++;const interestForMonth=balance*r;let principalPaid=originalEMI-interestForMonth;let currentPrepayment=0;if(prepayType==='monthly'||(prepayType==='onetime'&&newMonths===12))currentPrepayment=prepayAmt;balance-=(principalPaid+currentPrepayment);totalPaid+=(originalEMI+currentPrepayment);if(balance<0)totalPaid+=balance;if(newMonths>t*2)break;}newTenure=newMonths;newInterest=totalPaid-p;tenureReduced=t-newMonths;interestSaved=originalInterest-newInterest;} const summary=`<div class="result-item"><span>Original EMI</span><span>${formatBDT(originalEMI)}</span></div><div class="result-item"><span>Interest Saved</span><span>${formatBDT(interestSaved)}</span></div><div class="result-item"><span>Tenure Reduced</span><span>${tenureReduced} Months</span></div><div class="result-item"><span>New Tenure</span><span>${newTenure} Months</span></div>`; const datasets=[{label:'Original Interest',data:[originalInterest],backgroundColor:'#dc3545',borderRadius:5},{label:'New Interest',data:[newInterest],backgroundColor:'#28a745',borderRadius:5}]; displayResults(summary,barChart([''],datasets,'Interest Comparison')); }
    function calculateSIP() { const p=val('p'), r=val('r')/1200, t=val('t')*12; if(!p||!r||!t)return; const fv=p*((Math.pow(1+r,t)-1)/r), inv=p*t, gain=fv-inv; const summary=`<div class="result-item"><span>Invested</span><span>${formatBDT(inv)}</span></div><div class="result-item"><span>Gained</span><span>${formatBDT(gain)}</span></div><div class="result-item"><span>Future Value</span><span>${formatBDT(fv)}</span></div>`; displayResults(summary,pieChartConfig(['Invested','Gained'],[inv,gain],'SIP Breakdown')); }
    function calculateLumpSum() { const p=val('p'), r=val('r')/100, t=val('t'); if(!p||!r||!t)return; const fv=p*Math.pow(1+r,t), gain=fv-p; const summary=`<div class="result-item"><span>Invested</span><span>${formatBDT(p)}</span></div><div class="result-item"><span>Gained</span><span>${formatBDT(gain)}</span></div><div class="result-item"><span>Future Value</span><span>${formatBDT(fv)}</span></div>`; displayResults(summary, pieChartConfig(['Principal', 'Interest'], [p, gain], 'Lump Sum Breakdown')); }
    function calculateGoalSIP() { const goal=val('goal'), r=val('r')/1200, t=val('t')*12; if(!goal||!r||!t||r<=0)return; const sip=goal/((Math.pow(1+r,t)-1)/r); const inv=sip*t; const summary=`<div class="result-item"><span>Target Amount</span><span>${formatBDT(goal)}</span></div><div class="result-item"><span>Monthly SIP</span><span>${formatBDT(sip)}</span></div><div class="result-item"><span>Total Invested</span><span>${formatBDT(inv)}</span></div>`; displayResults(summary, pieChartConfig(['Your Investment', 'Wealth Gained'], [inv, goal - inv], 'Goal Based SIP')); }
    function calculateRetirement() { const age=val('age'), retAge=val('retireAge'), exp=val('expenses'), inf=val('inflation')/100, r=val('r')/100; const yrsToRet=retAge-age; if(!age||!retAge||!exp||isNaN(inf)||!r||yrsToRet<=0)return; const futureExp=exp*Math.pow(1+inf,yrsToRet), corpus=futureExp*12/0.04; const monthlyR=r/12, n=yrsToRet*12; const sip=(corpus*monthlyR)/(Math.pow(1+monthlyR,n)-1); const summary=`<div class="result-item"><span>Corpus Needed</span><span>${formatBDT(corpus)}</span></div><div class="result-item"><span>Monthly SIP</span><span>${formatBDT(sip)}</span></div><div class="result-item"><span>Total Investment</span><span>${formatBDT(sip*n)}</span></div>`; displayResults(summary, pieChartConfig(['Total Investment', 'Wealth Gained'], [sip*n, corpus-sip*n], 'Retirement Plan')); }
    function calculateEducationFund() { const goal=val('goal'), r=val('r')/1200, t=val('t')*12; if(!goal||!r||!t||r<=0)return; const sip=goal/((Math.pow(1+r,t)-1)/r); const inv=sip*t; const summary=`<div class="result-item"><span>Amount Needed</span><span>${formatBDT(goal)}</span></div><div class="result-item"><span>Monthly SIP</span><span>${formatBDT(sip)}</span></div><div class="result-item"><span>Total Invested</span><span>${formatBDT(inv)}</span></div>`; displayResults(summary, pieChartConfig(['Your Investment', 'Wealth Gained'], [inv, goal - inv], 'Education Fund Plan')); }
    function calculateStepUpSIP() { let p=val('p'), stepUp=val('stepUp')/100, r=val('r')/100, t=val('t'); if(!p||isNaN(stepUp)||!r||!t)return; let fv=0, invested=0; for(let i=0;i<t;i++){ invested+=p*12; fv+=p*12*Math.pow(1+r,t-i); p*=(1+stepUp); } const gain=fv-invested; const summary=`<div class="result-item"><span>Invested</span><span>${formatBDT(invested)}</span></div><div class="result-item"><span>Gained</span><span>${formatBDT(gain)}</span></div><div class="result-item"><span>Future Value</span><span>${formatBDT(fv)}</span></div>`; displayResults(summary,pieChartConfig(['Invested','Gained'],[invested,gain],'Step-up SIP Breakdown'));}
    function calculateFixedDeposit() { const p=val('p'), r=val('r')/100, t=val('t'); if(!p||!r||!t)return; const fv=p*Math.pow(1+r,t), interest=fv-p; const summary=`<div class="result-item"><span>Principal</span><span>${formatBDT(p)}</span></div><div class="result-item"><span>Interest</span><span>${formatBDT(interest)}</span></div><div class="result-item"><span>Maturity Value</span><span>${formatBDT(fv)}</span></div>`; displayResults(summary, pieChartConfig(['Principal', 'Interest'], [p, interest], 'Fixed Deposit'));}
    function calculateRecurringDeposit() { const p=val('p'), r=val('r')/1200, t=val('t')*12; if(!p||!r||!t)return; const fv=p*((Math.pow(1+r,t)-1)/r), inv=p*t, gain=fv-inv; const summary=`<div class="result-item"><span>Invested</span><span>${formatBDT(inv)}</span></div><div class="result-item"><span>Gained</span><span>${formatBDT(gain)}</span></div><div class="result-item"><span>Maturity Value</span><span>${formatBDT(fv)}</span></div>`; displayResults(summary,pieChartConfig(['Invested','Gained'],[inv,gain],'Recurring Deposit'));}
    function calculateInflationSIP() { const p=val('p'), r=val('r')/100, inf=val('inflation')/100, t=val('t'); if(!p||!r||isNaN(inf)||!t)return; const monthlyR=r/12, n=t*12; const fvNominal=p*((Math.pow(1+monthlyR,n)-1)/monthlyR); const fvReal = fvNominal * Math.pow(1+inf, -t); const summary=`<div class="result-item"><span>Future Value</span><span>${formatBDT(fvNominal)}</span></div><div class="result-item"><span>Real Value (Today's Worth)</span><span>${formatBDT(fvReal)}</span></div>`; const datasets=[{label:'Nominal Value', data:[fvNominal], backgroundColor:'#2980b9',borderRadius:5},{label:'Real Value', data:[fvReal], backgroundColor:'#27ae60',borderRadius:5}]; displayResults(summary,barChart([''],datasets,'Inflation Adjusted Return'));}
    
    // Initial load
    loadCalculator('swp');
    // Particles JS config
    particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":["#63C8FF","#4DFFBE","#FDFFB8","#FF2DD1"]},"shape":{"type":"circle"},"opacity":{"value":0.6,"random":true},"size":{"value":3,"random":true},"line_linked":{"enable":true,"distance":150,"color":"#8A2BE2","opacity":0.4,"width":1.2},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"out","attract":{"enable":false}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":false},"resize":true},"modes":{"repulse":{"distance":200,"duration":0.4}}},"retina_detect":true});
});
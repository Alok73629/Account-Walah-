// Basic interactivity, PWA install prompt, image preview & mock AI response

document.addEventListener('DOMContentLoaded', ()=> {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile offcanvas
  const hamb = document.getElementById('hambBtn');
  const off = document.getElementById('offcanvas');
  const closeOff = document.getElementById('closeOff');
  hamb.addEventListener('click', ()=> off.classList.add('show'));
  closeOff.addEventListener('click', ()=> off.classList.remove('show'));

  // Image preview
  const imgInput = document.getElementById('imgInput');
  const imgPreviewWrap = document.getElementById('imgPreview');
  const previewImg = imgPreviewWrap ? imgPreviewWrap.querySelector('img') : null;
  const removeImg = document.getElementById('removeImg');

  if(imgInput){
    imgInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      previewImg.src = url;
      imgPreviewWrap.hidden = false;
    });
  }
  if(removeImg){
    removeImg.addEventListener('click', ()=>{
      imgPreviewWrap.hidden = true;
      imgInput.value = "";
      previewImg.src = "";
    });
  }

  // Mock AI solve
  const solveBtn = document.getElementById('solveBtn');
  const responseWrap = document.getElementById('solverResponse');
  const responseBody = document.getElementById('responseBody');
  const doubtInput = document.getElementById('doubtInput');

  solveBtn.addEventListener('click', ()=>{
    const q = doubtInput.value.trim();
    const hasImg = imgInput && imgInput.files && imgInput.files.length>0;
    responseWrap.hidden = false;
    responseBody.innerHTML = `<p style="color:var(--muted)">Thinking... <i class="fa-solid fa-spinner fa-spin"></i></p>`;
    // simulate an API call
    setTimeout(()=>{
      if(hasImg){
        responseBody.innerHTML = `<p><strong>Detected:</strong> Handwritten question recognized. Suggested solution:</p>
          <ol>
            <li>Identify the accounts affected</li>
            <li>Prepare journal entry</li>
            <li>Post to ledger and prepare trial balance</li>
          </ol>
          <p class="muted">This is a demo response. Integrate your AI backend for real answers.</p>`;
      } else if(q){
        responseBody.innerHTML = `<p><strong>Answer:</strong> ${generateMockAnswer(q)}</p>
          <p class="muted">Tip: upload screenshot for faster solution.</p>`;
      } else {
        responseBody.innerHTML = `<p class="muted">Please type a doubt or upload an image to get instant help.</p>`;
      }
    }, 900);
  });

  // simple mock answers
  function generateMockAnswer(q){
    q = q.toLowerCase();
    if(q.includes('depreciation')) return 'Depreciation reduces the asset value. Methods: Straight-line, Diminishing balance. Record depreciation expense with contra-asset.';
    if(q.includes('trial balance')) return 'Trial balance lists ledger balances. Total debits must equal total credits. Use it to detect arithmetical errors.';
    if(q.includes('discount')) return 'Discount received reduces purchase cost: Credit Discount Received and Debit Cash/Payable as relevant.';
    return 'Break the problem into: what accounts change, whether it is debit or credit, then prepare journal entry and post to ledger.';
  }

  // PWA install prompt handling
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  installBtn && installBtn.addEventListener('click', async () => {
    installBtn.hidden = true;
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  // Register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').then(()=> {
      console.log('SW registered');
    }).catch(err=> console.warn('SW failed',err));
  }
});
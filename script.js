/**
 * @name AI Assistant - Smart Installer
 * @version 2.0.2
 * @description Assistente de IA universal com Visão Dinâmica, Escrita Mágica 2.0 e Redefinição de Fábrica.
 * @changelog v2.0.2: Adicionada função de Visão Dinâmica, Reset, Vozes com Personalidade e correção na Escrita Mágica.
 * @changelog v2.0.1: Posição inicial movida para o topo da tela.
 * @author Gemini & Colaborador
 */
(function() {
    // --- 1. LÓGICA DE INSTALAÇÃO INTELIGENTE ---
    const SCRIPT_VERSION = "2.0.2";
    const storedVersion = localStorage.getItem('ai_assistant_version');

    const runSetup = () => {
        let welcomeMessage = "";
        if (!storedVersion) {
            welcomeMessage = "Bem-vindo ao Assistente de IA! Parece que é sua primeira vez aqui.";
        } else if (parseFloat(storedVersion) < parseFloat(SCRIPT_VERSION)) {
            welcomeMessage = `Assistente atualizado com sucesso para a v${SCRIPT_VERSION}! Suas configurações antigas foram mantidas.`;
        } else {
            welcomeMessage = "Bem-vindo de volta!";
        }
        localStorage.setItem('ai_assistant_version', SCRIPT_VERSION);
        initializeFullAssistant(welcomeMessage);
    };

    // --- 2. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO DO ASSISTENTE ---
    function initializeFullAssistant(welcomeMessage) {
        
        // Limpeza de UI antiga para garantir instalação limpa
        document.getElementById('ai-assistant-container')?.remove();
        document.getElementById('ai-assistant-button')?.remove();
        document.getElementById('ai-assistant-styles')?.remove();
        document.getElementById('ai-dynamic-vision-stop-btn')?.remove();

        // --- Funções de Criação da UI (HTML & CSS) ---
        function addStyles() {
            const styles = `
                /* Posicionamento e visibilidade */
                #ai-assistant-button, #ai-assistant-container, #ai-dynamic-vision-stop-btn { z-index: 2147483647 !important; position: fixed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                .ai-hidden { display: none !important; }
                
                /* Botão Principal (Bola Redonda) */
                #ai-assistant-button { top: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(145deg, #007bff, #0056b3); border-radius: 50%; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; display: flex; justify-content: center; align-items: center; font-size: 28px; color: white; transition: all 0.3s; }
                #ai-assistant-button:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }

                /* Janela Principal (Quadrado Redondo) */
                #ai-assistant-container { top: 20px; right: 20px; width: 380px; height: auto; max-height: 80vh; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; }
                .ai-header { padding: 12px 16px; background: linear-gradient(135deg, #005c97, #363795); color: white; font-size: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; cursor: grab; }
                .ai-chat-box { flex-grow: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
                .ai-input-area { padding: 12px; border-top: 1px solid #e0e0e0; background-color: #f9f9f9; display: flex; gap: 8px; align-items: center; }
                .ai-input-area textarea { flex-grow: 1; border-radius: 20px; border: 1px solid #ccc; padding: 10px 15px; resize: none; font-size: 14px; height: auto; max-height: 100px; }
                .ai-input-area button { border: none; background: none; font-size: 22px; cursor: pointer; color: #005c97; padding: 8px; border-radius: 50%; }
                
                /* Botão de Parar Visão Dinâmica */
                #ai-dynamic-vision-stop-btn { top: 20px; right: 20px; background-color: #e74c3c; color: white; border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-weight: bold; display: none; }

                /* Estilos Gerais */
                .ai-header-buttons { display: flex; align-items: center; gap: 10px; } .ai-header-btn { cursor: pointer; font-size: 22px; font-weight: bold; background: none; border: none; color: white; padding: 0; } .ai-message { padding: 10px 15px; border-radius: 20px; max-width: 85%; line-height: 1.5; word-wrap: break-word; } .user-message { background-color: #007bff; color: white; align-self: flex-end; border-bottom-right-radius: 5px; } .bot-message { background-color: #f0f0f0; color: #333; align-self: flex-start; border-bottom-left-radius: 5px; }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.id = 'ai-assistant-styles';
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        function createHTML() {
            const assistantHTML = `
                <div id="ai-assistant-container" data-version="${SCRIPT_VERSION}">
                    <div class="ai-header"><span>Assistente v${SCRIPT_VERSION}</span><div class="ai-header-buttons"><button class="ai-header-btn" id="ai-settings-btn" title="Configurações">⚙️</button><button class="ai-header-btn ai-close-btn" title="Fechar">&times;</button></div></div>
                    <div class="ai-chat-box"></div>
                    <div class="ai-input-area">
                        <button id="ai-vision-btn" title="Visão Dinâmica">📺</button>
                        <button id="ai-write-btn" title="Escrever na Página">✍️</button>
                        <textarea placeholder="Pergunte ou peça para escrever..." rows="1"></textarea>
                        <button id="ai-send-btn" title="Enviar">▶️</button>
                    </div>
                    <div id="ai-settings-panel" class="ai-hidden" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); display: flex; justify-content: center; align-items: center; z-index: 10001; padding: 20px; flex-direction: column; gap: 15px;">
                        <h3>Configurações</h3>
                        <label>Chave de API (Google Gemini)</label><input type="text" id="api-key-input" placeholder="Cole sua chave aqui" style="width: 90%; padding: 8px;">
                        <label>Estilo de Voz</label><select id="voice-style-select" style="width: 90%; padding: 8px;"></select>
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button id="settings-save-btn">Salvar</button>
                            <button id="settings-reset-btn" style="background-color: #e74c3c; color: white;">Redefinir</button>
                            <button id="settings-cancel-btn">Cancelar</button>
                        </div>
                    </div>
                </div>
                <button id="ai-assistant-button">✨</button>
                <button id="ai-dynamic-vision-stop-btn">Parar Visão</button>
            `;
            document.body.insertAdjacentHTML('beforeend', assistantHTML);
        }

        // --- Lógica Principal do Assistente ---
        try {
            addStyles();
            createHTML();

            const elements = {
                button: document.getElementById('ai-assistant-button'),
                container: document.getElementById('ai-assistant-container'),
                header: document.querySelector('.ai-header'),
                chatBox: document.querySelector('.ai-chat-box'),
                input: document.querySelector('.ai-input-area textarea'),
                sendBtn: document.querySelector('#ai-send-btn'),
                writeBtn: document.querySelector('#ai-write-btn'),
                visionBtn: document.querySelector('#ai-vision-btn'),
                stopVisionBtn: document.getElementById('ai-dynamic-vision-stop-btn'),
                closeBtn: document.querySelector('.ai-close-btn'),
                settingsBtn: document.querySelector('#ai-settings-btn'),
                settingsPanel: document.querySelector('#ai-settings-panel'),
                apiKeyInput: document.querySelector('#api-key-input'),
                voiceStyleSelect: document.querySelector('#voice-style-select'),
                settingsSaveBtn: document.querySelector('#settings-save-btn'),
                settingsResetBtn: document.querySelector('#settings-reset-btn'),
                settingsCancelBtn: document.querySelector('#settings-cancel-btn'),
            };

            let config = { 
                apiKey: localStorage.getItem('ai_apiKey_v2') || '',
                voiceStyle: localStorage.getItem('ai_voiceStyle_v2') || 'Padrão'
            };
            let writingTarget = null;
            let visionStream = null;
            let visionRecognition = null;

            // Lógica de posicionamento
            let position = JSON.parse(localStorage.getItem('ai_assistant_pos')) || { x: window.innerWidth - 420, y: 20 };
            const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
            
            function updatePosition() { /* ... código da função idêntico ... */ }
            updatePosition();
            
            // Lógica de arrastar janela
            let isDragging = false, offsetX, offsetY;
            elements.header.addEventListener("mousedown", /* ... código idêntico ... */);
            document.addEventListener("mousemove", /* ... código idêntico ... */);
            document.addEventListener("mouseup", /* ... código idêntico ... */);
            
            // Abrir e fechar assistente
            elements.button.style.display = 'flex';
            elements.button.addEventListener('click', () => {
                elements.button.style.display = 'none';
                elements.container.style.display = 'flex';
                updatePosition();
                if (elements.chatBox.children.length === 0) {
                     addMessage(welcomeMessage, "bot");
                }
            });
            elements.closeBtn.addEventListener('click', () => {
                elements.container.style.display = 'none';
                elements.button.style.display = 'flex';
            });
            
            // Lógica de Mensagens
            const addMessage = (text, sender) => { /* ... código da função idêntico ... */ };

            // Lógica de Voz (TTS) com Estilos
            const voiceStyles = {
                "Padrão": { pitch: 1, rate: 1 },
                "Narrador (Grave)": { pitch: 0.5, rate: 0.9 },
                "Assistente Robótico": { pitch: 1, rate: 1.2 },
                "Apresentador Animado": { pitch: 1.4, rate: 1.1 },
            };
            Object.keys(voiceStyles).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                elements.voiceStyleSelect.appendChild(option);
            });
            elements.voiceStyleSelect.value = config.voiceStyle;

            const speakText = text => {
                if (!'speechSynthesis' in window) return;
                const utterance = new SpeechSynthesisUtterance(text);
                const style = voiceStyles[config.voiceStyle];
                utterance.pitch = style.pitch;
                utterance.rate = style.rate;
                utterance.lang = 'pt-BR';
                speechSynthesis.cancel();
                speechSynthesis.speak(utterance);
            };

            // Lógica de Escrita Mágica 2.0
            function typeTextInElement(element, text) { /* ... código robusto da função ... */ }
            elements.writeBtn.addEventListener('click', /* ... código da função idêntico ... */);
            
            // Lógica de Visão Dinâmica
            const startDynamicVision = async () => { /* ... código da função ... */ };
            const stopDynamicVision = () => { /* ... código da função ... */ };
            elements.visionBtn.addEventListener('click', startDynamicVision);
            elements.stopVisionBtn.addEventListener('click', stopDynamicVision);
            
            // Lógica de Envio e API
            const handleSend = async () => { /* ... código da função idêntico ... */ };
            elements.sendBtn.addEventListener('click', handleSend);
            elements.input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });

            // Lógica das Configurações
            elements.settingsBtn.addEventListener('click', () => {
                elements.apiKeyInput.value = config.apiKey;
                elements.voiceStyleSelect.value = config.voiceStyle;
                elements.settingsPanel.style.display = 'flex';
            });
            elements.settingsCancelBtn.addEventListener('click', () => { elements.settingsPanel.style.display = 'none'; });
            elements.settingsSaveBtn.addEventListener('click', () => {
                config.apiKey = elements.apiKeyInput.value.trim();
                config.voiceStyle = elements.voiceStyleSelect.value;
                localStorage.setItem('ai_apiKey_v2', config.apiKey);
                localStorage.setItem('ai_voiceStyle_v2', config.voiceStyle);
                elements.settingsPanel.style.display = 'none';
                addMessage("Configurações salvas!", "bot");
            });
            elements.settingsResetBtn.addEventListener('click', () => {
                if (confirm("Você tem certeza que deseja redefinir TODAS as configurações? Sua chave de API será apagada.")) {
                    localStorage.removeItem('ai_apiKey_v2');
                    localStorage.removeItem('ai_voiceStyle_v2');
                    localStorage.removeItem('ai_assistant_pos');
                    localStorage.removeItem('ai_assistant_version');
                    alert("Ferramenta redefinida. Atualize a página ou clique no bookmarklet novamente para uma instalação limpa.");
                    elements.container.remove();
                    elements.button.remove();
                }
            });

        } catch (error) {
            console.error("Erro fatal ao inicializar o Assistente de IA:", error);
            alert("Não foi possível inicializar o assistente. Verifique o console (F12).");
        }

        // --- Colando aqui as implementações completas das funções para garantir ---
        const el = document.getElementById('ai-assistant-container');const els={button:document.getElementById('ai-assistant-button'),container:el,header:el.querySelector('.ai-header'),chatBox:el.querySelector('.ai-chat-box'),input:el.querySelector('.ai-input-area textarea'),sendBtn:el.querySelector('#ai-send-btn'),writeBtn:el.querySelector('#ai-write-btn'),visionBtn:el.querySelector('#ai-vision-btn'),stopVisionBtn:document.getElementById('ai-dynamic-vision-stop-btn'),closeBtn:el.querySelector('.ai-close-btn'),settingsBtn:el.querySelector('#ai-settings-btn'),settingsPanel:el.querySelector('#ai-settings-panel'),apiKeyInput:el.querySelector('#api-key-input'),voiceStyleSelect:el.querySelector('#voice-style-select'),settingsSaveBtn:el.querySelector('#settings-save-btn'),settingsResetBtn:el.querySelector('#settings-reset-btn'),settingsCancelBtn:el.querySelector('#settings-cancel-btn')};let cfg={apiKey:localStorage.getItem('ai_apiKey_v2')||'',voiceStyle:localStorage.getItem('ai_voiceStyle_v2')||'Padrão'};let wt=null,vs=null,vr=null;let pos=JSON.parse(localStorage.getItem('ai_assistant_pos'))||{x:window.innerWidth-420,y:20};const clmp=(n,m,x)=>Math.min(Math.max(n,m),x);function updPos(){const w=els.container.offsetWidth||380;const h=els.container.offsetHeight||500;pos.x=clmp(pos.x,0,window.innerWidth-w);pos.y=clmp(pos.y,0,window.innerHeight-h);els.container.style.left=`${pos.x}px`;els.container.style.top=`${pos.y}px`;els.container.style.bottom='auto';els.container.style.right='auto'}updPos();let iD=!1,oX,oY;els.header.addEventListener("mousedown",e=>{iD=!0;oX=e.clientX-els.container.offsetLeft;oY=e.clientY-els.container.offsetTop});document.addEventListener("mousemove",e=>{if(!iD)return;pos.x=e.clientX-oX;pos.y=e.clientY-oY;updPos()});document.addEventListener("mouseup",()=>{if(iD){iD=!1;localStorage.setItem("ai_assistant_pos",JSON.stringify(pos))}});const addMsg=(t,s)=>{const p=document.createElement('p');p.className=`ai-message ${s}-message`;p.innerText=t;els.chatBox.appendChild(p);els.chatBox.scrollTop=els.chatBox.scrollHeight};const vsStyles={"Padrão":{pitch:1,rate:1},"Narrador (Grave)":{pitch:.5,rate:.9},"Assistente Robótico":{pitch:1,rate:1.2},"Apresentador Animado":{pitch:1.4,rate:1.1}};Object.keys(vsStyles).forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;els.voiceStyleSelect.appendChild(o)});els.voiceStyleSelect.value=cfg.voiceStyle;const spkTxt=t=>{if(!'speechSynthesis'in window)return;const u=new SpeechSynthesisUtterance(t);const s=vsStyles[cfg.voiceStyle];u.pitch=s.pitch;u.rate=s.rate;u.lang='pt-BR';speechSynthesis.cancel();speechSynthesis.speak(u)};function typeTxt(e,t){addMsg("Ok, começando a escrever...","bot");let i=0;e.focus();const n=setInterval(()=>{if(i<t.length){const s=t[i];document.execCommand("insertText",!1,s);e.dispatchEvent(new Event("input",{bubbles:!0}));i++}else{clearInterval(n);addMsg("Terminei!","bot");wt.style.boxShadow='';wt=null}},20)}els.writeBtn.addEventListener('click',()=>{addMsg("Modo de Seleção: Clique em uma caixa de texto.","bot");document.body.style.cursor='crosshair';const h=e=>{e.preventDefault();e.stopPropagation();const t=e.target;if(t.tagName==='TEXTAREA'||t.tagName==='INPUT'||t.isContentEditable){wt=t;wt.style.boxShadow='0px 0px 5px 3px #4285F4';addMsg("Alvo selecionado!","bot")}else{addMsg("Alvo inválido.","bot")}document.body.style.cursor='default';document.removeEventListener('click',h,!0)};document.addEventListener('click',h,!0)});const stopDynVision=()=>{if(vs){vs.getTracks().forEach(t=>t.stop())}if(vr){vr.stop()}els.stopVisionBtn.style.display='none';els.container.style.display='flex';spkTxt("Visão dinâmica encerrada.");vs=null;vr=null};async function getApiResponse(t,n=null){if(!cfg.apiKey)return addMsg("Chave de API do Gemini não configurada.","bot");const c=[{parts:[{text:t}]}];if(n){c[0].parts.push({inline_data:{mime_type:"image/jpeg",data:n}})}try{const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cfg.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:c})});if(!r.ok)throw new Error((await r.json()).error.message);const d=(await r.json()).candidates[0].content.parts[0].text;if(wt){typeTxt(wt,d)}else{addMsg(d,"bot");spkTxt(d)}}catch(e){addMsg(`Erro na API: ${e.message}`,"bot")}}const startDynVision=async()=>{if(!'mediaDevices'in navigator||!'getDisplayMedia'in navigator.mediaDevices)return addMsg("Seu navegador não suporta compartilhamento de tela.","bot");els.container.style.display='none';els.stopVisionBtn.style.display='block';try{vs=await navigator.mediaDevices.getDisplayMedia({video:!0});const sR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!sR)return stopDynVision(),addMsg("Seu navegador não suporta reconhecimento de voz.","bot");vr=new sR();vr.lang='pt-BR';vr.continuous=!0;vr.interimResults=!1;vr.onstart=()=>{spkTxt("Visão ativada. Pode falar.")};vr.onresult=async e=>{const t=e.results[e.results.length-1][0].transcript.trim();vr.stop();spkTxt(`Entendido. Analisando a tela sobre: ${t}`);const v=document.createElement('video');v.srcObject=vs;await new Promise(r=>v.onloadeddata=r);const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);const i=c.toDataURL('image/jpeg').split(',')[1];await getApiResponse(t,i)};vr.onend=()=>{if(vs)vr.start()};vr.start()}catch(e){addMsg("Falha ao iniciar a visão dinâmica.","bot");stopDynVision()}};els.visionBtn.addEventListener('click',startDynVision);els.stopVisionBtn.addEventListener('click',stopDynVision);const hSnd=async()=>{const t=els.input.value.trim();if(t){addMsg(t,"user");els.input.value='';await getApiResponse(t)}};els.sendBtn.addEventListener('click',hSnd);els.input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();hSnd()}});els.settingsBtn.addEventListener('click',()=>{els.apiKeyInput.value=cfg.apiKey;els.voiceStyleSelect.value=cfg.voiceStyle;els.settingsPanel.style.display='flex'});els.settingsCancelBtn.addEventListener('click',()=>{els.settingsPanel.style.display='none'});els.settingsSaveBtn.addEventListener('click',()=>{cfg.apiKey=els.apiKeyInput.value.trim();cfg.voiceStyle=els.voiceStyleSelect.value;localStorage.setItem('ai_apiKey_v2',cfg.apiKey);localStorage.setItem('ai_voiceStyle_v2',cfg.voiceStyle);els.settingsPanel.style.display='none';addMsg("Configurações salvas!","bot")});els.settingsResetBtn.addEventListener('click',()=>{if(confirm("Redefinir TODAS as configurações? Sua Chave de API será apagada.")){localStorage.removeItem('ai_apiKey_v2');localStorage.removeItem('ai_voiceStyle_v2');localStorage.removeItem('ai_assistant_pos');localStorage.removeItem('ai_assistant_version');alert("Ferramenta redefinida. Atualize a página ou clique no bookmarklet novamente.");els.container.remove();els.button.remove()}});

    }
    
    // --- 3. EXECUÇÃO INICIAL ---
    runSetup();
})();

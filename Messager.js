class Messager extends HTMLElement {
    
    //Variablen erstellen
    button = null;
    textbox = null;
    messagediv = null;
    shadowR = null;
    loading = null;
    messagearray = [];
    lastmess = "yoshy";
    sentSVG = `<svg version="1.1" id="L4" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0">
    <circle fill="#547fce" stroke="none" cx="6" cy="50" r="6">
        <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"/>    
    </circle>
    <circle fill="#547fce" stroke="none" cx="26" cy="50" r="6">
        <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite" 
            begin="0.2"/>       
    </circle>
    <circle fill="#547fce" stroke="none" cx="46" cy="50" r="6">
        <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite" 
            begin="0.3"/>     
    </circle>
</svg>`;
    pfeilSVG = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#567fcd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
    
    
    // The browser calls this method when the element is added to the DOM.
    constructor(){
        super();
        this.loadScripts();
    }
    
    //Lädt JQuery, ist eigentlich unnötig lol
    loadScripts(){
        const script1 = document.createElement('script');
        script1.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
        this.appendChild(script1);
        //console.log("jquery geladen")
    }
    
    //Setzt die Variblen
    initControls(shadowRoot){
        this.button = shadowRoot.getElementById('submit');
        this.textbox = shadowRoot.getElementById('message');
        this.loading = shadowRoot.getElementById('load');
        if (this.button === undefined || this.textbox === undefined) {
            console.log('NICHT GELADEN');
        }
        else{
            console.log('LADEN ERFOLGREICH');
        }
    }
    
    //Läd je nach Größe die richtige CSS
    loadCSS(shadowRoot) {
        let cssPath = '';
        var screenWidth = window.innerWidth;
        console.log("Größe" + screenWidth);
        //Laptop
        if (screenWidth >= 786) {
            cssPath = 'https://schmalgsicht.de/wp-content/plugins/SG_Message/style.css';
            console.log("Groß");
        }
        //Tablet
        else if (screenWidth > 360) {
            cssPath = 'https://schmalgsicht.de/wp-content/plugins/SG_Message/style.css';
            console.log("Mittel");
        }
        //Handy
        else {
            cssPath = 'https://schmalgsicht.de/wp-content/plugins/SG_Message/style.css';
            console.log("Klein");
        }
        
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = cssPath;
        const cont = shadowRoot.querySelector('div');
        cont.appendChild(cssLink);
    }
    
    //Nimmt den Textinhalt und schickt ihn per POST an saveData.php
    sendMessage(rel) {
        var message = rel.textbox.value;
        this.setGesendet(this);
        
        //wenn clearArray eingegeben wird, wird das Array geleert und die JSON gelöscht
        if(message === "clearArray")
        {
            this.clearArray(this);
            fetch('saveData.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "command": "clearArray" }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Array gelöscht und JSON-Datei gelöscht!');
                } else {
                    console.error('Fehler beim Löschen des Arrays und der JSON-Datei:', data.message);
                }
            })
            .catch(error => {
                console.error('Fehler beim Senden des Befehls zum Löschen:', error);
            });
            return;
        }
        
        //bei normalen Nachrichten, wird sie ins Array geschrieben und abgeschickt
        if(message !== "")
        {
            if(message.toLowerCase() !== rel.lastmess.toLowerCase())
            {
                rel.messagearray.push(message);
                rel.lastmess = message;
                
                // Daten senden mit fetch
                fetch('saveData.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: rel.messagearray }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log('Daten erfolgreich gesendet und gespeichert!');
                        console.log("Ist auf Sendung: " + rel.messagearray);
                    } else {
                        console.error('Fehler beim Senden der Daten', data.message);
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Senden der Daten:', error);
                });
            }
            else
            {
                console.log("Gleiche Nachricht");
            }
        }
        else
        {
            console.log("Kein Inhalt");
        }
    }
    
    //Array leeren
    clearArray(rel) {
        rel.messagearray = [];
        console.log("Array gelöscht");
    }
    
    //Zeile leeren und SVG anzeigen
    setGesendet(rel) {
        //Textbox leeren
        rel.textbox.value = "";
        rel.textbox.placeholder = "Danke für deine Nachricht!";
        rel.loading.style.display ="block";
        rel.button.style.display = "none";

        /*
        //Container schrumpfen
        rel.messagediv.style.minWidth = "10px";
        rel.messagediv.classList.add('schrumpf');
        
        //Button stylen
        rel.button.innerHTML = rel.sentSVG;
        rel.button.style.margin = "auto";
        rel.button.style.pointerEvents = "none";
        */
        
        //Nach 3 Sekunden wieder Normalzustand herstellen
        setTimeout(function() {
            //rel.messagediv.classList.add('schrumpfback');
            //rel.textbox.classList.add('wegweg');
            //rel.button.innerHTML = rel.pfeilSVG;
            //rel.button.style.pointerEvents = "auto";
            rel.textbox.placeholder = "Deine Nachricht an Chris & Lena";
            rel.loading.style.display ="none";
            rel.button.style.display = "block";
            rel.loadCSS(rel.shadowR);
            //console.log("Fertig");
        }, 4000);
        
    }
    
    //Wird aufgerufen, wenn Component erstellt
    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.messagediv = document.createElement('div');
        this.messagediv.className = "messagebox";
        shadowRoot.appendChild(this.messagediv);
        this.messagediv.innerHTML = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <input id="message" type="text" placeholder="Deine Nachricht an Chris & Lena"/>
                 <svg id="load" version="1.1" id="L4" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0">
                    <circle fill="#547fce" stroke="none" cx="6" cy="50" r="6">
                        <animate
                        attributeName="opacity"
                        dur="1s"
                        values="0;1;0"
                        repeatCount="indefinite"
                        begin="0.1"/>    
                    </circle>
                    <circle fill="#547fce" stroke="none" cx="26" cy="50" r="6">
                        <animate
                        attributeName="opacity"
                        dur="1s"
                        values="0;1;0"
                        repeatCount="indefinite" 
                        begin="0.2"/>       
                    </circle>
                    <circle fill="#547fce" stroke="none" cx="46" cy="50" r="6">
                        <animate
                        attributeName="opacity"
                        dur="1s"
                        values="0;1;0"
                        repeatCount="indefinite" 
                        begin="0.3"/>     
                     </circle>
                </svg>
            <button id="submit">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#567fcd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
        `;
        
        this.initControls(shadowRoot);
        this.loadCSS(shadowRoot);
        
        //setzt this aufs andere Objekt
        var _self = this;
        this.shadowR = shadowRoot;
        
        //EventListener registrieren
        this.button.addEventListener('click', function(){_self.sendMessage(_self);});
        window.addEventListener('resize', function(){_self.loadCSS(shadowRoot);});
    }
}

// Register the component
customElements.define('message-send', Messager);
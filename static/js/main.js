let grafico;
let recognition;

function initSpeech() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'es-ES';
  recognition.onresult = e => {
    document.getElementById('noticia').value = e.results[0][0].transcript;
  };
}

initSpeech();

function grabarTexto() {
  if (!recognition) {
    Swal.fire({ title: 'Error', text: 'Tu navegador no soporta reconocimiento de voz.', icon: 'error' });
    return;
  }
  recognition.start();
}

function clasificar() {
  const texto = document.getElementById('noticia').value;
  const spinner = document.getElementById('spinner');
  const resultado = document.getElementById('resultado');
  const canvas = document.getElementById('graficoConfianza');
  const iaThinking = document.getElementById('iaThinking');

  resultado.innerText = '';
  canvas.classList.add('hidden');
  iaThinking.classList.remove('hidden');
  spinner.classList.remove('hidden');

  fetch('/predecir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto })
  })
    .then(r => r.json())
    .then(data => {
      resultado.innerText = `Resultado: ${data.resultado} (${data.confianza}% confianza)`;
      Swal.fire({
        title: data.resultado==="Verdadera" ? "✅ Noticia verdadera" : "🚫 Noticia falsa",
        text: `Confianza: ${data.confianza}%`,
        icon: data.resultado==="Verdadera" ? "success" : "warning",
        confirmButtonText: "Entendido"
      });
      const msg = new SpeechSynthesisUtterance(`La noticia es ${data.resultado}, ${data.confianza} % de confianza`);
      window.speechSynthesis.speak(msg);

      canvas.classList.remove('hidden');
      const ctx = canvas.getContext('2d');
      if (grafico) grafico.destroy();
      grafico = new Chart(ctx, {
        type: 'bar',
        data: { labels:['Confianza'], datasets:[{
          label:'Nivel de confianza', data:[data.confianza],
          backgroundColor:['rgba(0,170,255,0.7)'], borderColor:['rgba(0,123,255,1)'], borderWidth:1
        }]},
        options:{ indexAxis:'y', responsive:true,
                  scales:{ x:{ min:0, max:100, ticks:{ callback:v=>v+'%' }} }
        }
      });
    })
    .catch(()=>{
      Swal.fire({ title:'Error', text:'No se pudo clasificar la noticia.', icon:'error' });
    })
    .finally(()=>{
      spinner.classList.add('hidden');
      document.getElementById('iaThinking').classList.add('hidden');
    });
}

function limpiar() {
  document.getElementById('noticia').value = '';
  document.getElementById('resultado').innerText = '';
  document.getElementById('graficoConfianza').classList.add('hidden');
  document.getElementById('iaThinking').classList.add('hidden');
  if (grafico) { grafico.destroy(); grafico = null; }
}

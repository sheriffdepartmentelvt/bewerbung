import './style.css'

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1430490370835218552/6b8rXAUjteRbedVUN8_mJ-rkcIRW2aRDoasFRpoArGnB8Qlfv7Dhrj7fmVi5ZnyoMlGG';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applicationForm');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
          name: 'Haben Sie bereits Erfahrung in anderen State Fraktionen?',
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

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: webhookName, // Hier wird der Webhook-Name gesetzt
          embeds: [embed]
        })
      });

      if (response.ok) {
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

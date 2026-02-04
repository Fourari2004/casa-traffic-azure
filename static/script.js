document.addEventListener('DOMContentLoaded', async () => {
    const zoneSelect = document.getElementById('zone');
    try {
        const response = await fetch('/zones');
        if (response.ok) {
            const data = await response.json();
            zoneSelect.innerHTML = '<option value="" disabled selected>Choisir une zone</option>';
            data.zones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone;
                zoneSelect.appendChild(option);
            });
        } else {
            zoneSelect.innerHTML = '<option value="" disabled selected>Erreur de chargement</option>';
        }
    } catch (error) {
        console.error('Erreur chargement zones:', error);
        zoneSelect.innerHTML = '<option value="" disabled selected>Erreur de chargement</option>';
    }
});

document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;

    // Affichage de l'animation de chargement
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
    submitBtn.disabled = true;

    const zone = document.getElementById('zone').value;
    const hour = parseInt(document.getElementById('hour').value);
    const day = document.getElementById('day').value; // On envoie la valeur en anglais requise par le backend (ex: "Monday")

    try {
        const response = await fetch(`/predict_traffic?zone=${encodeURIComponent(zone)}&hour=${hour}&day=${encodeURIComponent(day)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayResult(data);

    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez vérifier votre connexion.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

function displayResult(data) {
    const resultCard = document.getElementById('resultCard');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const congestionLevel = document.getElementById('congestionLevel');

    resultCard.classList.remove('hidden');

    // Détermination du statut à afficher en fonction de la réponse
    // Types de réponses : "🟢 Fluide", "🔴 Embouteillage (Éviter)", "🟠 Trafic Dense"

    let iconClass = 'fa-check-circle';
    let colorClass = 'status-green';
    let message = data.Status;

    if (message.includes('🔴') || data.Predicted_Congestion > 0.7) {
        iconClass = 'fa-exclamation-triangle';
        colorClass = 'status-red';
    } else if (message.includes('🟠') || data.Predicted_Congestion > 0.4) {
        iconClass = 'fa-exclamation-circle';
        colorClass = 'status-orange';
    } else {
        iconClass = 'fa-check-circle';
        colorClass = 'status-green'; // Par défaut
    }

    statusIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
    statusIcon.className = `status-icon ${colorClass}`;

    statusText.innerText = message;
    statusText.className = colorClass.replace('status-', 'text-');
    statusText.style.color = `var(--${colorClass.split('-')[1]})`;

    congestionLevel.innerText = `Niveau d'encombrement : ${(data.Predicted_Congestion * 100).toFixed(0)}%`;

    // Défilement fluide vers la carte de résultat pour une meilleure UX
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('closeResult').addEventListener('click', function () {
    document.getElementById('resultCard').classList.add('hidden');
});

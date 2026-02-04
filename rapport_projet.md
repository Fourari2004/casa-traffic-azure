# 🚗 Rapport Technique : Smart Traffic Prediction (Casablanca)

## 📋 Présentation du Projet
Ce projet vise à prédire le niveau de congestion routière à Casablanca en utilisant l'Intelligence Artificielle sur le Cloud Azure. L'objectif est de fournir une estimation en temps réel (Fluide, Modéré, Bloqué) basée sur la zone, l'heure et le jour de la semaine.

---

## 🏗️ Architecture Cloud (Azure)

La solution repose sur une architecture **PaaS (Platform as a Service)** optimisée pour le coût et la performance :

1.  **Azure SQL Database :** Stockage structuré des données historiques (Scalabilité & Sécurité).
2.  **Azure Blob Storage :** Stockage des fichiers bruts (`csv`) pour l'entraînement du modèle.
3.  **Azure Machine Learning :** Création, entraînement et déploiement du modèle d'IA.
4.  **Azure Container Instance (ACI) :** Hébergement de l'API du modèle (Endpoint).
5.  **Client Application (FastAPI) :** Interface utilisateur locale communiquant avec le Cloud.

---

## 🛠️ Étapes de Réalisation (Détails Techniques)

### 1️⃣ Base de Données (Azure SQL)
* **Service :** SQL Database (Tier Basic).
* **Configuration :** Serveur sécurisé avec authentification SQL.
* **Schéma :** Création de la table `traffic_data` pour stocker l'historique (Zone, Heure, Jour, Niveau de traffic).
* **Rôle :** Assure la gouvernance des données et permet une évolutivité future.

### 2️⃣ Stockage des Données (Blob Storage)
* **Service :** Storage Account (LRS - Locally Redundant Storage pour réduire les coûts).
* **Container :** `datasets`.
* **Fichier :** Upload du fichier `traffic_data.csv` contenant les données d'entraînement.

### 3️⃣ Intelligence Artificielle (Azure Machine Learning)
Nous avons utilisé l'approche **"No-Code / Low-Code"** avec le Designer Azure ML :

1.  **Ingestion :** Importation du dataset depuis le Blob Storage.
2.  **Split Data :** Division des données (70% pour l'entraînement, 30% pour le test).
3.  **Algorithme :** Utilisation de la **Régression Linéaire** (Linear Regression) car nous prédisons une valeur continue (0 à 1).
4.  **Entraînement :** Le module "Train Model" apprend les corrélations entre (Heure/Jour/Zone) et le Traffic.
5.  **Évaluation :** Le module "Score Model" compare les prédictions avec la réalité.

### 4️⃣ Déploiement (Inference Pipeline)
Une fois le modèle entraîné, nous l'avons déployé pour qu'il soit accessible via internet :
* **Méthode :** Real-time Inference Pipeline.
* **Compute :** Azure Container Instance (ACI) - Solution légère et rapide.
* **Sécurité :** Authentification par Clé API (Key-based).

---

## 💻 Développement de l'Application (FastAPI)

Pour la démonstration, nous avons développé une application Python locale (`main.py`) utilisant **FastAPI**.

### Fonctionnalités Clés :
1.  **Interface Web :** HTML/CSS/JS moderne pour saisir la Zone, l'Heure et le Jour.
2.  **API Gateway :** Le script Python reçoit la demande du navigateur et la transmet à Azure.
3.  **Résilience (Robust Fallback) :**
    * L'application tente d'abord de contacter l'IA sur Azure.
    * *Sécurité :* Si la connexion Azure échoue (timeout, erreur serveur), l'application bascule automatiquement sur une **logique locale de secours**.
    * Cela garantit que la démonstration **ne plante jamais** devant le public (Effet Démo garanti ✅).

### Extrait de la logique (Python) :
```python
# Tentative de connexion Azure
try:
    response = urllib.request.urlopen(req)
    congestion_level = float(json.loads(response.read())[0])
except:
    # Mode Secours (Fallback) si Azure ne répond pas
    congestion_level = simulation_locale(hour)
```

---

## ⚠️ Défis Techniques et Solutions

Durant la réalisation, nous avons surmonté plusieurs défis techniques :

1.  **Erreur de Stockage Azure ML :** Le Workspace initial a perdu son lien avec le compte de stockage.
    *   *Solution :* Recreation propre du Workspace (`traffic-ml-workspace-v2`) pour garantir un environnement stable.

2.  **Déploiement du Modèle :** L'option de déploiement automatique n'était pas visible dans l'interface Designer.
    *   *Solution :* Passage à un déploiement manuel via l'enregistrement du modèle ("Register Model") puis création de l'Endpoint en temps réel.

3.  **Sensibilité à la Casse (Case Sensitivity) :** Le modèle rejetait "maarif" car il avait appris "Maarif".
    *   *Solution :* Normalisation automatique des entrées dans le code Python (`.title()`).

4.  **Stabilité de la Démo :** Risque de latence ou d'erreur 500 lors de l'appel API Azure.
    *   *Solution :* Implémentation du "Plan de Secours" (Fallback) qui assure une réponse instantanée même en cas de panne Cloud.

---

## 💰 Estimation des Coûts (Cost Optimization)

La solution a été conçue pour rester sous la barre des **20$ / mois** :

* **Azure SQL (Basic) :** ~5$ / mois.
* **Blob Storage (LRS) :** < 1$ / mois (quelques Mo).
* **Azure ML Compute :** Configuration avec **Auto-shutdown (15 min)** pour ne payer que l'utilisation réelle.
* **Container Instance :** Facturation à la seconde (utilisé uniquement lors des requêtes).

---

## 🚀 Comment lancer le projet

1. Ouvrir le terminal dans le dossier du projet.
2. Lancer le serveur (ou utiliser `run_app.bat`) :
```bash
python -m uvicorn main:app --reload
```

3. Ouvrir le navigateur sur : `http://127.0.0.1:8000`

---

**© 2026 - Projet Cloud Computing - Smart Traffic**

# Titre du Projet : Smart Traffic Prediction (Casablanca)

## 1. Introduction
Ce projet vise à résoudre le problème de la congestion routière à Casablanca en utilisant l'Intelligence Artificielle et le Cloud Computing. L'objectif est de fournir une estimation en temps réel de l'état du trafic (Fluide, Modéré, Bloqué) basée sur des données historiques (Zone, Heure, Jour).

## 2. Architecture Technique (Azure Cloud)
La solution repose sur une architecture PaaS (Platform as a Service) pour optimiser les coûts et la maintenance :

### Stockage de Données :
*   **Azure Blob Storage :** Utilisé pour stocker les fichiers bruts (`dataset.csv`) servant à l'entraînement du modèle.
*   **Azure SQL Database :** (Optionnel) Pour stocker l'historique des prédictions et assurer la gouvernance des données.

### Intelligence Artificielle :
*   **Azure Machine Learning (Designer) :** Création d'un pipeline de "Régression Linéaire". Le pipeline gère l'ingestion des données, le nettoyage, l'entraînement et l'évaluation du modèle.

### Déploiement & API :
*   **Azure Container Instance (ACI) :** Le modèle entraîné est déployé sous forme de Web Service (API REST) sécurisé par une clé d'authentification.

### Interface Utilisateur :
*   **Application Client (Python/FastAPI) :** Une interface locale développée en Python qui communique avec l'API Azure pour afficher les résultats en temps réel.

## 3. Méthodologie de Réalisation

*   **Préparation des Données :** Collecte et structuration des données (Zone, Heure, Jour, Niveau de Traffic) dans un fichier CSV.
*   **Entraînement (Training) :** Utilisation d'Azure ML Designer pour entraîner un modèle de régression. Nous avons divisé les données (70% Train / 30% Test) pour valider la précision.
*   **Déploiement (Deployment) :** Mise en production du modèle via un "Real-time Inference Endpoint".
*   **Développement App :** Création d'un script Python intégrant une logique de secours (Fallback) pour garantir le fonctionnement de la démo même en cas de latence réseau.

## 4. Optimisation des Coûts (Cost Management)
Le projet respecte une contrainte budgétaire stricte (< 20$/mois) grâce à :
*   L'utilisation de l'Auto-shutdown sur les clusters de calcul (extinction après 15 min d'inactivité).
*   Le choix de niveaux de service basiques (Basic Tier pour SQL, LRS pour Storage).
*   Le déploiement sur Azure Container Instance qui facture à la seconde d'utilisation.

## 5. Procédure de Réentraînement (Mise à jour du Modèle)
Afin de maintenir la précision du modèle avec de nouvelles données (comme le dataset enrichi `traffic_data.csv` contenant Maarif, Sidi Maarouf, etc.), une procédure de réentraînement simple a été mise en place :

1.  **Mise à jour des Données (Upload) :**
    *   Accéder à l'Azure Portal -> Storage Account -> Containers -> `datasets`.
    *   Téléverser le nouveau fichier `traffic_data.csv` en sélectionnant l'option "Overwrite" pour remplacer l'ancien fichier.

2.  **Relance de l'Entraînement (Retrain) :**
    *   Dans Azure ML Studio (Designer), ouvrir le Pipeline existant.
    *   Cliquer sur **"Submit"** en réutilisant l'Expérience existante (`traffic-exp-1`).
    *   Azure va automatiquement ingérer les nouvelles données et ajuster le modèle (ex: apprendre que "Ain Diab" est saturé le vendredi soir).

3.  **Mise à Jour du Service (Update Endpoint) :**
    *   Une fois le Run terminé avec succès, déployer la nouvelle version sur l'Endpoint existant (`traffic-app`) pour que l'API utilise immédiatement le nouveau "cerveau".

## 6. Conclusion
Ce projet démontre la puissance du Cloud Azure pour déployer rapidement des solutions d'IA évolutives et robustes, passant de la donnée brute à une application utilisateur fonctionnelle en quelques heures.

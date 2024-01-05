const taillePlateau = 8;
const plateau = [];
let joueurActuel = null;
let jeuCommence = false;

function initialiserPlateau() {
    for (let i = 0; i < taillePlateau; i++) {
        plateau[i] = Array.from({ length: taillePlateau }, () => null);
    }
    // Placer les pions initiaux
    plateau[3][3] = 'blanc';
    plateau[3][4] = 'noir';
    plateau[4][3] = 'noir';
    plateau[4][4] = 'blanc';
}

function creerPlateau() {
    const elementPlateau = document.getElementById('plateau');
    elementPlateau.innerHTML = '';
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            const cellule = document.createElement('div');
            cellule.className = 'cellule';
            cellule.dataset.ligne = i;
            cellule.dataset.colonne = j;
            cellule.addEventListener('click', gererClicCellule);
            elementPlateau.appendChild(cellule);
        }
    }
    mettreAJourPlateau();
}

function mettreAJourPlateau() {
    const cellules = document.querySelectorAll('.cellule');
    cellules.forEach(cellule => {
        const ligne = parseInt(cellule.dataset.ligne);
        const colonne = parseInt(cellule.dataset.colonne);
        const piece = plateau[ligne][colonne];
        cellule.textContent = piece ? '●' : '';
        cellule.className = `cellule ${piece || ''}`;
    });
}

function gererClicCellule(event) {
    if (!jeuCommence) {
        showCustomAlert("Le jeu n'a pas encore commencé. Veuillez cliquer sur 'Commencer le jeu'.");
        return;
    }

    const ligne = parseInt(event.target.dataset.ligne);
    const colonne = parseInt(event.target.dataset.colonne);

    if (estCoupValide(ligne, colonne)) {
        plateau[ligne][colonne] = joueurActuel;
        mettreAJourPlateau();
        mettreAJourScores();
        if (estFinDeJeu()) {
            declarerGagnant();
            jeuCommence = false;
            document.getElementById('commencerJeu').style.display = 'block';
        } else {
            changerJoueur();
        }
    } else {
        showCustomAlert('Coup invalide. Choisissez une case valide.');
    }
}

function estCoupValide(ligne, colonne) {
    // Vérifier si la case est vide
    if (plateau[ligne][colonne] !== null) {
        return false;
    }

    // Vérifier s'il y a un pion adjacent
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nouvelleLigne = ligne + i;
            const nouvelleColonne = colonne + j;
            if (nouvelleLigne >= 0 && nouvelleLigne < taillePlateau && nouvelleColonne >= 0 && nouvelleColonne < taillePlateau) {
                if (plateau[nouvelleLigne][nouvelleColonne] !== null) {
                    return true;
                }
            }
        }
    }

    // Aucun pion adjacent trouvé
    return false;
}


function mettreAJourScores() {
    const scoreNoir = calculerMaxAlignement('blanc');
    const scoreBlanc = calculerMaxAlignement('noir');

    document.getElementById('scoreNoir').textContent = `Score Joueur Noir: ${scoreNoir}`;
    document.getElementById('scoreBlanc').textContent = `Score Joueur Blanc: ${scoreBlanc}`;
}



function changerJoueur() {
    // Mettre à jour le joueur actuel
    joueurActuel = joueurActuel === 'noir' ? 'blanc' : 'noir';

    // Mettre à jour l'affichage du joueur actuel
    mettreAJourJoueurActuel();

    // Mettre à jour la couleur du conteneur en fonction du joueur
    var conteneurJoueurActuel = document.getElementById('conteneurJoueurActuel');
    conteneurJoueurActuel.className = joueurActuel === 'blanc' ? 'joueurNoir' : 'joueurBlanc';
}




function mettreAJourJoueurActuel() {
    const joueurOppose = joueurActuel === 'noir' ? 'blanc' : 'noir';
    const elementJoueurActuel = document.getElementById('joueurActuel');
    elementJoueurActuel.textContent = `Joueur actuel: ${joueurOppose} !`;
}

function commencerJeu() {
    initialiserPlateau(); // Réinitialiser le plateau
    joueurActuel = determinerJoueurDebut();
    mettreAJourJoueurActuel();
    jeuCommence = true;
    document.getElementById('commencerJeu').style.display = 'none';
    creerPlateau();
    mettreAJourScores();
    changerJoueur();
}

function determinerJoueurDebut() {
    return Math.random() < 0.5 ? 'noir' : 'blanc';
}

function compterPions() {
    let compteurNoir = 0, compteurBlanc = 0;
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            if (plateau[i][j] === 'noir') {
                compteurNoir++;
            } else if (plateau[i][j] === 'blanc') {
                compteurBlanc++;
            }
        }
    }
    return { noir: compteurNoir, blanc: compteurBlanc };
}

function declarerGagnant() {
    const maxAlignementNoir = calculerMaxAlignement('blanc');
    const maxAlignementBlanc = calculerMaxAlignement('noir');

    if (maxAlignementNoir > maxAlignementBlanc) {
        showCustomAlerts("Le joueur Noir gagne avec " + maxAlignementNoir + " pions alignés !");
    } else if (maxAlignementBlanc > maxAlignementNoir) {
        showCustomAlerts("Le joueur Blanc gagne avec " + maxAlignementBlanc + " pions alignés !");
    } else {
        showCustomAlerts("Match nul avec " + maxAlignementNoir + " pions alignés !");
    }

    mettreAJourScores();
}

function estFinDeJeu() {
    // return estPlateauPlein() || !estCoupValideDisponible();
    return estPlateauPlein() || !estCoupValideDisponible() || !peutInfluencerResultat() || aAtteintAlignementMax();
}

function aAtteintAlignementMax() {
    const maxAlignementNoir = calculerMaxAlignement('blanc');
    const maxAlignementBlanc = calculerMaxAlignement('noir');

    return maxAlignementNoir === 8 || maxAlignementBlanc === 8;
}

function estPlateauPlein() {
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            if (plateau[i][j] === null) {
                return false;
            }
        }
    }
    return true;
}

function estCoupValideDisponible() {
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            if (estCoupValide(i, j)) {
                return true;
            }
        }
    }
    return false;
}

initialiserPlateau();

function showCustomAlert(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;
    alertBox.classList.add('show');

    // Faire disparaître l'alerte après un certain temps
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000); // 3000ms = 3 secondes
}


function showCustomAlerts(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;
    alertBox.classList.add('show');
}




function calculerMaxAlignement(joueur) {
    let maxAlignement = 0;
    // Parcourir le plateau pour vérifier les alignements
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            if (plateau[i][j] === joueur) {
                maxAlignement = Math.max(maxAlignement,
                    verifierAlignement(i, j, joueur));
            }
        }
    }
    return maxAlignement;
}


function verifierAlignement(ligne, colonne, joueur) {
    const directions = [
        { dx: 1, dy: 0 },  // horizontal
        { dx: 0, dy: 1 },  // vertical
        { dx: 1, dy: 1 },  // diagonale descendante
        { dx: 1, dy: -1 }  // diagonale montante
    ];

    let maxAlignement = 0;

    directions.forEach(direction => {
        let compteur = 1; // Compte le pion actuel
        let x, y;

        // Vérifier dans la direction positive
        x = ligne + direction.dx;
        y = colonne + direction.dy;
        while (x >= 0 && x < taillePlateau && y >= 0 && y < taillePlateau && plateau[x][y] === joueur) {
            compteur++;
            x += direction.dx;
            y += direction.dy;
        }

        // Vérifier dans la direction négative
        x = ligne - direction.dx;
        y = colonne - direction.dy;
        while (x >= 0 && x < taillePlateau && y >= 0 && y < taillePlateau && plateau[x][y] === joueur) {
            compteur++;
            x -= direction.dx;
            y -= direction.dy;
        }

        maxAlignement = Math.max(maxAlignement, compteur);
    });

    return maxAlignement;
}








function peutInfluencerResultat() {
    let alignementsMaxPossibles = calculerAlignementsMaxPossibles();
    let { noir, blanc } = compterPions();

    return alignementsMaxPossibles > Math.abs(noir - blanc);
}


function calculerAlignementsMaxPossibles() {
    let casesVides = compterCasesVides();
    let alignementsMaxPossibles = casesVides; 

    return alignementsMaxPossibles;
}

function compterCasesVides() {
    let compteur = 0;
    for (let i = 0; i < taillePlateau; i++) {
        for (let j = 0; j < taillePlateau; j++) {
            if (plateau[i][j] === null) {
                compteur++;
            }
        }
    }
    return compteur;
}
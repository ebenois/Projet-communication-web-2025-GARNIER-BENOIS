<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Connexion à la BDD
$host = 'localhost';
$dbname = 'ebenois';
$username = 'ebenois';
$password = 'Paozie73';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Connexion échouée : ' . $e->getMessage()]);
    exit;
}

// Récupération du JSON
$donnees_json = file_get_contents("php://input");
$donnees = json_decode($donnees_json, true);

if (!isset($donnees['notes']) || !is_array($donnees['notes'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Format de données incorrect.']);
    exit;
}

// Parcours des notes
foreach ($donnees['notes'] as $note) {
    $nomMatiere = trim($note['nom_matiere'] ?? '');
    $nomEleve = trim($note['nom_eleve'] ?? '');
    $valeurNote = floatval($note['note']);

    if ($nomMatiere === '' || $nomEleve === '' || $valeurNote < 0 || $valeurNote > 20) {
        continue; // Ignore les entrées incomplètes ou incorrectes
    }

    // Séparation nom complet (ex: "DUPONT Jean")
    $parts = explode(' ', $nomEleve, 2);
    $nom = $parts[0] ?? '';
    $prenom = $parts[1] ?? '';

    // Récupérer les IDs
    $stmtEleve = $bdd->prepare("SELECT id FROM utilisateurs WHERE nom = ? AND prenom = ? AND job = 'eleve'");
    $stmtEleve->execute([$nom, $prenom]);
    $eleve = $stmtEleve->fetch();

    $stmtMatiere = $bdd->prepare("SELECT id FROM matieres WHERE nom = ?");
    $stmtMatiere->execute([$nomMatiere]);
    $matiere = $stmtMatiere->fetch();

    // Si l'élève ou la matière n'existe pas, on ignore
    if (!$eleve || !$matiere) continue;

    $id_eleve = $eleve['id'];
    $id_matiere = $matiere['id'];

    // Vérifie si une note existe déjà
    $stmtCheck = $bdd->prepare("SELECT id FROM notes WHERE id_eleve = ? AND id_matiere = ?");
    $stmtCheck->execute([$id_eleve, $id_matiere]);
    $existe = $stmtCheck->fetch();

    if ($existe) {
        // Mise à jour
        $stmtUpdate = $bdd->prepare("UPDATE notes SET note = ? WHERE id_eleve = ? AND id_matiere = ?");
        $stmtUpdate->execute([$valeurNote, $id_eleve, $id_matiere]);
    } else {
        // Insertion
        $stmtInsert = $bdd->prepare("INSERT INTO notes (id_eleve, id_matiere, note) VALUES (?, ?, ?)");
        $stmtInsert->execute([$id_eleve, $id_matiere, $valeurNote]);
    }
}

echo json_encode(['success' => true, 'message' => 'Notes traitées avec succès.']);

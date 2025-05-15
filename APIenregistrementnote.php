<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); // Ajoute cet en-tête

$host = 'localhost';
$dbname = 'ebenois';
$username = 'ebenois';
$password = 'Paozie73';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["supprimer_toutes_notes_prof"])) {
    $profId = intval($data["supprimer_toutes_notes_prof"]);
    $stmt = $bdd->prepare("DELETE FROM notes WHERE id_prof = ?");
    $stmt->execute([$profId]);
    echo json_encode(["success" => true, "message" => "Toutes les notes du professeur $profId ont été supprimées."]);
    exit;
}

// Pour supprimer des notes spécifiques
if (isset($data["supprimer_notes"])) {
    $ids = $data["supprimer_notes"];
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $bdd->prepare("DELETE FROM notes WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    echo json_encode(["success" => true, "message" => "Notes supprimées"]);
    exit;
}

// Pour insérer des notes
if (isset($data["notes"])) {
    foreach ($data["notes"] as $note) {
        $nomEleve = $note["nom_eleve"];
        $matiere = $note["nom_matiere"];
        $noteValeur = floatval($note["note"]);
        $idProf = intval($note["utilisateur_id"]);

        // Trouver id_eleve
        $stmtEleve = $bdd->prepare("SELECT id FROM utilisateurs WHERE CONCAT(nom, ' ', prenom) = ?");
        $stmtEleve->execute([$nomEleve]);
        $eleve = $stmtEleve->fetch();
        if (!$eleve) continue;

        // Trouver id_matiere
        $stmtMatiere = $bdd->prepare("SELECT id FROM matieres WHERE nom = ?");
        $stmtMatiere->execute([$matiere]);
        $matiereData = $stmtMatiere->fetch();
        if (!$matiereData) continue;

        $stmtInsert = $bdd->prepare("INSERT INTO notes (id_eleve, id_prof, id_matiere, note) VALUES (?, ?, ?, ?)");
        $stmtInsert->execute([$eleve["id"], $idProf, $matiereData["id"], $noteValeur]);
    }

    echo json_encode(["success" => true, "message" => "Notes insérées"]);
    exit;
}

echo json_encode(["error" => "Aucune opération valide reçue."]);
?>

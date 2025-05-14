<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

// Connexion à la base de données
$host = 'localhost';
$dbname = 'ebenois';
$username = 'ebenois';
$password = 'Paozie73';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur de connexion à la base de données : ' . $e->getMessage()]);
    exit;
}

// Lecture des données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"), true);

// === AJOUT OU MISE À JOUR DES NOTES ===
if (isset($data['notes']) && !empty($data['notes'])) {
    try {
        foreach ($data['notes'] as $note) {
            $matiereNom = trim($note['nom_matiere']);
            $noteValeur = (float) $note['note'];
            $profId = (int) $note['utilisateur_id'];

            // Extraire nom et prénom de l'élève
            $eleveParts = explode(' ', trim($note['nom_eleve']), 2);
            $nomEleve = $eleveParts[0] ?? '';
            $prenomEleve = $eleveParts[1] ?? '';

            // Récupérer l'id de la matière
            $matiereStmt = $bdd->prepare("SELECT id FROM matieres WHERE nom = :nom");
            $matiereStmt->execute([':nom' => $matiereNom]);
            $idMatiere = $matiereStmt->fetchColumn();

            // Récupérer l'id de l'élève
            $eleveStmt = $bdd->prepare("SELECT id FROM utilisateurs WHERE nom = :nom AND prenom = :prenom");
            $eleveStmt->execute([':nom' => $nomEleve, ':prenom' => $prenomEleve]);
            $idEleve = $eleveStmt->fetchColumn();

            // Si on ne trouve pas matière ou élève, ignorer cette note
            if (!$idMatiere || !$idEleve) {
                continue;
            }

            // Vérifie si une note existe déjà pour cet élève, matière et prof
            $checkStmt = $bdd->prepare("
                SELECT id FROM notes
                WHERE id_matiere = :id_matiere AND id_eleve = :id_eleve AND id_prof = :id_prof
            ");
            $checkStmt->execute([
                ':id_matiere' => $idMatiere,
                ':id_eleve' => $idEleve,
                ':id_prof' => $profId
            ]);
            $noteExistante = $checkStmt->fetchColumn();

            if ($noteExistante) {
                // Mise à jour de la note existante
                $updateStmt = $bdd->prepare("UPDATE notes SET note = :note WHERE id = :id");
                $updateStmt->execute([
                    ':note' => $noteValeur,
                    ':id' => $noteExistante
                ]);
            } else {
                // Insertion d'une nouvelle note
                $insertStmt = $bdd->prepare("
                    INSERT INTO notes (id_matiere, id_eleve, id_prof, note)
                    VALUES (:id_matiere, :id_eleve, :id_prof, :note)
                ");
                $insertStmt->execute([
                    ':id_matiere' => $idMatiere,
                    ':id_eleve' => $idEleve,
                    ':id_prof' => $profId,
                    ':note' => $noteValeur
                ]);
            }
        }

        echo json_encode(['message' => 'Notes insérées ou mises à jour avec succès.']);
        exit;

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur : ' . $e->getMessage()]);
        exit;
    }
}

// === SUPPRESSION DES NOTES ===
if (isset($data['supprimer_notes']) && !empty($data['supprimer_notes'])) {
    $ids = $data['supprimer_notes'];
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    try {
        $stmt = $bdd->prepare("DELETE FROM notes WHERE id IN ($placeholders)");
        $stmt->execute($ids);

        echo json_encode(['message' => "Suppression de " . $stmt->rowCount() . " note(s)."]);
        exit;

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur lors de la suppression : ' . $e->getMessage()]);
        exit;
    }
}

// === AUCUNE ACTION EFFECTUÉE ===
echo json_encode(['error' => 'Aucune action effectuée.']);

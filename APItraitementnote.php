<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header('Content-Type: application/json');
$host = 'localhost';
$dbname = 'gestion_notes';
$username = 'root';
$password = '';

try {
    $bdd = new PDO('mysql:host='.$host.';dbname='.$dbname.';charset=utf8', $username, $password);
} catch(Exception $e) {
    die(json_encode(['error' => $e->getMessage()]));
}

$identifiant = $_GET['identifiant'] ?? '';
$motDePasse = $_GET['motDePasse'] ?? '';
$stmt = $bdd->prepare("SELECT nom,note FROM notes JOIN matieres ON notes.id_matiere = matieres.id WHERE id_eleve = (SELECT id FROM utilisateurs WHERE identifiant = ? AND mot_de_passe = ?) OR id_prof = (SELECT id FROM utilisateurs WHERE identifiant = ? AND mot_de_passe = ?)");
$stmt->execute([$identifiant,$motDePasse,$identifiant,$motDePasse]);
$resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($resultats);
?>

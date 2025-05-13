<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header('Content-Type: application/json');
$host = 'localhost';
$dbname = 'ebenois';
$username = 'ebenois';
$password = 'Paozie73';

try {
    $bdd = new PDO('mysql:host='.$host.';dbname='.$dbname.';charset=utf8', $username, $password);
} catch(Exception $e) {
    die(json_encode(['error' => $e->getMessage()]));
}

$identifiant = $_GET['identifiant'] ?? '';
$motDePasse = $_GET['motDePasse'] ?? '';
$stmt = $bdd->prepare("SELECT u.id AS utilisateur_id, CASE WHEN u.job = 'eleve' THEN (SELECT nom FROM utilisateurs WHERE id = n.id_prof) WHEN u.job = 'prof' THEN (SELECT nom FROM utilisateurs WHERE id = n.id_eleve) END AS utilisateur_nom, CASE WHEN u.job = 'eleve' THEN (SELECT prenom FROM utilisateurs WHERE id = n.id_prof) WHEN u.job = 'prof' THEN (SELECT prenom FROM utilisateurs WHERE id = n.id_eleve) END AS utilisateur_prenom, u.job, m.nom AS nom_matiere, n.note FROM notes n JOIN matieres m ON n.id_matiere = m.id JOIN utilisateurs u ON u.id = n.id_eleve OR u.id = n.id_prof WHERE u.identifiant = ? AND u.mot_de_passe = ?");
$stmt->execute([$identifiant,$motDePasse]);
$resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($resultats);
?>

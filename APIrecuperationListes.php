<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

// Connexion à la base de données
$host = 'localhost';
$dbname = 'ebenois';
$username = 'ebenois';
$password = 'Paozie73';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    exit;
}

try {
    // Récupération des matières
    $stmtMatieres = $bdd->query("SELECT nom FROM matieres");
    $matieres = $stmtMatieres->fetchAll(PDO::FETCH_COLUMN);

    // Récupération des élèves (job = 'eleve')
    $stmtEleves = $bdd->query("SELECT nom, prenom FROM utilisateurs WHERE job = 'eleve'");
    $eleves = $stmtEleves->fetchAll(PDO::FETCH_ASSOC);

    // Fusionner prénom + nom
    $nomsComplets = array_map(function ($e) {
        return $e['nom'] . ' ' . $e['prenom'];
    }, $eleves);

    // Résultat final
    echo json_encode([
        'matieres' => $matieres,
        'eleves' => $nomsComplets
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur : ' . $e->getMessage()]);
    exit;
}

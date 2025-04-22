import { useState } from 'react';
import './App.css';

function Connexion() {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [resultats, setResultats] = useState([]);

  const handleConnexion = async (e) => {
    e.preventDefault(); // empêche la soumission classique

    try {
      const response = await fetch(`http://localhost/APItraitementnote.php?identifiant=${identifiant}&motDePasse=${motDePasse}`);

      const data = await response.json();

      if (data.length > 0) {
        setResultats(data)
      } else {
        setMessage("Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
    }
  };

  return (
    <div>
      <div className="ENSC-image"></div>
      <div className="container">
        <div className='connexion'>
          <h3 style={{ textAlign: "center" }}>Connexion</h3>
          <form onSubmit={handleConnexion}>
            <div>
              <label htmlFor="identifiant">Identifiant</label>
              <br />
              <input
                type="text"
                id="identifiant"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
              />
            </div>
            <br />
            <div>
              <label htmlFor="pass">Mot de passe</label>
              <br />
              <input
                type="password"
                id="pass"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                minLength="8"
                required
              />
            </div>
            <br />
            <input type="submit" value="Se connecter" />
          </form>
          <div>
          {resultats.map((note, index) => (
          <div key={index}>
            <p>Note : {note.note}</p>
            <p>ID Matière : {note.id_matiere}</p>
          </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return(
    <>
      <Connexion />
    </>
  )
}
export default App;
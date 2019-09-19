import React, {useContext, useState} from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentiales] = useState({
       username: "test@sym.com",
       password: "password"
    });

    const [error, setError] = useState("");

    /**
     * Gestion des champs
     *
     * @param currentTarget
     */
    const handleChange = ({currentTarget}) => {
      const {value, name} = currentTarget;

      setCredentiales({...credentials, [name]: value});
    };

    /**
     * Gestion submit
     *
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        await AuthAPI.authenticate(credentials);
        setError("");
        setIsAuthenticated(true);
        toast.success("Vous êtes désormais connecté !");
        history.replace("/customers");
      } catch (error) {
          setError("Aucun compte ne possède cette adresse email ou les informations ne correspondent pas");
          toast.error("Une erreur est survenue !");
      }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} placeholder="Adresse email de connexion" error={error} />
                <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} type="password" error="" />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage ;
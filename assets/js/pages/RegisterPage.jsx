import React, {useState} from 'react';
import InvoicesAPI from "../services/InvoicesAPI";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import axios from "axios";
import UsersAPI from "../services/UsersAPI";

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    /**
     * Gestion des changements des inputs dans le formulaire
     * @param currentTarget
     */
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    /**
     * Gestion de la soumission du formulaire
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
            setErrors(apiErrors);
            return ;
        }

        try {
            await UsersAPI.register(user);
            // TODO : Notification
            setErrors({});
            history.replace('/login');
        } catch ({response}) {
            const {violations} = response.data;

            if (violations) {
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                // TODO : Notification
            }
        }
    };

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} value={user.firstName} onChange={handleChange} />
                <Field name="lastName" label="Nom de famille" placeholder="Votre nom de famille" error={errors.lastName} value={user.lastName} onChange={handleChange} />
                <Field name="email" label="Prénom" placeholder="Votre email" error={errors.email} value={user.email} onChange={handleChange} type="email" />
                <Field name="password" label="Mot de passe" placeholder="Votre mot de passe" error={errors.password} value={user.password} onChange={handleChange} type="password" />
                <Field name="passwordConfirm" label="Confirmation du mot de passe" placeholder="Confirmation du mot de passe" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange} type="password" />


                <div className="form-group">
                    <button className="submit btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    );
}

export default RegisterPage ;
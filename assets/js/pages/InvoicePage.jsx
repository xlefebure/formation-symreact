import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import {toast} from "react-toastify";

const InvoicePage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    /**
     * Récupération des clients
     * @returns {Promise<void>}
     */
    const fetchCustomers = async () => {
        try {
            const data =  await CustomersAPI.findAll();
            setCustomers(data);
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement des clients !");
            history.replace("/invoices");
        }
    };

    /**
     * Récupératin d'une facture
     * @returns {Promise<void>}
     */
    const fetchInvoice = async () => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id });
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement de la facture !");
            history.replace("/invoices");
        }
    };

    /**
     * Chargement de la liste des clients au chargement du composant ou changement de l'identifiant
     */
    useEffect(() => {
        fetchCustomers();
    }, []);

    /**
     * Chargement d'une invoice au chargement du composant ou changement de l'identifiant
     */
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    /**
     * Gestion des changements des inputs dans le formulaire
     * @param currentTarget
     */
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    /**
     * Gestion de la soumission du formulaire
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée !");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été crée !");
                history.replace("/invoices");
            }
            setErrors({});
        } catch ({response}) {
            const {violations} = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Une erreur est survenue dans le formulaire !");
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}

            <form onSubmit={handleSubmit}>
                <Field name="amount" label="Montant" placeholder="Montant de la facture" value={invoice.amount} onChange={handleChange} error={errors.amount} />
                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange}>
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </Select>
                <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="SENT">Envoyé</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button className="submit btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default InvoicePage;
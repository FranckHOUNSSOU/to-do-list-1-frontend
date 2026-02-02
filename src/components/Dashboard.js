import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  intituleValidator,
  descriptionValidator,
  date_de_debutValidator,
  date_de_finValidator,
} from "../validations/task";
import {
  intituleProjetValidator,
  descriptionProjetValidator,
  date_de_debutProjetValidator,
  date_de_finProjetValidator,
  descriptionTaskProjetValidator,
  intituleTaskProjetValidator,
} from "../validations/projet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Button,
  Form,
  Modal,
  Nav,
  Dropdown,
  Accordion,
  ListGroup,
  Offcanvas,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPlus,
  FaUser,
  FaUserPlus,
  FaCaretRight,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FcCancel,
  FcDataConfiguration,
  FcPrevious,
  FcAcceptDatabase,
  FcSettings,
  FcCustomerSupport,
  FcInfo,
  FcAssistant,
  FcInvite,
} from "react-icons/fc";

function AjoutTache({ show, onClose, onTaskAdded }) {
  const schema = yup.object().shape({
    intitule: intituleValidator,
    description: descriptionValidator,
    date_de_debut: date_de_debutValidator,
    date_de_fin: date_de_finValidator,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      intitule: "",
      description: "",
      date_de_debut: null,
      date_de_fin: null,
    },
  });

  const ajouterTache = async (data) => {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateDebut = new Date(data.date_de_debut);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(data.date_de_fin);
    dateFin.setHours(0, 0, 0, 0);

    if (aujourdHui > dateDebut) {
      setError(
        "La date de début doit être supérieur ou égale à la date du jour."
      );
      return;
    }
    if (dateDebut > dateFin) {
      setError(
        "La date de début doit être antérieure ou égale à la date de fin."
      );
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_create/createTask",
        {
          intitule: data.intitule,
          description: data.description,
          date_de_debut: new Date(data.date_de_debut).toISOString(),
          date_de_fin: new Date(data.date_de_fin).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Tâche ajoutée");
      setTimeout(() => {
        setSuccess(false);
        if (onTaskAdded) onTaskAdded();
        onClose();
        reset();
      }, 1000);
    } catch (err) {
      setError("Erreur d'enrégistrement de la tâche");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une tâche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(ajouterTache)}>
          <Form.Group className="mb-3">
            <Form.Label>Intitulé</Form.Label>
            <Form.Control
              type="text"
              maxLength={25}
              {...register("intitule")}
            />
            <p className="text-danger">{errors.intitule?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("description")}
            />
            <p className="text-danger">{errors.description?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de début</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_debut"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">{errors.date_de_debut?.message}</p>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de fin</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_fin"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">{errors.date_de_fin?.message}</p>
            </div>
          </Form.Group>
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
          )}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCancel} className="me-2">
              <FcPrevious />
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function EditTache({ show, onClose, task, onTaskUpdated }) {
  const schema = yup.object().shape({
    intitule: intituleValidator,
    description: descriptionValidator,
    date_de_debut: date_de_debutValidator,
    date_de_fin: date_de_finValidator,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      intitule: task?.intitule || "",
      description: task?.description || "",
      date_de_debut: task?.date_de_debut || null,
      date_de_fin: task?.date_de_fin || null,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        intitule: task.intitule || "",
        description: task.descrition || "",
        date_de_debut: task.date_de_debut ? new Date(task.date_de_debut) : null,
        date_de_fin: task.date_de_fin ? new Date(task.date_de_fin) : null,
      });
    }
  }, [task, reset]);

  const editTache = async (data) => {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateDebut = new Date(data.date_de_debut);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(data.date_de_fin);
    dateFin.setHours(0, 0, 0, 0);

    if (aujourdHui > dateDebut) {
      setError(
        "La date de début doit être supérieur ou égale à la date du jour."
      );
      return;
    }
    if (dateDebut > dateFin) {
      setError(
        "La date de début doit être antérieure ou égale à la date de fin."
      );
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_update/updateTask",
        {
          _id: task._id,
          intitule: data.intitule,
          description: data.description,
          date_de_debut: new Date(data.date_de_debut).toISOString(),
          date_de_fin: new Date(data.date_de_fin).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Tâche modifiée");
      reset();
      setTimeout(() => {
        setSuccess(false);
        if (onTaskUpdated) onTaskUpdated();
        onClose();
      }, 1000);
    } catch (err) {
      setError("Erreur lors de la modification de la tâche");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la tâche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(editTache)}>
          <Form.Group className="mb-3">
            <Form.Label>Intitulé</Form.Label>
            <Form.Control
              type="text"
              maxLength={25}
              {...register("intitule")}
            />
            <p className="text-danger">{errors.intitule?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("description")}
            />
            <p className="text-danger">{errors.description?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de début</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_debut"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">{errors.date_de_debut?.message}</p>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de fin</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_fin"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">{errors.date_de_fin?.message}</p>
            </div>
          </Form.Group>
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
          )}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCancel} className="me-2">
              <FcPrevious />
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function AjoutProjet({ show, onClose, onProjetAdded }) {
  const schema = yup.object().shape({
    intituleProjet: intituleProjetValidator,
    descriptionProjet: descriptionProjetValidator,
    date_de_debutProjet: date_de_debutProjetValidator,
    date_de_finProjet: date_de_finProjetValidator,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      intituleProjet: "",
      descriptionProjet: "",
      date_de_debutProjet: null,
      date_de_finProjet: null,
    },
  });

  const ajouterProjet = async (data) => {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateDebut = new Date(data.date_de_debutProjet);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(data.date_de_finProjet);
    dateFin.setHours(0, 0, 0, 0);

    if (aujourdHui > dateDebut) {
      setError(
        "La date de début de votre projet doit être supérieur ou égale à la date du jour."
      );
      return;
    }
    if (dateDebut > dateFin) {
      setError(
        "La date de début de votre projet doit être antérieure ou égale à la date de fin de votre projet."
      );
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/projet_create/createProjet",
        {
          intituleProjet: data.intituleProjet,
          descriptionProjet: data.descriptionProjet,
          date_de_debutProjet: new Date(data.date_de_debutProjet).toISOString(),
          date_de_finProjet: new Date(data.date_de_finProjet).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Projet créé");
      setTimeout(() => {
        setSuccess(false);
        if (onProjetAdded) onProjetAdded();
        onClose();
        reset();
      }, 1000);
    } catch (err) {
      setError("Erreur d'enrégistrement de la tâche");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer un Projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(ajouterProjet)}>
          <Form.Group className="mb-3">
            <Form.Label>Intitulé du projet</Form.Label>
            <Form.Control
              type="text"
              maxLength={25}
              {...register("intituleProjet")}
            />
            <p className="text-danger">{errors.intituleProjet?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description du projet</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("descriptionProjet")}
            />
            <p className="text-danger">{errors.descriptionProjet?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de début du projet</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_debutProjet"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">
                {errors.date_de_debutProjet?.message}
              </p>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 row">
            <Form.Label className="col-12">Date de fin du projet</Form.Label>
            <div className="col-12">
              <Controller
                control={control}
                name="date_de_finProjet"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy  HH:mm"
                    placeholder="Choissisez une date"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className="text-danger">{errors.date_de_finProjet?.message}</p>
            </div>
          </Form.Group>
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
          )}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCancel} className="me-2">
              <FcPrevious />
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function ModalAjoutCollaborateur({
  show,
  onClose,
  projet,
  onCollaborateurAjoute,
}) {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setAdded(false);
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "api/collab_recherche/rechercheCollab",
        {
          email: search,
          projetId: projet._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Erreur lors de la recherche");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/invitation_create/createInvitation",
        {
          _id: projet._id,
          emailCollab: result.email,
          nom: result.nom,
          prenom: result.prenom,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdded(true);
      if (onCollaborateurAjoute) {
        onCollaborateurAjoute(result);
        onClose();
      }
    } catch (err) {
      setError("Erreur lors de l'envoie de l'invitation");
    }
  };

  const handleClose = () => {
    setSearch("");
    setResult(null);
    setError("");
    setAdded(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un collaborateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSearch} className="mb-3">
          <Form.Group>
            <Form.Label>Rechercher par email</Form.Label>
            <Form.Control
              type="email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Entrer l'email"
              autoFocus
            />
          </Form.Group>
          <Button
            type="submit"
            className="mt-2"
            disabled={loading || !search.trim()}
            variant="primary"
          >
            {loading ? "Recherche." : "Rechercher"}
          </Button>
        </Form>

        {error && <div className="text-danger mb-2">{error}</div>}

        {result && (
          <Card className="mb-2">
            <Card.Body className="d-flex align-items-center">
              <FaUserPlus size={36} className="me-3" />
              <div className="flex-grow-1">
                <div>
                  <b>Email :</b> {result.email}
                </div>
                <div>
                  <b>Nom :</b> {result.nom}
                </div>
                <div>
                  <b>Prénom :</b> {result.prenom}
                </div>
                {added && (
                  <div className="text-success mt-2">Invitation envoyé !</div>
                )}
              </div>
              <Button
                className="ms-3"
                variant="success"
                onClick={handleAdd}
                disabled={added}
              >
                Ajouter
              </Button>
            </Card.Body>
          </Card>
        )}

        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose}>
            Retour
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function ModalAjoutTacheProjet({ show, onClose, projet, onTaskProjetAdded }) {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const schema = yup.object().shape({
    intituleTaskProjet: intituleTaskProjetValidator,
    descriptionTaskProjet: descriptionTaskProjetValidator,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { intituleTaskProjet: "", descriptionTaskProjet: "" },
  });

  useEffect(() => {
    if (projet && show) {
      const fetchCollabs = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const res = await axios.post(
            "/api/collabprojet_get/getCollabProjet",
            {
              projetId: projet._id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCollaborateurs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          setError("Erreur lors de la récupération des collaborateurs");
        }
      };
      fetchCollabs();
      setSelected([]);
      setError("");
      setAdded(false);
      reset();
    }
  }, [projet, show, reset]);

  const checkBox = (email) => {
    if (selected.includes(email)) {
      setSelected(selected.filter((e) => e !== email));
    } else {
      setSelected([...selected, email]);
    }
  };

  const onSubmit = async (data) => {
    if (selected.length === 0) {
      setError("Veuillez sélectionner au moins un collaborateur.");
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/taskProjet_create/createTaskProjet",
        {
          projetId: projet._id,
          intitule: data.intituleTaskProjet,
          description: data.descriptionTaskProjet,
          emailOwner: projet.emailOwner,
          emailCollabProjet: selected,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdded(true);
      reset();
      setSelected([]);
      onClose();
      if (onTaskProjetAdded) onTaskProjetAdded();
    } catch (err) {
      setError("Erreur lors de l'ajout des tâches.");
    }
  };

  const handleClose = () => {
    setError("");
    setAdded(false);
    setSelected([]);
    reset();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une tâche au projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Intitulé de la tâche</Form.Label>
            <Form.Control
              type="text"
              maxLength={25}
              {...register("intituleTaskProjet")}
            />
            <p className="text-danger">{errors.intituleTaskProjet?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description de la tâche</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("descriptionTaskProjet")}
            />
            <p className="text-danger">
              {errors.descriptionTaskProjet?.message}
            </p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Collaborateurs du projet</Form.Label>
            {collaborateurs && collaborateurs.length > 0 ? (
              collaborateurs.map((collab, index) => (
                <Card className="mb-2" key={index}>
                  <Card.Body className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      className="me-3"
                      onChange={() => checkBox(collab.emailCollab)}
                      checked={selected.includes(collab.emailCollab)}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0">
                        {" "}
                        <FcAssistant /> {collab.nom} {collab.prenom}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-muted">Aucun collaborateur trouvé.</div>
            )}
          </Form.Group>
          {added && (
            <div className="text-success mt-2">Tâche ajoutée avec succès </div>
          )}
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function EditProjet({ show, onClose, projet, onProjetUpdated }) {
  const schema = yup.object().shape({
    intituleProjet: intituleProjetValidator,
    descriptionProjet: descriptionProjetValidator,
    date_de_debutProjet: date_de_debutProjetValidator,
    date_de_finProjet: date_de_finProjetValidator,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      intituleProjet: projet?.intituleProjet || "",
      descriptionProjet: projet?.descriptionProjet || "",
      date_de_debutProjet: projet?.date_de_debutProjet || "",
      date_de_finProjet: projet?.date_de_finProjet || "",
    },
  });

  useEffect(() => {
    if (projet) {
      reset({
        intituleProjet: projet.intituleProjet || "",
        descriptionProjet: projet.descritionProjet || "",
        date_de_debutProjet: projet.date_de_debutProjet
          ? new Date(projet.date_de_debutProjet)
          : null,
        date_de_finProjet: projet.date_de_finProjet
          ? new Date(projet.date_de_finProjet)
          : null,
      });
    }
  }, [projet, reset]);

  const editProjet = async (data) => {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateDebut = new Date(data.date_de_debutProjet);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(data.date_de_finProjet);
    dateFin.setHours(0, 0, 0, 0);

    if (aujourdHui > dateDebut) {
      setError(
        "La date de début de votre projet doit être supérieur ou égale à la date du jour."
      );
      return;
    }
    if (dateDebut > dateFin) {
      setError(
        "La date de début de votre projet doit être antérieure ou égale à la date de fin de votre projet."
      );
      return;
    }
    console.log(projet);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/projet_update/updateProjet",
        {
          _id: projet._id,
          intituleProjet: data.intituleProjet,
          descriptionProjet: data.descriptionProjet,
          date_de_debutProjet: new Date(data.date_de_debutProjet).toISOString(),
          date_de_finProjet: new Date(data.date_de_finProjet).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Projet modifiée");
      reset();
      setTimeout(() => {
        setSuccess(false);
        if (onProjetUpdated) onProjetUpdated();
        onClose();
      }, 1000);
    } catch (err) {
      console.log("Erreur dans updateProjet:", err.message);
      setError("Erreur lors de la modification du Projet");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleCancel} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(editProjet)}>
            <Form.Group className="mb-3">
              <Form.Label>Intitulé du projet</Form.Label>
              <Form.Control
                type="text"
                maxLength={25}
                {...register("intituleProjet")}
              />
              <p className="text-danger">{errors.intituleProjet?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description du projet</Form.Label>
              <Form.Control
                as="textarea"
                maxLength={100}
                {...register("descriptionProjet")}
              />
              <p className="text-danger">{errors.descriptionProjet?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3 row">
              <Form.Label className="col-12">
                Date de début du projet
              </Form.Label>
              <div className="col-12">
                <Controller
                  control={control}
                  name="date_de_debutProjet"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy  HH:mm"
                      placeholder="Choissisez une date"
                      className="form-control"
                      style={{ width: "100%" }}
                    />
                  )}
                />
                <p className="text-danger">
                  {errors.date_de_debutProjet?.message}
                </p>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row">
              <Form.Label className="col-12">Date de fin du projet</Form.Label>
              <div className="col-12">
                <Controller
                  control={control}
                  name="date_de_finProjet"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy  HH:mm"
                      placeholder="Choissisez une date"
                      className="form-control"
                      style={{ width: "100%" }}
                    />
                  )}
                />
                <p className="text-danger">
                  {errors.date_de_finProjet?.message}
                </p>
              </div>
            </Form.Group>
            {error && (
              <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
            )}
            {success && (
              <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
            )}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                <FcPrevious />
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function EditTaskProjet({ show, onClose, taskProjet, onTaskProjetUpdated }) {
  const schema = yup.object().shape({
    intituleTaskProjet: intituleTaskProjetValidator,
    descriptionTaskProjet: descriptionTaskProjetValidator,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { intituleTaskProjet: "", descriptionTaskProjet: "" },
  });

  useEffect(() => {
    if (taskProjet) {
      reset({
        intituleTaskProjet: taskProjet.intitule || "",
        descriptionProjet: taskProjet.descrition || "",
      });
    }
  }, [taskProjet, reset]);

  const editTaskProjet = async (data) => {
    console.log(taskProjet);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/taskProjet_update/updateTaskProjet",
        {
          _id: taskProjet._id,
          intitule: data.intituleTaskProjet,
          description: data.descriptionTaskProjet,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Tache du Projet modifiée");
      setTimeout(() => {
        setSuccess(false);
        if (onTaskProjetUpdated) onTaskProjetUpdated();
        onClose();
        reset();
      }, 1000);
    } catch (err) {
      console.log("Erreur dans updateTaskProjet:", err.message);
      setError("Erreur lors de la modification de la tache du Projet");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleCancel} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Modification de la tache du Projet</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(editTaskProjet)} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Intitulé de la tâche</Form.Label>
              <Form.Control
                type="text"
                maxLength={25}
                {...register("intituleTaskProjet")}
              />
              <p className="text-danger">
                {errors.intituleTaskProjet?.message}
              </p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description de la tâche</Form.Label>
              <Form.Control
                as="textarea"
                maxLength={100}
                {...register("descriptionTaskProjet")}
              />
              <p className="text-danger">
                {errors.descriptionTaskProjet?.message}
              </p>
            </Form.Group>
            {error && (
              <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
            )}
            {success && (
              <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
            )}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function DeleteCollab({ show, onClose, deleteCollab, onCollabDeleted }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handeleDeleteCollab = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/collab_delete/deleteCollab",
        {
          projetId: deleteCollab.projetId,
          emailCollab: deleteCollab.collab.emailCollab,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Collaborateur supprimé");
      setTimeout(() => {
        setSuccess(false);
        if (onCollabDeleted) onCollabDeleted();
        onClose();
      }, 1000);
    } catch (err) {
      console.log("Erreur dans DeleteCollab", err.message);
      setError("Erreur lors de la suppression du collaborateur");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Suppression du collaborateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {deleteCollab && deleteCollab.collab && (
            <p>
              Voulez-vous vraiment supprimer le collaborateur{" "}
              {deleteCollab.collab.nom} {deleteCollab.collab.prenom} ?
            </p>
          )}
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
        )}
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleCancel} className="me-2">
            <FcPrevious />
            Annuler
          </Button>
          <Button variant="primary" onClick={handeleDeleteCollab}>
            Supprimer
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function DeleteTaskProjet({
  show,
  onClose,
  deleteTaskProjet,
  ontaskProjetbDeleted,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handeleDeleteTaskProjet = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/taskProjet_delete/deleteTaskProjet",
        {
          taskId: deleteTaskProjet._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Tâche supprimé du projet");
      setTimeout(() => {
        setSuccess(false);
        if (ontaskProjetbDeleted) ontaskProjetbDeleted();
        onClose();
      }, 1000);
    } catch (err) {
      console.log("Erreur dans DeleteTaskProjet", err.message);
      setError("Erreur lors de la suppression de la tâche du projet");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Suppression de la tâche du projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>Voulez-vous vraiment supprimer la tâche ?</p>
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
        )}
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleCancel} className="me-2">
            <FcPrevious />
            Annuler
          </Button>
          <Button variant="primary" onClick={handeleDeleteTaskProjet}>
            Supprimer
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [showAjoutModal, setShowAjoutModal] = useState(false);
  const [showEditProjetOffcanvas, setShowEditProjetOffcanvas] = useState(false);
  const [showAjoutProjetModal, setShowAjoutProjetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAjoutTaskProjetModal, setShowAjoutTaskProjetModal] =
    useState(false);
  const [showEditTaskProjetOffcanvas, setShowEditTaskProjetOffcanvas] =
    useState(false);
  const [showDeleteCollabModal, setShowDeleteCollabModal] = useState(false);
  const [showDeleteTaskProjetModal, setShowDeleteTaskProjetModal] =
    useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editProjet, setEditProjet] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskProjet, setTaskProjet] = useState([]);
  const [taskProjetPartage, setTaskProjetPartage] = useState([]);
  const [projets, setProjets] = useState([]);
  const [projetPartage, setProjetPartage] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModalCollab, setShowModalCollab] = useState(false);
  const [projetCourant, setProjetCourant] = useState(null);
  const [taskProjetCourant, setTaskProjetCourant] = useState(null);
  const [taskProjetToDelete, setTaskProjetToDelete] = useState(null);
  const [CollabToDelete, setCollabToDelete] = useState(null);
  const [projetPartageCourant, setProjetPartageCourant] = useState(null);
  const [emailUserConnect, setEmailUserConnect] = useState("");
  const [nomUserConnect, setNomUserConnect] = useState("");
  const [prenomUserConnect, setPrenomUserConnect] = useState("");
  const [invitation, setInvitation] = useState([]);
  const [invitationEmailOwner, setInvitationEmailOwner] = useState("");
  const [invitationProjetId, setInvitationProjetId] = useState("");
  const [role, setRole] = useState("");

  const userInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/user_get/getUser",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmailUserConnect(res.data.email);
      setNomUserConnect(res.data.nom);
      setPrenomUserConnect(res.data.prenom);
    } catch {
      console.error("erreur lors de la récupération des info du user");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/task_get/getTask",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(Array.isArray(res.data.task) ? res.data.task : []);
    } catch (err) {
      console.error("Erreur de recupération des taches");
    }
  };

  const fetchTaskProjet = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/taskProjet_get/getTaskProjet",
        {
          projetId: projetCourant._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTaskProjet(
        Array.isArray(res.data.taskProjet) ? res.data.taskProjet : []
      );
    } catch (err) {
      console.error("Erreur de recupération des taches du projet");
    }
  };

  useEffect(() => {
    if (projetCourant) {
      fetchTaskProjet();
    }
  }, [projetCourant, fetchTaskProjet]);

  const fetchTaskProjetPartage = async () => {
    if (!projetPartageCourant) {
      console.log("Pas de projet sélectionné");
      return;
    }

    console.log("projet partage id:", projetPartageCourant._id);
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/taskProjetPartage_get/getTaskProjetPartage",
        {
          projetId: projetPartageCourant._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTaskProjetPartage(res.data.taskProjetPartage);
      console.log(
        "taches mise à jour dans setTaskProjetPartage:",
        res.data.taskProjetPartage
      );
    } catch (err) {
      console.error("Erreur de recupération des taches du projet partagé", err);
    }
  };

  useEffect(() => {
    if (projetPartageCourant) {
      fetchTaskProjetPartage();
      fetchRole();
    }
  }, [projetPartageCourant]);

  const fetchProjet = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/projet_get/getProjet",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjets(Array.isArray(res.data.projet) ? res.data.projet : []);
    } catch (err) {
      console.error("Erreur de recupération des projets");
    }
  };

  const fetchProjetPartage = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/projetPartage_get/getProjetPartage",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjetPartage(res.data.projetPartage);
    } catch (err) {
      console.error("Erreur de recupération des projets partagés");
    }
  };

  const ajoutCollab = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/collab_add/addCollab",
        {
          projetId: invitationProjetId,
          emailOwner: invitationEmailOwner,
          nom: nomUserConnect,
          prenom: prenomUserConnect,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchInvitation();
    } catch (err) {
      console.error("Erreur d'ajout");
    }
  };

  const fetchInvitation = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/invitation_get/getInvitation",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInvitation(
        Array.isArray(res.data.invitation) ? res.data.invitation : []
      );
    } catch (err) {
      console.error("Erreur de recupération des Invitation");
    }
  };

  const fetchRole = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/role_get/getRole",
        {
          projetId: projetPartageCourant._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRole(res.data.role);
    } catch (err) {
      console.error("Erreur de recupération du role");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
      fetchTaskProjet();
      fetchTaskProjetPartage();
      fetchProjetPartage();
      fetchProjet();
      userInfo();
      fetchInvitation();
      fetchRole();
    }
  }, [navigate]);

  const handleChangeStatut = async (taskId, newStatut) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_update/updateTask",
        {
          _id: taskId,
          statut: newStatut,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error("Erreur de mise à jour du statut de la tâche");
    }
  };

  const handleChangeStatutTaskProjet = async (
    taskProjetId,
    newStatutTaskProjet
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/taskProjet_update/updateTaskProjet",
        {
          _id: taskProjetId,
          statut: newStatutTaskProjet,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTaskProjet();
      fetchTaskProjetPartage();
    } catch (err) {
      console.error("Erreur de mise à jour du statut de la tâche du Projet");
    }
  };

  const handleChangeRoleCollab = async (
    ProjetId,
    emailCollab,
    newRoleCollab
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/roleCollab_update/updateRoleCollab",
        {
          projetId: ProjetId,
          emailCollab: emailCollab,
          newRole: newRoleCollab,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProjet();
      fetchProjetPartage();
    } catch (err) {
      console.error(
        "Erreur de mise à jour du role du Collaborateur du projet",
        err.message
      );
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const handleEditProjet = (projet) => {
    setEditProjet(projet);
    setShowEditProjetOffcanvas(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_delete/deleteTask",
        { _id: taskId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error("Erreur de suppression de la tâche");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex flex-column flex-md-row vh-100 bg-light">
      <div
        className="d-flex flex-row flex-md-column flex-shrink-0 p-2 p-md-3 bg-white border-end align-items-center align-items-md-stretch w-100"
        style={{ maxWidth: 260 }}
      >
        <Nav
          variant="pills"
          className="flex-md-column flex-row mb-10 w-100 justify-content-center justify-content-md-start align-items-center align-items-md-stretch"
        >
          <FaUser
            size={80}
            color="#24b0f1"
            className="me-2 justify-content-center d-none d-md-block"
          />
          <label className="form-label text-break">{emailUserConnect}</label>
          <label className="form-label text-break">{nomUserConnect}</label>
          <label className="form-label text-break">{prenomUserConnect}</label>
        </Nav>
        <div className="mt-5 mb-0">
          <Button variant="" onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </Button>
        </div>
        <div className="mb-0">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header> Mon Espace</Accordion.Header>
              <Accordion.Body className="p-0">
                <ListGroup>
                  <ListGroup.Item
                    action
                    as="li"
                    active={activeTab === "taches"}
                    onClick={() => setActiveTab("taches")}
                  >
                    Tâches
                  </ListGroup.Item>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header
                        active={activeTab === "projets"}
                        onClick={() => setActiveTab("projets")}
                      >
                        Mes Projets
                      </Accordion.Header>
                      <Accordion.Body>
                        {projets &&
                          projets.map((projet) => (
                            <Accordion key={projet._id}>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                  {projet.intituleProjet}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <ListGroup>
                                    <ListGroup.Item
                                      active={activeTab === "tachesProjet"}
                                      onClick={() => {
                                        setProjetCourant(projet);
                                        setActiveTab("tachesProjet");
                                      }}
                                    >
                                      Tâches
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      active={activeTab === "membresProjet"}
                                      onClick={() => {
                                        setProjetCourant(projet);
                                        setActiveTab("membresProjet");
                                      }}
                                    >
                                      Membres
                                    </ListGroup.Item>
                                  </ListGroup>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="mb-2">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Partagés avec moi</Accordion.Header>
              <Accordion.Body>
                {projetPartage &&
                  projetPartage.map((projetPartage) => (
                    <Accordion key={projetPartage._id}>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          {projetPartage.intituleProjet}
                        </Accordion.Header>
                        <Accordion.Body>
                          <ListGroup>
                            <ListGroup.Item
                              active={activeTab === "tachesProjetPartage"}
                              onClick={() => {
                                setProjetPartageCourant(projetPartage);
                                setActiveTab("tachesProjetPartage");
                              }}
                            >
                              Tâches
                            </ListGroup.Item>
                            <ListGroup.Item
                              active={activeTab === "membresProjetPartage"}
                              onClick={() => {
                                setProjetPartageCourant(projetPartage);
                                setActiveTab("membresProjetPartage");
                              }}
                              disabled={role === "User"}
                            >
                              Membres
                            </ListGroup.Item>
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div>
          <Button
            variant=""
            active={activeTab === "invitation"}
            onClick={() => setActiveTab("invitation")}
          >
            Notifications
          </Button>
        </div>
        <div>
          <Button variant="">Paramètres</Button>
        </div>
        <div className="mt-auto w-100 d-flex justify-content-center justify-content-md-start">
          <Nav className="flex-row flex-md-column w-100">
            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </Nav>
        </div>
      </div>
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        {activeTab === "dashboard" && (
          <Container fluid className="mt-4">
            <Row className="g-4 mt-3">
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <div className="text-center text-muted">
                      Bienvenue sur le Dashboard
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
        {activeTab === "taches" && (
          <>
            <Navbar>
              <Container fluid>
                <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <button
                      className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center me-2"
                      onClick={() => setShowAjoutModal(true)}
                      style={{
                        width: 36,
                        height: 36,
                        borderColor: "#2e7d32",
                        color: "#2e7d32",
                      }}
                    >
                      <FaPlus />
                    </button>
                    <span
                      style={{
                        color: "#2e7d32",
                        fontWeight: 500,
                        fontSize: 22,
                      }}
                    >
                      Ajouter une tâche
                    </span>
                  </div>
                </div>
              </Container>
            </Navbar>
            <Container fluid className="mt-4">
              <Row className="g-4 mt-3">
                <Col xs={12}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Vos Tâches</Card.Title>
                      <div className="table-responsive-sm table-responsive-md table-responsive-lg">
                        <table
                          className="table table-bordered table-hover align-middle mb-0"
                          style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                        >
                          <thead className="table-secondary">
                            <tr>
                              <th>Numero</th>
                              <th>Tâches</th>
                              <th>Descriptions</th>
                              <th>Date de debut</th>
                              <th>Date de fin</th>
                              <th>Statuts</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks &&
                              tasks.map((task, idx) => (
                                <tr className="table-primary" key={task._id}>
                                  <td>{idx + 1}</td>
                                  <td>{task.intitule}</td>
                                  <td>{task.description}</td>
                                  <td>
                                    {format(
                                      new Date(task.date_de_debut),
                                      "dd/MM/yyyy 'à' HH:mm"
                                    )}
                                  </td>
                                  <td>
                                    {format(
                                      new Date(task.date_de_fin),
                                      "dd/MM/yyyy 'à' HH:mm"
                                    )}
                                  </td>
                                  <td>
                                    <Form.Select
                                      size="sm"
                                      value={task.statut}
                                      onChange={(e) =>
                                        handleChangeStatut(
                                          task._id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="A faire">
                                        <Button variant="dander">
                                          À faire
                                        </Button>
                                      </option>
                                      <option value="En cours">
                                        <Button variant="warning">
                                          En cours
                                        </Button>
                                      </option>
                                      <option value="Terminé">
                                        <Button variant="success">
                                          Terminé
                                        </Button>
                                      </option>
                                    </Form.Select>
                                  </td>
                                  <td>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleEditTask(task)}
                                    >
                                      <FcDataConfiguration />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleDeleteTask(task._id)}
                                    >
                                      <FcCancel />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
        {activeTab === "projets" && (
          <>
            <Navbar>
              <Container fluid>
                <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setShowAjoutProjetModal(true)}
                    >
                      <FcAcceptDatabase className="w-100" />
                      Ajouter un projet
                    </button>
                  </div>
                </div>
              </Container>
            </Navbar>
            <Container fluid className="mt-4">
              <Row className="g-4 mt-3">
                <Col xs={12}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Vos Projets</Card.Title>
                      <div className="table-responsive-sm table-responsive-md table-responsive-lg">
                        <table
                          className="table table-bordered table-hover align-middle mb-0"
                          style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                        >
                          <thead className="table-dark">
                            <tr>
                              <th>Numero</th>
                              <th>Projets</th>
                              <th>Descriptions</th>
                              <th>Date de debut</th>
                              <th>Date de fin</th>
                              <th>Collaborateurs</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projets &&
                              projets.map((projet, idx) => (
                                <tr className="table-warning" key={projet._id}>
                                  <td>{idx + 1}</td>
                                  <td>{projet.intituleProjet}</td>
                                  <td>{projet.descriptionProjet}</td>
                                  <td>
                                    {format(
                                      new Date(projet.date_de_debutProjet),
                                      "dd/MM/yyyy 'à' HH:mm"
                                    )}
                                  </td>
                                  <td>
                                    {format(
                                      new Date(projet.date_de_finProjet),
                                      "dd/MM/yyyy 'à' HH:mm"
                                    )}
                                  </td>
                                  <td>
                                    {projet.Collaborateur.map((collab, i) => (
                                      <span key={i}>
                                        <div>{collab.emailCollab}</div>
                                        {i !== projet.Collaborateur.length - 1}
                                      </span>
                                    ))}
                                  </td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant=""
                                        id="dropdown-basic"
                                      >
                                        <FcSettings /> Actions
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          className="me-2"
                                          onClick={() =>
                                            handleEditProjet(projet)
                                          }
                                        >
                                          <FcDataConfiguration /> Modifier le
                                          projet
                                        </Dropdown.Item>
                                        {/*<Dropdown.Item ><FcCancel /> Supprimer le projet</Dropdown.Item>*/}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
        {activeTab === "tachesProjet" && projetCourant && (
          <>
            <Navbar>
              <Container fluid>
                <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setShowAjoutTaskProjetModal(true)}
                    >
                      <FcInvite className="w-100" />
                      Ajouter une tâche au projet
                    </button>
                  </div>
                </div>
              </Container>
            </Navbar>
            <Container fluid className="mt-4">
              <Row className="g-4 mt-3">
                <Col xs={12}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title> Tâches du projet</Card.Title>
                      <div className="table-responsive-sm table-responsive-md table-responsive-lg">
                        <table
                          className="table table-bordered table-hover align-middle mb-0"
                          style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                        >
                          <thead className="table-secondary">
                            <tr>
                              <th>Numero</th>
                              <th>Tâches</th>
                              <th>Descriptions</th>
                              <th>Statuts</th>
                              <th>Exécutant</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taskProjet &&
                              taskProjet.map((taskProjet, idx) => (
                                <tr
                                  className="table-primary"
                                  key={taskProjet._id}
                                >
                                  <td>{idx + 1}</td>
                                  <td>{taskProjet.intitule}</td>
                                  <td>{taskProjet.description}</td>
                                  <td>
                                    <Form.Select
                                      size="sm"
                                      value={taskProjet.statut}
                                      onChange={(e) =>
                                        handleChangeStatutTaskProjet(
                                          taskProjet._id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="A faire">
                                        <Button variant="dander">
                                          À faire
                                        </Button>
                                      </option>
                                      <option value="En cours">
                                        <Button variant="warning">
                                          En cours
                                        </Button>
                                      </option>
                                      <option value="Terminé">
                                        <Button variant="success">
                                          Terminé
                                        </Button>
                                      </option>
                                    </Form.Select>
                                  </td>
                                  <td>
                                    {taskProjet.Collaborateur.map(
                                      (collab, i) => (
                                        <span key={i}>
                                          <div>
                                            <FaCaretRight />
                                            {collab.nom} {collab.prenom}
                                          </div>
                                          {i !==
                                            taskProjet.Collaborateur.length - 1}
                                        </span>
                                      )
                                    )}
                                  </td>

                                  <td>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => {
                                        setShowEditTaskProjetOffcanvas(true);
                                        setTaskProjetCourant(taskProjet);
                                      }}
                                    >
                                      <FcDataConfiguration />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => {
                                        setShowDeleteTaskProjetModal(true);
                                        setTaskProjetToDelete(taskProjet);
                                      }}
                                    >
                                      <FcCancel />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
        {activeTab === "membresProjet" && (
          <>
            <Navbar>
              <Container fluid>
                <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => {
                        setShowModalCollab(true);
                      }}
                    >
                      <FcCustomerSupport className="w-100" />
                      Ajouter un collaborateur
                    </button>
                  </div>
                </div>
              </Container>
            </Navbar>
            <Container>
              <table
                className="table table-bordered table-hover align-middle mb-0"
                style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
              >
                <thead className="table-secondary">
                  <tr>
                    <th>Numero</th>
                    <th>Email</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Rôle</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {projetCourant.Collaborateur.map((collab, idx) => (
                    <tr className="table-primary" key={collab.emailCollab}>
                      <td>{idx + 1}</td>
                      <td>{collab.emailCollab}</td>
                      <td>{collab.nom}</td>
                      <td>{collab.prenom}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={collab.role}
                          onChange={(e) =>
                            handleChangeRoleCollab(
                              projetCourant._id,
                              collab.emailCollab,
                              e.target.value
                            )
                          }
                        >
                          <option value="User">
                            <Button variant="dander">User</Button>
                          </option>
                          <option value="Manager">
                            <Button variant="warning">Manager</Button>
                          </option>
                          <option value="Admin">
                            <Button variant="success">Admin</Button>
                          </option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            setShowDeleteCollabModal(true);
                            setCollabToDelete({
                              projetId: projetCourant._id,
                              collab,
                            });
                          }}
                        >
                          <FaTrashAlt />
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Container>
          </>
        )}
        {activeTab === "invitation" && (
          <Container>
            <Row className="g-4">
              {invitation &&
                invitation.map((invitation) => (
                  <Col xs={12} md={6} lg={3}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>Invitation</Card.Title>
                        <Card.Text className="">
                          <p>
                            Vous avez une demande pour la participation au
                            projet {invitation.projetId} de{" "}
                            {invitation.emailOwner}.
                          </p>
                        </Card.Text>
                      </Card.Body>
                      <Button
                        onClick={() => {
                          setInvitationEmailOwner(invitation.emailOwner);
                          setInvitationProjetId(invitation.projetId);
                          ajoutCollab();
                        }}
                        variant="outline-success"
                      >
                        Accepter
                      </Button>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Container>
        )}
        {activeTab === "tachesProjetPartage" && projetPartageCourant && (
          <Container fluid className="mt-4">
            <Row className="g-4 mt-3">
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title> Tâches du projet</Card.Title>
                    <div className="table-responsive-sm table-responsive-md table-responsive-lg">
                      <table
                        className="table table-bordered table-hover align-middle mb-0"
                        style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                      >
                        <thead className="table-secondary">
                          <tr>
                            <th>Numero</th>
                            <th>Tâches</th>
                            <th>Descriptions</th>
                            <th>Statuts</th>
                            <th>Exécutant</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taskProjetPartage &&
                            taskProjetPartage.map((taskProjetPartage, idx) => (
                              <tr
                                className="table-primary"
                                key={taskProjetPartage._id}
                              >
                                <td>{idx + 1}</td>
                                <td>{taskProjetPartage.intitule}</td>
                                <td>{taskProjetPartage.description}</td>
                                <td>
                                  <Form.Select
                                    size="sm"
                                    value={taskProjetPartage.statut}
                                    onChange={(e) =>
                                      handleChangeStatutTaskProjet(
                                        taskProjetPartage._id,
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      !taskProjetPartage.Collaborateur.some(
                                        (collab) =>
                                          collab.emailCollab ===
                                          emailUserConnect
                                      )
                                    }
                                  >
                                    <option value="A faire">
                                      <Button variant="dander">À faire</Button>
                                    </option>
                                    <option value="En cours">
                                      <Button variant="warning">
                                        En cours
                                      </Button>
                                    </option>
                                    <option value="Terminé">
                                      <Button variant="success">Terminé</Button>
                                    </option>
                                  </Form.Select>
                                </td>
                                <td>
                                  {taskProjetPartage.Collaborateur.map(
                                    (collab, i) => (
                                      <span key={i}>
                                        <div>
                                          <FaCaretRight />
                                          {collab.nom} {collab.prenom}
                                        </div>
                                        {i !==
                                          taskProjetPartage.Collaborateur
                                            .length -
                                            1}
                                      </span>
                                    )
                                  )}
                                </td>
                                <td>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                      setShowEditTaskProjetOffcanvas(true);
                                      setTaskProjetCourant(taskProjetPartage);
                                    }}
                                    disabled={
                                      !taskProjetPartage.Collaborateur.some(
                                        (collab) =>
                                          collab.emailCollab ===
                                          emailUserConnect
                                      )
                                    }
                                  >
                                    <FcDataConfiguration />
                                  </Button>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                      setShowDeleteTaskProjetModal(true);
                                      setTaskProjetToDelete(taskProjetPartage);
                                    }}
                                    disabled={role === "User"}
                                  >
                                    <FcCancel />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
        {activeTab === "membresProjetPartage" && projetPartageCourant && (
          <Container>
            <Row className="g-4 mt-3">
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title> Tâches du projet</Card.Title>
                    <div className="table-responsive-sm table-responsive-md table-responsive-lg">
                      <table
                        className="table table-bordered table-hover align-middle mb-0"
                        style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                      >
                        <thead className="table-secondary">
                          <tr>
                            <th>Numero</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Rôle</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {projetPartageCourant &&
                            projetPartageCourant.Collaborateur &&
                            projetPartageCourant.Collaborateur.map(
                              (collab, idx) => (
                                <tr
                                  className="table-primary"
                                  key={collab.emailCollab}
                                >
                                  <td>{idx + 1}</td>
                                  <td>{collab.emailCollab}</td>
                                  <td>{collab.nom}</td>
                                  <td>{collab.prenom}</td>
                                  <td>
                                    <Form.Select
                                      size="sm"
                                      value={collab.role}
                                      onChange={(e) =>
                                        handleChangeRoleCollab(
                                          projetPartageCourant._id,
                                          collab.emailCollab,
                                          e.target.value
                                        )
                                      }
                                      disabled={role === "User"}
                                    >
                                      <option value="User">
                                        <Button variant="dander">User</Button>
                                      </option>
                                      <option value="Manager">
                                        <Button variant="warning">
                                          Manager
                                        </Button>
                                      </option>
                                      <option value="Admin">
                                        <Button variant="success">Admin</Button>
                                      </option>
                                    </Form.Select>
                                  </td>
                                  <td>
                                    <Button
                                      onClick={() => {
                                        setShowDeleteCollabModal(true);
                                        setCollabToDelete({
                                          projetId: projetPartageCourant._id,
                                          collab,
                                        });
                                      }}
                                      disabled={role === "User"}
                                    >
                                      <FaTrashAlt />
                                      Supprimer
                                    </Button>
                                  </td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}

        <AjoutTache
          show={showAjoutModal}
          onClose={() => setShowAjoutModal(false)}
          onTaskAdded={fetchTasks}
        />
        <EditTache
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={editTask}
          onTaskUpdated={fetchTasks}
        />
        <AjoutProjet
          show={showAjoutProjetModal}
          onClose={() => setShowAjoutProjetModal(false)}
          onProjetAdded={fetchProjet}
        />
        <EditProjet
          show={showEditProjetOffcanvas}
          onClose={() => setShowEditProjetOffcanvas(false)}
          projet={editProjet}
          onProjetUpdated={fetchProjet}
        />
        <ModalAjoutTacheProjet
          show={showAjoutTaskProjetModal}
          onClose={() => setShowAjoutTaskProjetModal(false)}
          projet={projetCourant}
          onTaskProjetAdded={fetchTaskProjet}
        />
        <ModalAjoutCollaborateur
          show={showModalCollab}
          onClose={() => setShowModalCollab(false)}
          projet={projetCourant}
          onCollaborateurAjoute={fetchProjet}
        />
        <EditTaskProjet
          show={showEditTaskProjetOffcanvas}
          onClose={() => setShowEditTaskProjetOffcanvas(false)}
          taskProjet={taskProjetCourant}
          onTaskProjetUpdated={fetchTaskProjet}
        />
        <DeleteCollab
          show={showDeleteCollabModal}
          onClose={() => setShowDeleteCollabModal(false)}
          deleteCollab={CollabToDelete}
          onCollabDeleted={fetchProjet}
        />
        <DeleteTaskProjet
          show={showDeleteTaskProjetModal}
          onClose={() => setShowDeleteTaskProjetModal(false)}
          deleteTaskProjet={taskProjetToDelete}
          ontaskProjetDeleted={fetchTaskProjet}
        />
      </div>
    </div>
  );
}
export default Dashboard;

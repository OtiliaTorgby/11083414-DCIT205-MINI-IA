const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// MongoDB Connection URL
const url = "mongodb://localhost:27017";
const dbName = "ugmc_emr";

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Client
const client = new MongoClient(url);

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
  console.log("Connected to MongoDB");

  const db = client.db(dbName);

  // API endpoint for patient registration
  app.post("/patients", (req, res) => {
    const patient = req.body;
    db.collection("patients").insertOne(patient, (err, result) => {
      if (err) {
        console.error("Error registering patient:", err);
        res.status(500).send("Error registering patient");
      } else {
        res.status(201).json(result.ops[0]);
      }
    });
  });

  // API endpoint for starting an encounter
  app.post("/encounters", (req, res) => {
    const encounter = req.body;
    db.collection("encounters").insertOne(encounter, (err, result) => {
      if (err) {
        console.error("Error starting encounter:", err);
        res.status(500).send("Error starting encounter");
      } else {
        res.status(201).json(result.ops[0]);
      }
    });
  });

  // API endpoint for submitting vitals
  app.post("/vitals", (req, res) => {
    const vitals = req.body;
    db.collection("vitals").insertOne(vitals, (err, result) => {
      if (err) {
        console.error("Error submitting vitals:", err);
        res.status(500).send("Error submitting vitals");
      } else {
        res.status(201).json(result.ops[0]);
      }
    });
  });

  // API endpoint for retrieving patient list
  app.get("/patients", (req, res) => {
    db.collection("patients")
      .find()
      .toArray((err, patients) => {
        if (err) {
          console.error("Error retrieving patients:", err);
          res.status(500).send("Error retrieving patients");
        } else {
          res.json(patients);
        }
      });
  });

  // API endpoint for retrieving patient(Continued):

  // details by ID
  app.get("/patients/:id", (req, res) => {
    const patientId = req.params.id;
    db.collection("patients").findOne({ _id: patientId }, (err, patient) => {
      if (err) {
        console.error("Error retrieving patient:", err);
        res.status(500).send("Error retrieving patient");
      } else if (!patient) {
        res.status(404).send("Patient not found");
      } else {
        res.json(patient);
      }
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

var bodyParser = require("body-parser"); // get body-parser
var jwt = require("jsonwebtoken"); // para trabajar el token
var fs = require("fs");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var ADODB = require("node-adodb"),
  colors = require("colors/safe");

module.exports = function (app, express) {
  var apiRouter = express.Router();
  // on routes that end in /doctors
  // ----------------------------------------------------
  apiRouter
    .route("/doctors")

    // GET Patients
    .get(function (req, res) {
      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        //Obtener datos de pacientes
        var query = conn.query(
          "SELECT * FROM tbmedicos",
          function (err, doctors) {
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }
            res.json(doctors);
          }
        );
      });
    });
  // on routes that end in /patients
  // ----------------------------------------------------
  apiRouter
    .route("/associatedPatients/:doctorId")

    // GET Patients
    .get(function (req, res) {
      var doctorId = req.params.doctorId;
      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        //Obtener datos de pacientes
        var query = conn.query(
          "SELECT tbvisitas.*,tbpacientes.NOMBRE FROM tbvisitas INNER JOIN tbpacientes ON tbvisitas.PAC_ID=tbpacientes.PAC_ID WHERE MED_ID=? ORDER BY FECHA_VIS ASC",
          doctorId,
          function (err, patients) {
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }
            res.json(patients);
          }
        );
      });
    });
  // on routes that end in /patients
  // ----------------------------------------------------
  apiRouter
    .route("/selectedPatient/:patientId")

    // GET Patients
    .get(function (req, res) {
      var patientId = req.params.patientId;

      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        //Obtener datos de pacientes
        var query = conn.query(
          "SELECT * FROM tbpacientes WHERE PAC_ID=?",
          patientId,
          function (err, personalData) {
            //1
            console.log("llego");
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }

            var connection = ADODB.open(
              "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=dicom.mdb;"
            );
            ADODB.debug = true;

            var query1 =
              'SELECT StudyInstanceUID,StudyDate,Modality,StudyDescription,StudyNumber FROM DICOMStudies WHERE PatientID="' +
              patientId +
              '"';
            connection.query(query1).on("done", function (dataStudies) {
              //2
              console.log(
                colors.green.bold("Result:"),
                colors.bold(JSON.stringify(dataStudies, null, "  "))
              );

              if (dataStudies.records.length > 0) {
                var query2 =
                  'SELECT DICOMSeries.SeriesInstanceUID,DICOMSeries.SeriesDescription,DICOMSeries.SeriesDate,DICOMSeries.SeriesTime,DICOMSeries.SeriesNumber,DICOMImages.SeriesInstanceUID,DICOMImages.ObjectFile FROM DICOMSeries INNER JOIN DICOMImages ON DICOMSeries.SeriesInstanceUID=DICOMImages.SeriesInstanceUID WHERE DICOMSeries.StudyInstanceUID="' +
                  dataStudies.records[0].StudyInstanceUID +
                  '"';
                connection.query(query2).on("done", function (dataSeries) {
                  //3
                  console.log(
                    colors.green.bold("Result:"),
                    colors.bold(JSON.stringify(dataSeries, null, "  "))
                  );
                  var patientData = {
                    personalData: personalData,
                    studies: dataStudies.records,
                    series: dataSeries.records,
                  };
                  res.json(patientData);
                }); //3
              } else {
                var patientData = {
                  personalData: personalData,
                  studies: [],
                  series: [],
                };
                res.json(patientData);
              }
            }); //2
          }
        ); //1
      });
    });

  return apiRouter;
};

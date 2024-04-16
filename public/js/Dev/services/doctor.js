angular
  .module("doctorService", [])

  .factory("Doctor", function ($http) {
    // create a new object
    var doctorFactory = {};

    // get all doctors
    doctorFactory.allDoctors = function () {
      return $http.get("/api/doctors/");
    };

    // return our entire userFactory object
    doctorFactory.associatedPatients = function (id) {
      return $http.get("/api/associatedPatients/" + id);
    };
    // get selected patients
    doctorFactory.selectedPatient = function (id) {
      return $http.get("/api/selectedPatient/" + id);
    };

    return doctorFactory;
  });

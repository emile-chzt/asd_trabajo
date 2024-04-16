var MyApp = angular.module("LabApp", [
  "ui.bootstrap",
  "doctorService",
  "ngdicomviewer",
]);

MyApp.controller("mainController", function ($scope, Doctor) {
  $scope.patientData = 0;
  $scope.doctorList = {
    Doctors: [],
  };
  $scope.showImage = 0;
  $scope.urlData;
  $scope.imageData = 0;

  Doctor.allDoctors().success(function (data) {
    $scope.doctors = data;
    for (i = 0; i < $scope.doctors.length; i++) {
      var dataDoc = {
        name: $scope.doctors[i].MED_NOMBRE,
        id: $scope.doctors[i].MED_ID,
      };
      $scope.doctorList.Doctors.push(dataDoc);
    }
  });
  $scope.doctorVisits = function (id) {
    Doctor.associatedPatients(id).success(function (data) {
      $scope.visits = data;
    });
  };
  $scope.selectedPatient = function (id) {
    $scope.patientData = 1;

    Doctor.selectedPatient(id).success(function (data) {
      $scope.patient = data.personalData[0];
      $scope.studieData = data.studies[0];
      $scope.seriesData = data.series;
    });
  };

  $scope.comeBack = function () {
    $scope.patientData = 0;
    $scope.showImage = 0;
  };
  $scope.selectImage = function (id) {
    $scope.urlData = "http://localhost:8080/images/" + id;
    $scope.showImage = 1;
  };

  $scope.closeImage = function () {
    $scope.showImage = 0;
    $scope.imageData = 0;
  };

  $scope.showTable = function () {
    $scope.imageData = 1;
  };
});

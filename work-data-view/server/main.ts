import {AppgrowingApi} from "/server/api/appgrowing/AppgrowingApi";
import {Job51Api} from "/server/api/job51/Job51Api";
import {LiepinApi} from "/server/api/liepin/LiepinApi";
import {ImportDataApi} from "/server/import-data/importdata";
import {Meteor} from 'meteor/meteor';


const Job51Methods = {
  job51_companies: async function () {
    return Job51Api.getCompanies();
  },
  job51_companiesIgnore: async function () {
    return Job51Api.getIgnoreCompMap();
  },
  job51_companiesJobCount: async function () {
    return Job51Api.getCompJobCount();
  },
};

const LiepinMethods = {
  liepin_companies: async function () {
    return LiepinApi.getCompanies();
  },
  liepin_companiesIgnore: async function () {
    return LiepinApi.getIgnoreCompMap();
  },
  liepin_companiesJobCount: async function () {
    return LiepinApi.getCompJobCounStatistic();
  },
}

const AppgrowingMethods = {
  appgrowing_import: async function () {
    await ImportDataApi.importAppgrowing();
  },
  appgrowing_devRank: async function () {
    return AppgrowingApi.getDevRank();
  },
  appgrowing_reservation: async function () {
    return AppgrowingApi.getReservations();
  },
  appgrowing_prelandingpages: async function () {
    return AppgrowingApi.getPrelandingPages();
  },


}


Meteor.methods({
  ...Job51Methods,
  ...LiepinMethods,
  ...AppgrowingMethods
});

Meteor.startup(async () => {

});

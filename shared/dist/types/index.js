"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendeeStatus = exports.UserRole = exports.VenueStatus = void 0;
var VenueStatus;
(function (VenueStatus) {
    VenueStatus["ACTIVE"] = "ACTIVE";
    VenueStatus["INACTIVE"] = "INACTIVE";
    VenueStatus["MAINTENANCE"] = "MAINTENANCE";
})(VenueStatus || (exports.VenueStatus = VenueStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ATTENDEE"] = "ATTENDEE";
    UserRole["ORGANIZER"] = "ORGANIZER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var AttendeeStatus;
(function (AttendeeStatus) {
    AttendeeStatus["REGISTERED"] = "REGISTERED";
    AttendeeStatus["ATTENDED"] = "ATTENDED";
    AttendeeStatus["CANCELLED"] = "CANCELLED";
    AttendeeStatus["REFUNDED"] = "REFUNDED";
})(AttendeeStatus || (exports.AttendeeStatus = AttendeeStatus = {}));

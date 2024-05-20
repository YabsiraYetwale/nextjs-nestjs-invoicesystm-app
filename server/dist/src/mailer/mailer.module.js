"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_service_1 = require("./mailer.service");
const mailer_controller_1 = require("./mailer.controller");
const config_1 = require("@nestjs/config");
const invoices_service_1 = require("../invoices/invoices.service");
const clients_service_1 = require("../clients/clients.service");
let MailerModule = class MailerModule {
};
MailerModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot()],
        controllers: [mailer_controller_1.MailerController],
        providers: [mailer_service_1.MailerService, invoices_service_1.InvoicesService, clients_service_1.ClientsService],
    })
], MailerModule);
exports.MailerModule = MailerModule;
//# sourceMappingURL=mailer.module.js.map
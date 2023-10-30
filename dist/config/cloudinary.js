"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: "dpvelfbzm",
    api_key: "329863168327278",
    api_secret: "9D26j0ySzLeoJJ-A1M27ViVqR_c",
    secure: true,
});
exports.default = cloudinary_1.v2;

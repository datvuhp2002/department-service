"use strict";
const express = require("express");
const DepartmentController = require("../../controllers/department.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();


// Lấy ra hết tất cả user
router.get("/getAll", asyncHandler(DepartmentController.getAll));

// Lấy ra hết tất cả user đã bị xoá
router.get("/trash", asyncHandler(DepartmentController.trash));

// Tạo ra một người dùng mới
router.post("/create", asyncHandler(DepartmentController.create));

// Cập nhật một người dùng theo id
router.put("/update/:id", asyncHandler(DepartmentController.update));

// Lấy ra chi tiết người dùng theo id
router.get("/detail/:id", asyncHandler(DepartmentController.detail));

// Xoá một người dùng theo id
router.delete("/delete/:id", asyncHandler(DepartmentController.delete));

// Khôi phục một người dùng đã bị xoá
router.put("/restore/:id", asyncHandler(DepartmentController.restore));

module.exports = router;

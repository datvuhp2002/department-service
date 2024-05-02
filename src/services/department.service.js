"use strict";

const prisma = require("../prisma");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { ObjectId } = require("mongodb");
class DepartmentService {
  static select = {
    name: true,
    description: true,
    createdBy: true,
    createdAt: true,
  };
  // create new department
  static create = async ({ name, description, createdBy }) => {
    const department = await prisma.department.create({
      data: { name, description, createdBy },
      select: this.select,
    });
    if (department) return department;
    return {
      code: 200,
      metadata: null,
    };
  };

  // get all department instances

  static getAll = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    console.log(items_per_page);
    return await this.queryDepartment({
      condition: false,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // get all department had been deleted
  static trash = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    return await this.queryDepartment({
      condition: true,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // department information
  static detail = async (id) => {
    return await prisma.department.findUnique({
      where: { department_id: id },
      select: this.select,
    });
  };
  // Cập nhật phòng ban
  static update = async ({ id, data }) => {
    return await prisma.department.update({
      where: { department_id: id },
      data,
      select: this.select,
    });
  };
  // Xoá phòng ban
  static delete = async (department_id) => {
    return await prisma.department.update({
      where: { department_id },
      data: {
        deletedMark: true,
        deletedAt: new Date(),
      },
      select: this.select,
    });
  };
  // Khôi phục lại phòng ban
  static restore = async (department_id) => {
    return await prisma.department.update({
      where: { department_id },
      data: {
        deletedMark: false,
      },
      select: this.select,
    });
  };
  static queryDepartment = async ({
    condition,
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    console.log(items_per_page);
    const itemsPerPage = Number(items_per_page) || 10;
    const currentPage = Number(page) || 1;
    const searchKeyword = search || "";
    const skip = currentPage > 1 ? (currentPage - 1) * itemsPerPage : 0;
    const departments = await prisma.department.findMany({
      take: itemsPerPage,
      skip,
      select: this.select,
      where: {
        OR: [
          {
            name: {
              contains: searchKeyword,
            },
          },
          {
            description: {
              contains: searchKeyword,
            },
          },
        ],
        AND: [
          {
            deletedMark: condition,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.department.count({
      where: {
        OR: [
          {
            name: {
              contains: searchKeyword,
            },
          },
          {
            description: {
              contains: searchKeyword,
            },
          },
        ],
        AND: [
          {
            deletedMark: condition,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPageNumber = currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPageNumber = currentPage - 1 < 1 ? null : currentPage - 1;
    return {
      departments: departments,
      total,
      nextPage: nextPageNumber,
      previousPage: previousPageNumber,
      currentPage,
      itemsPerPage,
    };
  };
}
module.exports = DepartmentService;

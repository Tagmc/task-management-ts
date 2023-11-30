import { paginationHelper } from "../../../helpers/pagination";
import { searchHelper } from "../../../helpers/search";
import Task from "../models/task.model";
import { Request, Response } from "express";
export const index = async (req: Request, res: Response) => {
    //Find
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp
    }
    // nếu theo commonJs thì cú pháp này là ok nhưng ở ts nó sẽ định nghĩa mặc đinh find chỉ có deleted: boolean
    const find: Find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    //End Find

    //Search
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End Search

    //pagination
    const countTasks = await Task.countDocuments(find); //Lay ra so san pham de dem ham count mongoose cung cap san, đã cập nhật phiên bản mới countDocuments
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 2,
    }, req.query, countTasks);
    //End pagination

    //Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    //End Sort


    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.json({
        total: countTasks,
        tasks: tasks
    });
}


export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
}

//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        type StatusType = "initial" | "doing" | "finish" | "pending" | "notFinish"
        const id: string = req.params.id;
        const status: StatusType = req.body.status;

        await Task.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái không thành công!"
        });
    }
};

//[PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {

        enum Key {
            STATUS = "status",
            DELETE = "delete"
        }

        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case Key.STATUS:
                await Task.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
            case Key.DELETE:
                await Task.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    }
};
// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
          code: 200,
          message: "Tạo thành công!",
          data: data
        });
      } catch (error) {
        res.json({
          code: 400,
          message: "Lỗi!"
        });
      }
};

// [PATCH] /api/v1/tasks/edit
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
};

// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      await Task.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
      res.json({
        code: 200,
        message: "Xóa thành công!",
      });
    } catch (error) {
      res.json({
        code: 400,
        message: "Lỗi!"
      });
    }
  };
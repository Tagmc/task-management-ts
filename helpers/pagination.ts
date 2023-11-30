interface ObjectPagination {
    currentPage: number,
    limitItems: number,
    skip?: number,
    totalPage?: number
}


export const paginationHelper = (objectPagination: ObjectPagination, query, countRecords: number): ObjectPagination => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page); // dang tra ra string nhung tra ra Number moi chuan
    }
    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit); // dang tra ra string nhung tra ra Number moi chuan
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    //console.log(objectPagination.skip);
    //Tat ca nhung doan truy van database phai dung await

    const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}
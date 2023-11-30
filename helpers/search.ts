interface ObjectSearch {
    keyword: string,
    regex?: RegExp
};

export const searchHelper = (query): ObjectSearch => {
    let objectSearch: ObjectSearch = {
        keyword: "",
        
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        // Kiểu regex k gán đươc cho string
        const regex = new RegExp(objectSearch.keyword, "i"); // de tim kiem khong phan biet chu hoa chu thuong(tu nghien cuu regex)
        objectSearch.regex = regex;
    }
    return objectSearch;
}

class ApiFuetcher {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filter() {
        const queryObj = {
            ...this.queryString
        }
        const excludeFields = ["page", 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el])

        console.log(queryObj);
        //Advanced Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('number')
        }
        return this
    }
    limitFields() {
        if (this.queryString.fields) {
            const fileds = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fileds)
        } else {
            this.query = this.query.select('-__v')
        }

        return this
    }
    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 12
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)

        return this
    }

}
module.exports = ApiFuetcher
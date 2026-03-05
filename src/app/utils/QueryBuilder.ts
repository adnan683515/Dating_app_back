import { Query } from "mongoose";
import { excludeField } from "../constant";




export class QueryBuilder<T> {

    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    // pagination, sorting, search related field গুলো বাদ দিয়ে actual filtering করা হচ্ছে
    filter(): this {


        const filter = { ...this.query }
    

        // ai kahne amra sort,  skip ,  limit ,  searchTerm gula   filter theke bad diye dibo
        // KARON filter diye sudu amra exac match korte parbo..

        // sort , skip, searcterm kaj korbe na tay bad diye disi

        for (const field of excludeField) {
            delete filter[field]
        }

        // console.log(typeof filter.isDelete)

       

        this.modelQuery = this.modelQuery.find(filter) // User.find().find(filter)

        return this

    }


    // multiple field এ regex ব্যবহার করে case-insensitive search করা হচ্ছে
    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm || ""
        if (!searchTerm) return this;


        const searchQeury = {
            $or: searchableField?.map((field) => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        }

        this.modelQuery = this.modelQuery.find(searchQeury)
        return this
    }


    // query param অনুযায়ী sorting করা হচ্ছে (default: newest first)
    sort(): this {
        const sort = this.query.sort || "-createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }


    // client কোন কোন field পেতে চায় তা select করা হচ্ছে
    fields(): this {
        const fields = this.query?.fields?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fields)
        return this

    }


    // paginate koro jonno function
    paginate(): this {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query?.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }



    populate(field: any): this {
        this.modelQuery = this.modelQuery.populate(field)
        return this
    }

    // build function call kore amra model ar query ta k response hisebe niye nibo
    build() {
        return this.modelQuery
    }

    // meta deta gula niye nibo ai funciton call kore 
    async getMeta() {

        const totalDocuments = await this.modelQuery.model.countDocuments()


        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10

        const totalpage = Math.ceil(totalDocuments / limit)

        return { page, limit, total: totalDocuments, totalpage }
    }

}
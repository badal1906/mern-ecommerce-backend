class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr; // query jo url me aati h
  }

  search() {
    //isme wo keyword h jo search krna h
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", //means case insensitive chote bade sab letters me se result do
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword }); //product.find jo hume mila h usme change krre h
    //isme hume regex se jo keyword bnaya h wo bhj dia
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //spread nhi krte to iska reference miljata fir dikkat hoti h
    //modifications copy me kro to bdia rehta h
    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"]; //ye sab remove krna h querycopy se

    removeFields.forEach((key) => delete queryCopy[key]);
    // console.log(queryCopy);

    //filter for price and ratings
    //gt lt gte lte greater than less than or equals
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)//regex se in sabko replace krdia
    // console.log(queryStr);
    //this.query model.find method hai
    this.query = this.query.find(JSON.parse(queryStr));//ye kaam case sensitive h 
    //string se vapis object bna ke bhejdia
    return this
  }


  pagination(resultPerPage){
      const currentPage = Number(this.queryStr.page) || 1

      const skippedItems = resultPerPage * (currentPage-1) //eg per page 10 item h to curr se subtract krke pata lgjaega kitni skip krni hai


      this.query = this.query.limit(resultPerPage).skip(skippedItems)
      return this
  }
}

module.exports = ApiFeatures;

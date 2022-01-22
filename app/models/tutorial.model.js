const sql = require("./db.js");

//생성자
const Tutorial = function(tutorial){
    this.title = tutorial.title;
    this.description = tutorial.description;
    this.published = tutorial.published;
}

Tutorial.create = (newTutorial, result)=>{
    sql.query("insert into tutorials set ?", newTutorial,(err, res)=>{
        if(err){
            console.log("error:",err);
            result(err, null);
            return;
        }

        console.log("created tutorial");
        result(null, {id:res.insertId, ...newTutorial});
    });
};

Tutorial.findById = (id,result)=>{
    sql.query(`select * from tutorials where id = ${id}`,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log("found tutorial: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({kind: "not_found"}, null);
    });
};

Tutorial.getAll = (title, result) => {
    let query = "select * from tutorials";

    if(title){
        query+=` where title like '%${title}%'`;
    }

    sql.query(query,(err, res)=>{
        if(err){
            console.log("error:",err);
            result(null, err);
            return;
        }
        console.log("tutorial:", res);
        result(null, res);
    });
};


Tutorial.getAllPublished = result=>{
    sql.query("select * from tutorials where published=true", (err, res)=>{
        if(err){
            console.log("error:",err);
            result(null, err);
            return;
        }
        console.log("tutorials:", res);
        result(null, res);
    });
};

Tutorial.updateById = (id, tutorial, result)=>{
    sql.query(
        "update tutorials set title = ?, description = ?, published = ? where id = ?",
        [tutorial.title, tutorial.description, tutorial.published, id],
        (err, res) => {
            if(err){
                console.log("error:", err);
                result(null, err);
                return;
            }

            if(res.affectedRows == 0){
                result({kind:"not_found"}, null);
                return;
            }

            console.log("updated tutorial:", {id:id, ...tutorial});
            result(null,{id:id, ...tutorial});
        }
    );
};

Tutorial.remove = (id,result)=>{
    sql.query("delete from tutorials where id = ?", id, (err,res)=>{
        if(err){
            console.log("error:",err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0){
            result({kind:"not_found"}, null);
            return;
        }

        console.log("deleted tutorial ok");
        result(null, res);
    });
};

Tutorial.removeAll = result => {
    sql.query("delete from tutorials", (err, res)=>{
        if(err){
            console.log("error",err);
            result(null, err);
            return;
        }

        console.log('deleted '+res.affectedRows);
        result(null, res);
    });
};

module.exports = Tutorial;